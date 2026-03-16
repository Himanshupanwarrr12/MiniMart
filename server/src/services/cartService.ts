import { prisma } from "../lib/prisma.js";

export const getOrCreateCart = async (userId: number) => {
  let cart = await prisma.cart.findFirst({
    where: { userId },
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
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
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
      },
    });
  }

  const subtotal = cart.items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const itemCount = cart.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const shipping = subtotal > 500 ? 0 : 50;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  return {
    cart,
    summary: {
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      shipping: shipping.toFixed(2),
      total: total.toFixed(2),
      itemCount,
    },
  };
};

export const addItemToCart = async (userId: number,productId: number, quantity: number) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, price: true, name: true },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  let cart = await prisma.cart.findFirst({
    where: { userId },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
    });
  }

  const existingItem = await prisma.cartItems.findFirst({
    where: {
      cartId: cart.id,
      productId,
    },
  });

  if (existingItem) {
    return await prisma.cartItems.update({
      where: { id: existingItem.id },
      data: {
        quantity: existingItem.quantity + quantity,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            image: true,
          },
        },
      },
    });
  }

  return await prisma.cartItems.create({
    data: {
      cartId: cart.id,
      productId,
      quantity,
      price: product.price,
    },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          price: true,
          image: true,
        },
      },
    },
  });
};

export const updateCartItemQuantity = async (userId: number, itemId: number, quantity: number) => {
  if (quantity < 1) {
    throw new Error("Quantity must be at least 1");
  }

  const cartItem = await prisma.cartItems.findFirst({
    where: {
      id: itemId,
      cart: {
        userId,
      },
    },
  });

  if (!cartItem) {
    throw new Error("Cart item not found");
  }

  return await prisma.cartItems.update({
    where: { id: itemId },
    data: { quantity },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          price: true,
          image: true,
        },
      },
    },
  });
};

export const removeCartItem = async (userId: number, itemId: number) => {
  const cartItem = await prisma.cartItems.findFirst({
    where: {
      id: itemId,
      cart: {
        userId,
      },
    },
  });

  if (!cartItem) {
    throw new Error("Cart item not found");
  }

  return await prisma.cartItems.delete({
    where: { id: itemId },
  });
};

export const clearCart = async (userId: number) => {
  const cart = await prisma.cart.findFirst({
    where: { userId },
  });

  if (!cart) {
    throw new Error("Cart not found");
  }

  await prisma.cartItems.deleteMany({
    where: { cartId: cart.id },
  });

  return { message: "Cart cleared successfully" };
};
