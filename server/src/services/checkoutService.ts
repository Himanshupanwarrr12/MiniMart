import { prisma } from "../lib/prisma.js";

export const getCheckoutReview = async (userId: number, addressId: number) => {
  const cart = await prisma.cart.findFirst({
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

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  const address = await prisma.address.findFirst({
    where: {
      id: addressId,
      userId,
    },
  });

  if (!address) {
    throw new Error("Address not found");
  }

  const subtotal = cart.items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  const shipping = subtotal > 500 ? 0 : 50;

  const tax = subtotal * 0.18;

  const total = subtotal + shipping + tax;

  return {
    cartItems: cart.items.map((item) => ({
      id: item.id,
      productId: item.product.id,
      productName: item.product.name,
      productImage: item.product.image,
      productDescription: item.product.description,
      price: item.price,
      quantity: item.quantity,
      subtotal: (Number(item.price) * item.quantity).toFixed(2),
    })),
    shippingAddress: {
      id: address.id,
      fullName: address.fullName,
      phoneNumber: address.phoneNumber,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      city: address.city,
      state: address.state,
      pinCode: address.pinCode,
      addressType: address.addressType,
    },
    orderSummary: {
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      shipping: shipping.toFixed(2),
      total: total.toFixed(2),
      itemCount,
    },
  };
};
