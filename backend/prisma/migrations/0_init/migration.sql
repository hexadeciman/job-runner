-- CreateTable
CREATE TABLE `t_match` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `timestamp` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `add_id` BIGINT NULL,
    `date_created` VARCHAR(100) NULL,
    `address` VARCHAR(400) NULL,
    `coordinates` VARCHAR(100) NULL,
    `price` INTEGER NULL,
    `photos` LONGTEXT NULL,
    `description` LONGTEXT NULL,
    `contact` VARCHAR(100) NULL,
    `fk_search` INTEGER NULL,
    `link` VARCHAR(400) NULL,

    UNIQUE INDEX `unique_add_id`(`add_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `t_ping` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fk_search_id` INTEGER NULL,
    `count` INTEGER NULL DEFAULT 0,
    `timestamp` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `fk_search_id`(`fk_search_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `t_search` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `search_query` VARCHAR(500) NULL DEFAULT '',
    `description` VARCHAR(100) NULL,
    `included_keywords` VARCHAR(255) NULL,
    `excluded_keywords` VARCHAR(255) NULL,
    `platform` VARCHAR(50) NULL,
    `date_created` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `archived` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

