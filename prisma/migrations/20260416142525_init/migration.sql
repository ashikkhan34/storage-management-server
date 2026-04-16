/*
  Warnings:

  - You are about to drop the column `filename` on the `Upload` table. All the data in the column will be lost.
  - Added the required column `fileName` to the `Upload` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Upload" DROP COLUMN "filename",
ADD COLUMN     "fileName" TEXT NOT NULL;
