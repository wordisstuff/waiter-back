-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'DRAFT';

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "estimatedMinutes" INTEGER,
ADD COLUMN     "estimatedReadyAt" TIMESTAMP(3),
ALTER COLUMN "total" SET DEFAULT 0;
