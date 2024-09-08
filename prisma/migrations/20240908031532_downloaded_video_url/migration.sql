/*
  Warnings:

  - Added the required column `url` to the `DownloadedVideo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `downloadedvideo` ADD COLUMN `url` VARCHAR(191) NOT NULL;
