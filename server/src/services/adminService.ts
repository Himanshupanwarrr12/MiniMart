import { prisma } from "../lib/prisma.js";

export const getDashboardStats = async () => {
  const totalUsers = await prisma.user.count();
  const totalProducts = await prisma.product.count();
  const totalOrders = await prisma.order.count();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const ordersToday = await prisma.order.count({
    where: {
      createdAt: {
        gte: today,
      },
    },
  });

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);

  const ordersThisWeek = await prisma.order.count({
    where: {
      createdAt: {
        gte: weekStart,
      },
    },
  });

  const paidOrders = await prisma.order.findMany({
    where: {
      status: {
        in: ["processing", "SHIPPED", "delivered"],
      },
    },
    include: {
      items: true,
    },
  });

  const totalRevenue = paidOrders.reduce((sum, order) => {
    const orderTotal = order.items.reduce(
      (orderSum, item) => orderSum + Number(item.price) * item.quantity,
      0
    );
    return sum + orderTotal;
  }, 0);

  const ordersByStatus = await prisma.order.groupBy({
    by: ["status"],
    _count: {
      id: true,
    },
  });

  const recentOrders = await prisma.order.findMany({
    take: 10,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      items: {
        include: {
          product: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  const topProducts = await prisma.orderItems.groupBy({
    by: ["productId"],
    _sum: {
      quantity: true,
    },
    orderBy: {
      _sum: {
        quantity: "desc",
      },
    },
    take: 5,
  });

  const topProductsWithDetails = await Promise.all(
    topProducts.map(async (item) => {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: {
          id: true,
          name: true,
          price: true,
          image: true,
        },
      });

      return {
        ...product,
        totalSold: item._sum.quantity || 0,
      };
    })
  );

  return {
    stats: {
      totalRevenue: totalRevenue.toFixed(2),
      totalOrders,
      ordersToday,
      ordersThisWeek,
      totalProducts,
      totalUsers,
    },
    ordersByStatus: ordersByStatus.map((item) => ({
      status: item.status,
      count: item._count.id,
    })),
    recentOrders: recentOrders.map((order) => ({
      id: order.id,
      createdAt: order.createdAt,
      status: order.status,
      customer: `${order.user.firstName} ${order.user.lastName || ""}`,
      email: order.user.email,
      itemCount: order.items.length,
      total: order.items
        .reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
        .toFixed(2),
    })),
    topProducts: topProductsWithDetails,
  };
};

export const getAllOrdersForAdmin = async (filters?: {
  status?: string;
  search?: string;
}) => {
  const where: any = {};

  if (filters?.status) {
    where.status = filters.status;
  }

  if (filters?.search) {
    where.OR = [
      {
        id: isNaN(parseInt(filters.search))
          ? undefined
          : parseInt(filters.search),
      },
      {
        user: {
          OR: [
            {
              firstName: {
                contains: filters.search,
                mode: "insensitive",
              },
            },
            {
              lastName: {
                contains: filters.search,
                mode: "insensitive",
              },
            },
            {
              email: {
                contains: filters.search,
                mode: "insensitive",
              },
            },
          ],
        },
      },
    ];
  }

  const orders = await prisma.order.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      items: {
        include: {
          product: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return orders.map((order) => ({
    id: order.id,
    createdAt: order.createdAt,
    status: order.status,
    customer: `${order.user.firstName} ${order.user.lastName || ""}`,
    email: order.user.email,
    itemCount: order.items.length,
    total: order.items
      .reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
      .toFixed(2),
    items: order.items.map((item) => ({
      productName: item.product.name,
      quantity: item.quantity,
      price: item.price,
    })),
  }));
};

export const updateOrderStatus = async (
  orderId: number,
  status: string
) => {
  const validStatuses = [
    "PENDING",
    "processing",
    "SHIPPED",
    "delivered",
    "cancelled",
  ];

  if (!validStatuses.includes(status)) {
    throw new Error("Invalid order status");
  }

  return await prisma.order.update({
    where: { id: orderId },
    data: { status: status as any },
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      items: {
        include: {
          product: true,
        },
      },
    },
  });
};
