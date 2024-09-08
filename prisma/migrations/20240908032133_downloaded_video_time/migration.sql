-- AlterTable
ALTER TABLE `downloadedvideo` ADD COLUMN `duration` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `endTime` INTEGER NULL,
    ADD COLUMN `startTime` INTEGER NULL;
