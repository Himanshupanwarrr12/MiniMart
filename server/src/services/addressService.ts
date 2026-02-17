import { prisma } from "../lib/prisma.js";
import type { Prisma } from "../generated/prisma/client.js";

interface AddressData {
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pinCode: string;
  addressType?: string;
  isDefault?: boolean;
}

export const getUserAddresses = async (userId: number) => {
  return await prisma.address.findMany({
    where: { userId },
    orderBy: [
      { isDefault: "desc" }, 
      { createdAt: "desc" },
    ],
  });
};

export const getAddressById = async (userId: number, addressId: number) => {
  return await prisma.address.findFirst({
    where: {
      id: addressId,
      userId, 
    },
  });
};

export const createAddress = async (userId: number, data: AddressData) => {

  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });
  }

  const existingCount = await prisma.address.count({
    where: { userId },
  });

  return await prisma.address.create({
    data: {
      userId,
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2 || null,
      city: data.city,
      state: data.state,
      pinCode: data.pinCode,
      addressType: data.addressType || "Home",
      isDefault: existingCount === 0 ? true : (data.isDefault || false),
    },
  });
};

export const updateAddress = async (
  userId: number,
  addressId: number,
  data: Partial<AddressData>
) => {
  const address = await prisma.address.findFirst({
    where: {
      id: addressId,
      userId,
    },
  });

  if (!address) {
    throw new Error("Address not found");
  }

  if (data.isDefault) {
    await prisma.address.updateMany({
      where: {
        userId,
        id: { not: addressId },
      },
      data: { isDefault: false },
    });
  }

  const updateData: Prisma.AddressUpdateInput = {};
  
  if (data.fullName !== undefined) {
    updateData.fullName = data.fullName;
  }
  if (data.phoneNumber !== undefined) {
    updateData.phoneNumber = data.phoneNumber;
  }
  if (data.addressLine1 !== undefined) {
    updateData.addressLine1 = data.addressLine1;
  }
  if (data.addressLine2 !== undefined) {
    updateData.addressLine2 = data.addressLine2;
  }
  if (data.city !== undefined) {
    updateData.city = data.city;
  }
  if (data.state !== undefined) {
    updateData.state = data.state;
  }
  if (data.pinCode !== undefined) {
    updateData.pinCode = data.pinCode;
  }
  if (data.addressType !== undefined) {
    updateData.addressType = data.addressType;
  }
  if (data.isDefault !== undefined) {
    updateData.isDefault = data.isDefault;
  }

  return await prisma.address.update({
    where: { id: addressId },
    data: updateData,
  });
};

export const deleteAddress = async (userId: number, addressId: number) => {
  const address = await prisma.address.findFirst({
    where: {
      id: addressId,
      userId,
    },
  });

  if (!address) {
    throw new Error("Address not found");
  }

  await prisma.address.delete({
    where: { id: addressId },
  });

  if (address.isDefault) {
    const firstAddress = await prisma.address.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    if (firstAddress) {
      await prisma.address.update({
        where: { id: firstAddress.id },
        data: { isDefault: true },
      });
    }
  }

  return { message: "Address deleted successfully" };
};

export const setDefaultAddress = async (userId: number, addressId: number) => {
  const address = await prisma.address.findFirst({
    where: {
      id: addressId,
      userId,
    },
  });

  if (!address) {
    throw new Error("Address not found");
  }

  await prisma.address.updateMany({
    where: { userId },
    data: { isDefault: false },
  });

  return await prisma.address.update({
    where: { id: addressId },
    data: { isDefault: true },
  });
};