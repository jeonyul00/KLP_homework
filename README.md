# 📱 커뮤니티 앱 서비스 과제

React Native와 Express.js 기반의 모바일 커뮤니티 앱 서비스 과제입니다.  
회원가입, 로그인, 이미지 업로드 게시글 작성 및 조회 등의 **핵심 기능을 클라이언트와 서버 양쪽에서 직접 구현**하였습니다.

---

## 🧩 프로젝트 개요

- **과제 목표**: 사용자 인증 및 게시판 기능이 포함된 클라이언트–서버 구조의 커뮤니티 앱 구현
- **클라이언트**: React Native (v0.79.5) 기반 크로스플랫폼 앱
- **서버**: Express.js 기반 API 서버
- **데이터베이스**: MySQL
- **기능 범위**: 회원가입 / 로그인 / 이미지 등록 게시판 / 목록 조회 / JWT 인증 / AWS S3 업로드 / 트랜잭션 처리 등

> ℹ️ RN 0.80 이상에서는 일부 서드파티 라이브러리(`react-native-map` 등)와의 호환 문제가 있어, 안정적인 **0.79.5 버전**으로 프로젝트를 구성하였습니다.

---

## 🧭 기능 상세

### 📲 App (React Native)

| 항목                  | 설명                                                                                                  |
| --------------------- | ----------------------------------------------------------------------------------------------------- |
| ✅ 프로젝트 초기 세팅 | ESLint, Prettier, `.env` 구성, `appName`, 아이콘, Splash 화면 설정                                    |
| ✅ 환경 설정          | 다크모드 및 가로모드 비활성화로 사용자 경험 통일                                                      |
| ✅ 화면 구성          | Stack Navigator만 사용하여 구조 단순화 및 유지보수 용이성 확보                                        |
| ✅ 상태 관리          | `zustand`를 활용해 사용자 정보 및 인증 상태 전역 관리                                                 |
| ✅ 인증 기능          | 회원가입, 로그인, 자동 로그인 구현<br>– 아이디 중복 체크, 유효성 검사 포함                            |
| ✅ 이미지 처리        | 권한 요청 → 이미지 선택(`react-native-image-picker`) → 리사이징(`image-resizer`) → `FastImage` 렌더링 |
| ✅ 보안 저장소        | `EncryptedStorage`를 통해 토큰 및 민감 정보 보안 저장                                                 |
| ✅ 게시판 기능        | 게시글 작성(복수 이미지 등록 지원), 목록 조회(커서 기반 페이지네이션 적용)                            |
| ✅ 시간 처리          | `dayjs`로 날짜 처리, 상대 시간(`3분 전`, `어제`) 출력                                                 |
| ✅ 디바운스 처리      | 버튼 연타 방지용 커스텀 `useDebounce` 적용                                                            |
| ✅ 애니메이션         | `lottie-react-native`로 UX 향상을 위한 로딩 애니메이션 적용                                           |
| ✅ 네이티브 연동      | Native Toast 모듈을 직접 구현 후 JS에서 호출 가능하게 연동 완료                                       |

#### 📦 주요 라이브러리

- UI/UX: `react-native`, `react-navigation/native-stack`, `lottie-react-native`
- 상태 관리: `zustand`
- 이미지 처리: `react-native-image-picker`, `@bam.tech/react-native-image-resizer`, `@d11/react-native-fast-image`
- 저장소: `react-native-encrypted-storage`
- 유틸: `dayjs`, `axios`, `react-native-permissions`, `react-native-dotenv`

---

### 🌐 Server (Express.js + MySQL)

| 항목             | 설명                                                                                  |
| ---------------- | ------------------------------------------------------------------------------------- |
| ✅ 인증 처리     | JWT 기반 로그인, 회원가입, 인증 미들웨어 처리                                         |
| ✅ 보안          | `bcrypt`를 활용한 비밀번호 해싱 저장                                                  |
| ✅ 이미지 업로드 | 클라이언트에서 전달된 이미지 파일을 `multer-s3`로 AWS S3에 업로드 처리                |
| ✅ 게시글 등록   | 게시글 + 복수 이미지 업로드를 하나의 트랜잭션으로 묶어 처리. 일부 실패 시 전체 롤백됨 |
| ✅ 게시글 삭제   | Soft Delete 처리(`del = 'Y'`)로 데이터 보존 유지                                      |
| ✅ 미들웨어 구성 | `cors`, `express-session`, `cookie-parser`, `morgan`을 활용한 요청 관리 및 로그 출력  |

#### 📦 주요 라이브러리

- 핵심: `express`, `mysql2`, `dotenv`, `cors`
- 인증: `jsonwebtoken`, `bcrypt`
- 파일 업로드: `@aws-sdk/client-s3`, `multer`, `multer-s3`
- 기타: `cookie-parser`, `morgan`

---

## 🚀 실행 방법

### 📌 사전 준비

본 프로젝트는 클라이언트(`KLP_App/`)와 서버(`KLP_Server/`)로 구성되어 있으며, **정상 실행을 위해 아래와 같은 환경 변수 파일들이 반드시 필요합니다.**

---

## ✅ 서버 (`KLP_Server/`)

- `.env`
  - 서버 실행에 필요한 환경 변수들을 정의합니다.
  - 파일은 `KLP_Server/` 루트 디렉토리에 위치해야 합니다.

```env
# 예시
PORT=3000
DB_HOST=your_host
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=your_database
JWT_SECRET=your_jwt_secret
```

---

## ✅ 클라이언트 (`KLP_App/`)

- `.env`
  - 클라이언트 실행에 필요한 환경 변수 파일입니다.
  - `KLP_App/` 루트에 위치해야 합니다.

```env
API_URL=https://your-api-url.com
S3=https://your-s3-bucket-url.com/
```

- `env.d.ts`
  - `.env`의 변수들을 타입스크립트에서 인식하기 위한 선언 파일입니다.
  - `KLP_App/src/types/env.d.ts` 경로에 직접 생성해야 합니다.

```ts
declare module "@env" {
  export const API_URL: string;
  export const S3: string;
}
```

---

## ✅ 실행 명령어

```bash
# ✅ 서버 실행
cd KLP_Server
npm install
npm start

# ✅ 앱 실행 (Android)
cd KLP_App
npm install
npx react-native run-android

# ✅ 앱 실행 (iOS)
cd ios
pod install
cd ..
npx react-native run-ios
```
