-- CreateTable
CREATE TABLE `DownloadedVideo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `filaneme` VARCHAR(191) NOT NULL,
    `platform` VARCHAR(191) NOT NULL,
    `platformId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `DownloadedVideo_filaneme_key`(`filaneme`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ConcatenatedVideo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NULL,
    `filename` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ConcatenatedVideo_filename_key`(`filename`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DownloadedConcatenatedVideo` (
    `downloadedVideoId` INTEGER NOT NULL,
    `concatenatedVideoId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`downloadedVideoId`, `concatenatedVideoId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DownloadedConcatenatedVideo` ADD CONSTRAINT `DownloadedConcatenatedVideo_downloadedVideoId_fkey` FOREIGN KEY (`downloadedVideoId`) REFERENCES `DownloadedVideo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DownloadedConcatenatedVideo` ADD CONSTRAINT `DownloadedConcatenatedVideo_concatenatedVideoId_fkey` FOREIGN KEY (`concatenatedVideoId`) REFERENCES `ConcatenatedVideo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
