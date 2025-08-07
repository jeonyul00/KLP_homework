-- error_log: 에러 로그 기록 테이블
CREATE TABLE `error_log` (
  `idx` INT NOT NULL AUTO_INCREMENT,
  `pk_id` VARCHAR(255) NOT NULL,
  `request_url` VARCHAR(45) NOT NULL,
  `payload` JSON NOT NULL,
  `message` TEXT NOT NULL,
  `create_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idx`)
) ENGINE=InnoDB
  AUTO_INCREMENT=30
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_0900_ai_ci
  COMMENT='에러 로그';

-- member: 사용자(회원) 테이블
CREATE TABLE `member` (
  `idx` INT NOT NULL AUTO_INCREMENT,
  `member_id` VARCHAR(45) NOT NULL,
  `member_pwd` VARCHAR(100) NOT NULL,
  `nickname` VARCHAR(45) NOT NULL,
  `thumbnail` VARCHAR(100) NOT NULL,
  `create_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `del` VARCHAR(1) NOT NULL DEFAULT 'N',
  PRIMARY KEY (`idx`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_0900_ai_ci;

-- board: 게시판 테이블
CREATE TABLE `board` (
  `idx` INT NOT NULL AUTO_INCREMENT,
  `author` INT NOT NULL,
  `title` VARCHAR(45) NOT NULL,
  `contents` VARCHAR(400) NOT NULL,
  `create_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `del` VARCHAR(1) NOT NULL DEFAULT 'N',
  PRIMARY KEY (`idx`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_0900_ai_ci;

-- board_images: 게시글 이미지 테이블
CREATE TABLE `board_images` (
  `idx` INT NOT NULL AUTO_INCREMENT,
  `board_idx` INT NOT NULL,
  `image` VARCHAR(100) NOT NULL,
  `order` VARCHAR(1) NOT NULL,
  `del` VARCHAR(1) NOT NULL DEFAULT 'N',
  PRIMARY KEY (`idx`)
) ENGINE=InnoDB
  AUTO_INCREMENT=4
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_0900_ai_ci;

-- board_comments: 게시글 댓글 테이블
CREATE TABLE `board_comments` (
  `idx` INT NOT NULL AUTO_INCREMENT,
  `board_idx` INT NOT NULL,
  `author` INT NOT NULL,
  `contents` VARCHAR(400) NOT NULL,
  `create_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `del` VARCHAR(1) NOT NULL DEFAULT 'N',
  PRIMARY KEY (`idx`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_0900_ai_ci;
