# 머문 Meomun

머문(Meomun)은 장소에 머물렀던 순간과 감정을 기록하고, 지도와 통계로 나의 감정 흐름을 돌아볼 수 있는 위치 기반 감정 기록 앱입니다.

단순히 글을 남기는 일기 앱이 아니라,  
“어디에서 어떤 감정을 느꼈는지”를 장소, 사진, 감정과 함께 기록하고 다시 꺼내볼 수 있도록 돕습니다.

## 주요 기능

### 감정 지도

기록한 장소들이 지도 위에 감정 마커로 표시됩니다.

- 장소별 감정 기록 확인
- 감정별 지도 필터링
- 최근 기록 또는 선택한 장소 기록 미리보기
- 같은 장소에 남긴 여러 기록 탐색

### 감정 기록 작성

장소와 감정을 중심으로 하루의 순간을 기록할 수 있습니다.

- 기록 제목 작성
- 장소 검색 및 선택
- 감정 선택
- 사진 첨부
- 감정 내용 작성
- 기록 상세 보기, 수정, 삭제

### 보관함

쌓인 기록을 다양한 기준으로 다시 돌아볼 수 있습니다.

- 전체 기록 보관함
- 월별 기록 보관함
- 감정별 기록 보관함
- 장소별 기록 보관함
- 감정/장소 상세 기록 목록

### 통계

기록된 감정을 기반으로 나의 감정 흐름을 시각적으로 확인할 수 있습니다.

- 이번 달 대표 감정
- 감정 분포 차트
- 감정 캘린더
- 시간대별 감정 기록 분포

### 로그인 및 계정 관리

소셜 로그인을 통해 안전하게 앱을 사용할 수 있습니다.

- 카카오 로그인
- Apple 로그인
- 자동 로그인
- 로그아웃
- 회원탈퇴
- 개인정보처리방침 및 이용약관 확인

## 기술 스택

### Frontend

- React Native
- Expo
- TypeScript
- React Navigation
- TanStack Query
- Zustand
- Naver Map
- Kakao Login
- Apple Authentication

### Backend

- Node.js
- Express
- TypeScript
- Prisma
- PostgreSQL
- Supabase
- AWS S3
- Kakao Local API
- JWT 기반 인증

## 프로젝트 구조

```text
meomun/
├── frontend/
│   ├── App.tsx
│   └── src/
│       ├── app/
│       │   ├── navigation/
│       │   └── providers/
│       ├── shared/
│       │   ├── api/
│       │   ├── components/
│       │   ├── config/
│       │   ├── constants/
│       │   ├── storage/
│       │   └── types/
│       ├── features/
│       │   ├── auth/
│       │   ├── home/
│       │   ├── record/
│       │   ├── place/
│       │   ├── archive/
│       │   ├── stats/
│       │   └── profile/
│       └── assets/
│           ├── emotions/
│           ├── icons/
│           ├── images/
│           └── markers/
│
├── backend/
│   ├── prisma/
│   └── src/
│       ├── app.ts
│       ├── server.ts
│       ├── db.ts
│       ├── common/
│       └── features/
│           ├── auth/
│           ├── users/
│           ├── records/
│           ├── places/
│           ├── archives/
│           ├── stats/
│           └── uploads/
│
└── docs/
    ├── api/
    ├── legal/
    └── ui/
```

## 실행 방법

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run prisma:migrate
npm run dev
```

서버 상태 확인:

```text
GET http://localhost:3000/health
```

### Frontend

```bash
cd frontend
npm install
npm start
```

Expo 개발 서버가 실행되면 iOS Simulator, Android Emulator 또는 Expo Go에서 앱을 확인할 수 있습니다.

## 환경 변수

Backend `.env`에는 다음 값들이 필요합니다.

```env
DATABASE_URL=
DIRECT_URL=

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=

KAKAO_REST_API_KEY=

AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=
```

Frontend 환경 변수에는 API 서버 주소와 네이티브 SDK 설정값이 필요합니다.

```env
EXPO_PUBLIC_API_BASE_URL=
```

## 주요 화면

- 온보딩
- 로그인
- 홈 지도
- 기록 작성
- 기록 상세
- 장소 검색
- 보관함
- 감정별 보관함
- 장소별 보관함
- 통계
- 마이페이지

## API 문서

API 명세와 화면 설계 자료는 `docs` 폴더에서 확인할 수 있습니다.

```text
docs/api
docs/ui
docs/legal
```

## 법적 문서

앱 내에서 다음 문서를 확인할 수 있습니다.

- 서비스 이용약관
- 개인정보처리방침
- 도움말
- 문의하기

## 앱 소개 문구

> 오늘의 감정을 지도 위에 남겨요.  
> 머문은 장소와 감정을 함께 기록하고, 나의 감정 흐름을 다시 돌아볼 수 있는 감성 기반 위치 기록 앱입니다.

## 버전

```text
0.1.0
```
