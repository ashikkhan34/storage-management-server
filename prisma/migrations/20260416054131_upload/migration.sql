/*
  Warnings:

  - You are about to drop the column `type` on the `Upload` table. All the data in the column will be lost.
  - You are about to alter the column `size` on the `Upload` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - Added the required column `filename` to the `Upload` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mimetype` to the `Upload` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalName` to the `Upload` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publicId` to the `Upload` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Upload" DROP CONSTRAINT "Upload_fileId_fkey";

-- AlterTable
ALTER TABLE "Upload" DROP COLUMN "type",
ADD COLUMN     "filename" TEXT NOT NULL,
ADD COLUMN     "mimetype" TEXT NOT NULL,
ADD COLUMN     "originalName" TEXT NOT NULL,
ADD COLUMN     "publicId" TEXT NOT NULL,
ALTER COLUMN "size" SET DATA TYPE INTEGER,
ALTER COLUMN "fileId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Upload" ADD CONSTRAINT "Upload_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;
