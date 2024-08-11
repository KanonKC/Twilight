/*
  Warnings:

  - You are about to drop the column `filaneme` on the `downloadedvideo` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[filename]` on the table `DownloadedVideo` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `filename` to the `DownloadedVideo` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `DownloadedVideo_filaneme_key` ON `downloadedvideo`;

-- AlterTable
ALTER TABLE `downloadedvideo` DROP COLUMN `filaneme`,
    ADD COLUMN `filename` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `DownloadedVideo_filename_key` ON `DownloadedVideo`(`filename`);
