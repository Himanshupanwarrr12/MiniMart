import { prisma } from "../lib/prisma.js";

export const createOrderFromCart = async (userId: number) => {
  const cart = await prisma.cart.findFirst({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        userId,
        status: "PENDING",
      },
    });

    for (const cartItem of cart.items) {
      await tx.orderItems.create({
        data: {
          orderId: newOrder.id,
          productId: cartItem.productId,
          quantity: cartItem.quantity,
          price: cartItem.product.price,
        },
      });
    }

    await tx.cartItems.deleteMany({
      where: { cartId: cart.id },
    });

    return newOrder;
  });

  return await getOrderById(userId, order.id);
};

export const getOrderById = async (userId: number, orderId: number) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId,
    },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              image: true,
              description: true,
            },
          },
        },
      },
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });

  if (!order) {
    return null;
  }

  const subtotal = order.items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const itemCount = order.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const shipping = subtotal > 500 ? 0 : 50;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  const estimatedDelivery = new Date(order.createdAt);
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

  return {
    ...order,
    summary: {
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      shipping: shipping.toFixed(2),
      total: total.toFixed(2),
      itemCount,
    },
    estimatedDelivery: estimatedDelivery.toISOString(),
  };
};

export const getUserOrders = async (userId: number) => {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
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

  return orders.map((order) => {
    const subtotal = order.items.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0
    );

    const itemCount = order.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    const shipping = subtotal > 500 ? 0 : 50;
    const tax = subtotal * 0.18;
    const total = subtotal + shipping + tax;

    return {
      id: order.id,
      createdAt: order.createdAt,
      status: order.status,
      itemCount,
      total: total.toFixed(2),
      items: order.items.map((item) => ({
        productId: item.productId,
        productName: item.product.name,
        productImage: item.product.image,
        quantity: item.quantity,
      })),
    };
  });
};

export const cancelOrder = async (userId: number, orderId: number) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.status === "SHIPPED" || order.status === "delivered") {
    throw new Error("Cannot cancel shipped or delivered orders");
  }

  if (order.status === "cancelled") {
    throw new Error("Order is already cancelled");
  }

  return await prisma.order.update({
    where: { id: orderId },
    data: { status: "cancelled" },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      },
    },
  });
};
