# 📘 API 명세서

React Native 앱과 Express 서버 간 통신에 사용되는 주요 API를 정리한 문서입니다.  
모든 요청은 `axios` 기반이며, 인증이 필요한 API는 `Bearer Token`을 헤더에 포함해야 합니다.

---

## 🛡 Auth API

### 🔹 POST /auth/init

리프레시 토큰을 이용해 로그인 상태를 확인합니다. (앱 최초 실행 시 호출)

**헤더**

```
Authorization: Bearer <refreshToken>
```

**응답**

```json
{
  "idx": 1,
  "member_id": "test",
  "nickname": "전율",
  ...
}
```

---

### 🔹 POST /auth/signup

회원가입을 진행합니다. multipart/form-data로 이미지 포함 전송합니다.

**헤더**

```
Content-Type: multipart/form-data
```

**Body (FormData)**
| 필드명 | 타입 | 설명 |
|------------|--------|----------------|
| member_id | string | 아이디 |
| member_pwd | string | 비밀번호 |
| nickname | string | 닉네임 |
| thumbnail | File | 프로필 이미지 |

**응답**

```json
{
  "idx": 1,
  "member_id": "test",
  "nickname": "전율",
  ...
}
```

---

### 🔹 POST /auth/signin

아이디와 비밀번호로 로그인합니다.

**Body**

```json
{
  "id": "test",
  "pwd": "1234"
}
```

**응답**

```json
{
  "idx": 1,
  "member_id": "test",
  "nickname": "전율",
  "token": "JWT access token"
}
```

---

## 📄 Board API

### 🔹 GET /board

게시글 목록을 조회합니다.

**Query Params**

```
?page=1&size=20
```

**응답**

```json
{
  "boards": [
    {
      "idx": 1,
      "title": "제목",
      "author": "닉네임",
      "thumbnail": "https://...",
      "create_date": "2025-08-01T12:00:00"
    }
  ],
  "hasNext": true
}
```

---

### 🔹 GET /board/detail

게시글 상세 정보를 조회합니다.

**Query Params**

```
?idx=1
```

**응답**

```json
{
  "idx": 1,
  "title": "제목",
  "contents": "내용",
  "images": ["https://..."],
  "author": "전율",
  ...
}
```

---

### 🔹 POST /board/regist

게시글을 등록합니다. 이미지 복수 등록 가능.

**헤더**

```
Authorization: Bearer <accessToken>
Content-Type: multipart/form-data
```

**Body (FormData)**
| 필드명 | 타입 | 설명 |
|----------|--------|--------------|
| title | string | 게시글 제목 |
| contents | string | 게시글 본문 |
| images[] | File[] | 첨부 이미지 |

**응답**

```json
{
  "status": 200,
  "message": "게시글 등록 완료"
}
```

---

### 🔹 POST /board/update

기존 게시글을 수정합니다.

**헤더 및 Body**: `/board/regist`와 동일

**응답**

```json
{
  "status": 200,
  "message": "게시글 수정 완료"
}
```

---

### 🔹 POST /board/delete

게시글을 삭제합니다. (Soft Delete)

**헤더**

```
Authorization: Bearer <accessToken>
```

**Body**

```json
{
  "boardIdx": 1
}
```

**응답**

```json
{
  "status": 200,
  "message": "게시글 삭제 완료"
}
```

---

### 🔹 POST /board/comment

댓글을 등록합니다.

**헤더**

```
Authorization: Bearer <accessToken>
```

**Body**

```json
{
  "idx": 1,
  "comment": "댓글 내용"
}
```

**응답**

```json
{
  "status": 200,
  "message": "댓글 작성 완료"
}
```

---

### 🔹 POST /board/comment/delete

댓글을 삭제합니다.

**헤더**

```
Authorization: Bearer <accessToken>
```

**Body**

```json
{
  "idx": 3
}
```

**응답**

```json
{
  "status": 200,
  "message": "댓글 삭제 완료"
}
```

---

## ⚠️ 공통 에러 응답

```json
{
  "status": 400,
  "message": "에러 메시지"
}
```
