# 📄 Database DDL 문서

이 문서는 프로젝트에서 사용되는 MySQL 테이블의 DDL 정의와 각 테이블의 역할을 설명합니다.  
모든 테이블은 `utf8mb4` 문자셋과 `InnoDB` 엔진을 사용하며, Soft Delete 방식(`del = 'Y'`)이 적용되어 있습니다.

---

## 📌 테이블 목록

1. [error_log](#1-error_log-에러-로그-테이블)
2. [member](#2-member-회원-정보-테이블)
3. [board](#3-board-게시판-테이블)
4. [board_images](#4-board_images-게시글-이미지-테이블)
5. [board_comments](#5-board_comments-댓글-테이블)

---

## 1. `error_log`: 에러 로그 테이블

클라이언트/서버에서 발생한 요청 오류 및 예외를 기록하는 로그 테이블입니다.

```sql
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
```

## 2. `member`: 회원 정보 테이블

회원 로그인, 인증에 필요한 ID, 비밀번호, 닉네임, 썸네일 등을 저장합니다.

```sql
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
```

## 3. `board`: 게시판 테이블

작성자 ID와 제목, 본문 내용, 생성/수정일자, 삭제 여부 등을 포함합니다.

```sql
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
```

## 4. `board_images`: 게시글 이미지 테이블

게시글에 등록된 이미지 정보를 저장합니다. 하나의 게시글에 여러 이미지가 등록될 수 있습니다.

```sql
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
```

## 5. `board_comments`: 댓글 테이블

게시글에 달린 댓글 정보를 저장합니다.

```sql
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
```

💡 비고
모든 테이블에 del 필드를 두어 Soft Delete 방식으로 데이터를 관리합니다.
