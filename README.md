# Meomun

머문(Meomun)은 장소에 머물렀던 순간과 감정을 기록하고, 위치와 감정의 흐름을 다시 돌아볼 수 있는 감성 기반 위치 기록 앱입니다.

현재 저장소는 기능 개발 전 초기 구조를 정의한 단계입니다. Backend와 Frontend 모두 Feature 기반 구조를 사용하며, 화면 구현과 비즈니스 로직은 포함하지 않습니다.

## Tech Stack

### Frontend

- React Native
- Expo
- TypeScript
- Zustand 예정

### Backend

- Node.js
- Express
- TypeScript
- PostgreSQL 예정
- Prisma 예정
- AWS S3 예정

## Project Structure

```text
meomun/
├── backend/
│   ├── prisma/
│   └── src/
│       ├── app.ts
│       ├── server.ts
│       ├── db.ts
│       ├── config/
│       ├── common/
│       │   ├── middleware/
│       │   ├── utils/
│       │   ├── types/
│       │   └── errors/
│       └── features/
│           ├── auth/
│           ├── users/
│           ├── records/
│           ├── places/
│           ├── archives/
│           ├── stats/
│           └── uploads/
├── frontend/
│   ├── App.tsx
│   └── src/
│       ├── app/
│       │   ├── navigation/
│       │   └── providers/
│       ├── shared/
│       │   ├── components/
│       │   ├── hooks/
│       │   ├── api/
│       │   ├── utils/
│       │   ├── constants/
│       │   └── types/
│       ├── features/
│       │   ├── auth/
│       │   ├── record/
│       │   ├── place/
│       │   ├── archive/
│       │   ├── stats/
│       │   └── profile/
│       └── assets/
│           ├── images/
│           ├── icons/
│           └── fonts/
└── docs/
    ├── ui/
    └── api/
```

Backend의 각 Feature는 `routes`, `controller`, `service`, `repository`, `types` 파일을 가집니다. Frontend의 각 Feature는 `screens`, `components`, `hooks`, `api`, `store`, `types` 폴더를 가집니다.

## Run Backend

```bash
cd backend
cp .env.example .env
npm install
npm run prisma:migrate
npm run dev
```

`.env`에는 Supabase에서 제공하는 `DATABASE_URL`, `DIRECT_URL`을 입력합니다. Prisma Schema를 변경한 뒤 배포 환경에 migration을 적용할 때도 `npm run prisma:migrate`를 실행합니다.

서버가 실행되면 다음 주소에서 상태를 확인할 수 있습니다.

```text
GET http://localhost:3000/health
```

## Run Frontend

```bash
cd frontend
npm install
npm start
```

Expo 개발 서버가 실행되면 iOS Simulator, Android Emulator 또는 Expo Go에서 앱 셸을 확인할 수 있습니다.

## Docs

- `docs/ui`: 화면 설계 이미지, 와이어프레임, 디자인 참고 자료
- `docs/api`: API 명세서, ERD, 기획 문서
