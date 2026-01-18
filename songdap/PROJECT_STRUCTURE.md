# 프로젝트 구조 가이드

React, Next.js (App Router), TypeScript, TanStack Query, Zustand를 사용한 권장 폴더 구조입니다.

## 📁 전체 구조

```
src/
├── app/                    # Next.js App Router
│   ├── (routes)/           # 라우트 그룹
│   ├── globals.css         # 전역 스타일
│   ├── layout.tsx          # 루트 레이아웃 (TanStack Query Provider 포함)
│   └── page.tsx            # 홈 페이지
│
├── shared/                 # 공통 모듈 (재사용 가능한 코드)
│   ├── api/                # Axios 인스턴스, 인터셉터
│   │   ├── axios.ts
│   │   └── interceptors.ts
│   ├── components/         # 공통 컴포넌트 (Header, Footer, Button 등)
│   │   ├── Header/
│   │   ├── Footer/
│   │   └── index.ts
│   ├── hooks/              # 공통 훅
│   │   ├── useMediaQuery.ts
│   │   └── index.ts
│   ├── lib/                # 유틸리티 함수
│   │   ├── utils.ts
│   │   ├── constants.ts
│   │   └── index.ts
│   ├── config/             # 설정 파일
│   │   ├── queryClient.ts  # TanStack Query 설정
│   │   └── pwa.ts          # PWA 설정
│   └── types/              # 공통 타입 정의
│       └── index.ts
│
├── entities/               # 비즈니스 엔티티 (도메인 모델)
│   ├── user/
│   │   ├── model/
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   └── api/
│   │       └── userApi.ts
│   └── album/
│       └── ...
│
├── features/               # 기능별 모듈 (비즈니스 로직 포함)
│   ├── auth/               # 인증 기능
│   │   ├── api/            # API 함수
│   │   │   ├── authApi.ts
│   │   │   └── index.ts
│   │   ├── components/     # 기능 전용 컴포넌트
│   │   │   ├── LoginForm/
│   │   │   └── index.ts
│   │   ├── hooks/          # 기능 전용 훅
│   │   │   ├── useAuth.ts
│   │   │   └── index.ts
│   │   ├── model/          # Zustand 스토어
│   │   │   ├── authStore.ts
│   │   │   └── types.ts
│   │   └── index.ts
│   │
│   ├── landing/            # 랜딩 페이지 기능
│   │   ├── components/
│   │   ├── hooks/
│   │   └── index.ts
│   │
│   └── album/              # 앨범 기능
│       ├── api/
│       │   └── albumApi.ts
│       ├── components/
│       ├── hooks/
│       │   └── useAlbumList.ts  # TanStack Query 훅
│       └── model/
│           └── albumStore.ts    # Zustand (로컬 UI 상태)
│
└── widgets/                # 복합 컴포넌트 (여러 feature 조합)
    └── AlbumSection/
        └── ...
```

## 🎯 각 레이어별 역할

### 1. `app/` - Next.js App Router
- 라우팅과 페이지 컴포넌트
- `layout.tsx`: TanStack Query Provider 설정
- PWA 설정 파일 위치

### 2. `shared/` - 공통 모듈
- **api/**: Axios 인스턴스, 인터셉터 설정
- **components/**: 전역에서 사용하는 컴포넌트 (Header, Footer 등)
- **hooks/**: 재사용 가능한 커스텀 훅
- **lib/**: 유틸리티 함수, 상수
- **config/**: TanStack Query 클라이언트 설정, PWA 설정
- **types/**: 공통 타입 정의

### 3. `entities/` - 비즈니스 엔티티
- 도메인 모델과 관련 타입
- 엔티티별 API 함수 (CRUD 기본)
- 예: User, Album, Song 등

### 4. `features/` - 기능 모듈
각 기능은 독립적인 모듈로 구성:

```
features/auth/
├── api/          # 서버 상태 관리 (TanStack Query 사용)
│   └── authApi.ts
├── components/   # 기능 전용 UI 컴포넌트
├── hooks/        # TanStack Query 훅 또는 커스텀 훅
│   └── useLogin.ts
├── model/        # 클라이언트 상태 관리 (Zustand)
│   └── authStore.ts
└── index.ts      # Public API (외부에 노출할 것만 export)
```

### 5. `widgets/` - 복합 컴포넌트
- 여러 feature를 조합한 큰 블록
- 페이지 레벨의 복잡한 UI 섹션

## 📦 주요 파일 예시

### `shared/api/axios.ts` - Axios 설정
```typescript
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
});

// 인터셉터 설정
```

### `shared/config/queryClient.ts` - TanStack Query 설정
```typescript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분
      refetchOnWindowFocus: false,
    },
  },
});
```

### `app/layout.tsx` - Provider 설정
```typescript
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/shared/config/queryClient';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
```

### `features/auth/hooks/useLogin.ts` - TanStack Query 훅
```typescript
import { useMutation } from '@tanstack/react-query';
import { loginApi } from '../api/authApi';

export function useLogin() {
  return useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      // 성공 처리
    },
  });
}
```

### `features/auth/model/authStore.ts` - Zustand 스토어
```typescript
import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
}));
```

## 🎨 상태 관리 분리 전략

### TanStack Query (서버 상태)
- API 호출 및 서버 데이터 관리
- 캐싱, 리페칭, 에러 처리
- `features/*/api/` 또는 `features/*/hooks/` 에 위치

### Zustand (클라이언트/UI 상태)
- 폼 상태, UI 상태 (모달 열림/닫힘)
- 전역 UI 상태
- `features/*/model/` 또는 `shared/stores/` 에 위치

## 📱 PWA 파일 위치

```
public/
├── manifest.json
└── icons/
    └── ...

app/
└── service-worker.ts (또는 별도 폴더)
```

## 🚀 구현 순서 권장

1. **shared 설정**
   - Axios 인스턴스 생성
   - TanStack Query 클라이언트 설정
   - 공통 타입 정의

2. **entities 정의**
   - 도메인 모델 타입
   - 기본 API 함수

3. **features 개발**
   - API → 훅 → 컴포넌트 순서로 개발

4. **widgets 조합**
   - 여러 feature를 조합하여 큰 블록 구성

## ✅ 네이밍 컨벤션

- **컴포넌트**: PascalCase (예: `Header.tsx`, `LoginForm.tsx`)
- **훅**: camelCase with "use" prefix (예: `useAuth.ts`, `useLogin.ts`)
- **유틸**: camelCase (예: `formatDate.ts`, `validateEmail.ts`)
- **타입**: PascalCase (예: `UserInfo`, `ApiResponse`)
- **상수**: UPPER_SNAKE_CASE (예: `API_BASE_URL`)

## 📚 참고 사항

- 각 feature는 `index.ts`를 통해 Public API만 export
- 순환 참조 방지: shared → entities → features → widgets 단방향 의존
- 타입 정의는 사용하는 곳과 가까운 곳에 두되, 공통 타입은 `shared/types`에
