<!-- BEGIN:nextjs-agent-rules -->

# Next.js: ALWAYS read version-matched docs before coding

Before any Next.js work, find and read the relevant guide in `node_modules/next/dist/docs/`.
Do not rely on training data for App Router, Server Components, caching, route handlers, Server Actions, metadata, or Turbopack behavior.

<!-- END:nextjs-agent-rules -->

# 프로젝트 개요

AI 면접/발표 코치 앱 프론트엔드.

# 기술 스택

- Next.js 16.2.4
- App Router
- React 19.2.4
- TypeScript 5
- Tailwind CSS 4
- npm

# 런타임 요구사항

- Node.js 20.9.0 이상을 사용한다.
- `npm install` 후 작업한다.
- `node_modules/next/dist/docs/`의 문서를 Next.js 구현 기준으로 삼는다.

# Next.js 16 구현 규칙

- 기본은 Server Component로 작성한다.
- `useState`, `useEffect`, 브라우저 API, 이벤트 핸들러가 필요한 경우에만 Client Component로 만든다.
- App Router에서 `params`, `searchParams`, `cookies()`, `headers()`, `draftMode()`는 비동기 API로 다룬다.
- 동적 라우트 페이지에서는 필요한 경우 `PageProps<'/route'>`, `LayoutProps<'/route'>`, `RouteContext<'/route'>` 타입을 사용한다.
- 타입 검사 전에는 `next typegen`을 실행한다.
- Turbopack은 Next.js 16의 기본값이므로 `--turbopack` 플래그를 추가하지 않는다.
- Webpack으로 전환하거나 `next.config.ts`에 bundler 설정을 추가하기 전에는 이유를 설명한다.
- React Compiler는 명시 요청 없이 활성화하지 않는다.

# Tailwind CSS 4 규칙

- `app/globals.css`에서 Tailwind를 import한다.
- Tailwind v4는 CSS-first 설정을 우선한다.
- 별도 `tailwind.config.ts`는 커스텀 토큰/플러그인이 필요할 때만 추가한다.

# 백엔드 연동 규칙

- 메인 백엔드는 Spring Boot API이다.
- FastAPI AI 서버는 프론트엔드에서 직접 호출하지 않는다.
- AI 관련 요청도 프론트엔드는 Spring Boot API를 통해서만 호출한다.
- API 호출 코드는 가능하면 `lib/api/` 아래에 모은다.
- 컴포넌트 내부에 API 호출 로직을 흩뿌리지 않는다.
- 브라우저에 노출되는 값은 `NEXT_PUBLIC_` 접두사가 붙은 환경 변수만 사용한다.
- 토큰, API key, 내부 서버 주소 등 secret은 클라이언트 컴포넌트에서 직접 참조하지 않는다.

# 상태 관리 규칙

- 전역 클라이언트 상태가 필요할 때만 Zustand를 사용한다.
- 서버에서 재조회 가능한 데이터는 가능한 한 Server Component, fetch, API 경계에서 처리하고 Zustand에 중복 저장하지 않는다.
- 인증 토큰, API key, secret은 Zustand store에 저장하지 않는다.
- 도메인별 store는 해당 도메인 근처에 두고, 여러 도메인에서 공유될 때만 공용 위치로 올린다.

# MCP 사용 규칙

- MCP 서버는 필수가 아니며, 개발 서버가 실행 중일 때 진단/라우팅/로그 확인 용도로 사용한다.
- Next.js 런타임 오류, 라우트 구조, 서버 로그 확인이 필요한 경우 `next-devtools-mcp`를 우선 활용한다.
- MCP가 연결되지 않았다는 이유만으로 작업을 중단하지 않는다. 필요한 경우 `npm run dev` 실행 여부와 MCP 설정 로드를 확인한다.

# Git/Jira 컨벤션

## 브랜치명

- 브랜치명은 `<branch-type>/KAN-<issue-number>-<short-description>` 형식을 사용한다.
- 사용 가능한 branch-type:
  - `feature`: 기능 개발
  - `fix`: 버그 수정
  - `chore`: 설정/기타
  - `hotfix`: 긴급 수정
- 예:
  - `feature/KAN-1-home-screen-ui`
  - `fix/KAN-23-toast-not-showing`
  - `chore/KAN-51-ai-agent-setting`
  - `hotfix/KAN-99-critical-auth-bug`

## 커밋 메시지

- 커밋 메시지는 `KAN-<issue-number> <type>(<scope>): <summary>` 형식을 따른다.
- 예:
  - `KAN-1 feat(home): 홈 화면 UI 구현`
  - `KAN-23 fix(live): 토스트 미표시 버그 수정`
  - `KAN-51 chore(common): AI agent 작업 규칙 설정`
