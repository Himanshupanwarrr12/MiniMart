-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "shippingAddressLine1" TEXT,
ADD COLUMN     "shippingAddressLine2" TEXT,
ADD COLUMN     "shippingCity" TEXT,
ADD COLUMN     "shippingFullName" TEXT,
ADD COLUMN     "shippingPhoneNumber" TEXT,
ADD COLUMN     "shippingPinCode" TEXT,
ADD COLUMN     "shippingState" TEXT;
