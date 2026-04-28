<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

---

# 프로젝트 개요

AI 면접/발표 코치 앱 프론트엔드

# 기술 스택

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS

# 백엔드 연동

- Spring Boot API : 메인 백엔드
- FastAPI AI 서버 : 프론트에서 직접 호출 안 함

# 폴더 구조

- components/도메인명/ : 화면별 컴포넌트
- components/ui/ : 공용 컴포넌트
- lib/ : 유틸, 데이터
- types/ : 공통 타입

# 자주 쓰는 명령어

- npm run dev : 개발 서버 실행
- npm run build : 빌드
