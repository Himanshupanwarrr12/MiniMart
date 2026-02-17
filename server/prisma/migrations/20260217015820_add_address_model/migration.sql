/*
  Warnings:

  - You are about to drop the column `shippingAddressLine1` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `shippingAddressLine2` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `shippingCity` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `shippingFullName` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `shippingPhoneNumber` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `shippingPinCode` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `shippingState` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "shippingAddressLine1",
DROP COLUMN "shippingAddressLine2",
DROP COLUMN "shippingCity",
DROP COLUMN "shippingFullName",
DROP COLUMN "shippingPhoneNumber",
DROP COLUMN "shippingPinCode",
DROP COLUMN "shippingState",
ADD COLUMN     "addressId" INTEGER;

-- CreateTable
CREATE TABLE "Address" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "fullName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "pinCode" TEXT NOT NULL,
    "addressType" TEXT DEFAULT 'Home',
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