- 사용 가능한 commit type:
  - `feat`: 새로운 기능 추가
  - `fix`: 버그 수정
  - `docs`: 문서 수정
  - `style`: 코드 포맷 수정
  - `refactor`: 리팩토링
  - `test`: 테스트 추가 및 수정
  - `chore`: 기타 변경
- scope는 도메인 또는 기능 단위를 사용한다.
  - 예: `home`, `live`, `feedback`, `report`, `auth`, `layout`, `common`
- Jira 이슈 번호는 현재 브랜치명에서 `KAN-\d+` 패턴으로 추출한다.
- 브랜치명에서 Jira 이슈 번호를 찾을 수 없으면 커밋/PR 생성 전에 사용자에게 확인한다.

# Git 작업 절차

- agent가 Git 작업을 위탁받은 경우 아래 순서로 진행한다.
  1. `git status --short`로 변경 파일을 확인한다.
  2. 현재 브랜치명에서 Jira 이슈 번호를 추출한다.
  3. 관련 있는 파일만 명시적으로 stage 한다.
  4. `git add .`, `git add -A`, `git add --all`은 사용하지 않는다.
  5. 커밋 메시지는 `KAN-<issue-number> <type>(<scope>): <summary>` 형식을 따른다.
  6. 커밋 전 변경 파일 목록과 커밋 메시지를 사용자에게 요약한다.
  7. 사용자가 명시적으로 요청한 경우에만 commit/push를 수행한다.
  8. push는 기본적으로 `git push origin HEAD`를 사용한다.

# PR 생성/병합 규칙

- PR 생성은 사용자가 명시적으로 요청한 경우에만 수행한다.
- agent가 임의로 `gh pr create`, GitHub Web UI PR 생성, PR 자동화를 수행하지 않는다.
- PR 생성을 요청받은 경우에도 PR 제목과 본문을 먼저 제안하고 사용자 확인 후 생성한다.
- PR 제목은 `KAN-<issue-number> <type>(<scope>): <summary>` 형식을 따른다.
- PR merge는 항상 사람이 수동으로 수행한다.
- agent는 `gh pr merge`, GitHub Web UI merge, 자동 merge 설정을 수행하지 않는다.
- `git commit --no-verify` 또는 `git commit -n`으로 commit-msg hook을 우회하지 않는다.

# 폴더 구조

- `app/`: App Router 페이지, 레이아웃, 라우트 단위 파일
- `components/도메인명/`: 화면/도메인별 컴포넌트
- `components/ui/`: 재사용 가능한 공용 UI 컴포넌트
- `lib/`: 유틸, API 클라이언트, 데이터 처리
- `types/`: 여러 도메인에서 공유하는 타입

# 자주 쓰는 명령어

- `npm run dev`: 개발 서버 실행
- `npm run build`: 프로덕션 빌드
- `npm run lint`: ESLint 검사
- `npm run typecheck`: Next 타입 생성 후 TypeScript 검사
- `npm run format:check`: Prettier 포맷 검사
- `npm run test`: 테스트 실행

# 완료 기준

AI agent가 코드를 수정한 뒤에는 가능한 범위에서 아래를 수행한다.

1. 변경한 파일과 이유를 요약한다.
2. `npm run typecheck`를 실행한다.
3. `npm run lint`를 실행한다.
4. 포맷 영향이 있으면 `npm run format:check`를 실행한다.
5. 테스트 설정이 있으면 `npm run test`를 실행한다.
6. UI, 라우팅, 빌드 설정, Next 설정에 영향이 있으면 `npm run build`를 실행한다.
7. 실행하지 못한 검증 명령이 있으면 이유를 명시한다.

# 금지 사항

- FastAPI AI 서버를 프론트엔드에서 직접 호출하지 않는다.
- `.env.local`, API key, 토큰, 비밀번호를 커밋하지 않는다.
- 사용자가 요청하지 않은 대규모 리팩터링을 하지 않는다.
- 기존 폴더 구조를 임의로 바꾸지 않는다.
- `npm audit fix --force`, 대규모 dependency upgrade, `git push`, 배포 명령은 명시 요청 없이 실행하지 않는다.
- `any`로 타입을 우회하지 않는다. 불가피하면 이유를 주석으로 남긴다.

# 응답 스타일

- 설명은 한국어로 작성한다.
- 변경사항은 “무엇을 바꿨는지 / 왜 바꿨는지 / 어떻게 검증했는지” 순서로 요약한다.