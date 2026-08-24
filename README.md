# AXIA AI Tutor — Frontend

문서를 올리면 AI가 질문을 만들고, 브라우저에서 음성으로 답하면 답변 내용과 시선·자세 지표를 같이 분석해 턴별 피드백과 종합 리포트를 주는 면접·발표 코칭 서비스입니다. 이 저장소는 그중 웹 프론트엔드입니다.

화면을 그리는 것보다 마이크, 카메라, 음성 합성, 응답 시간이 들쭉날쭉한 AI API를 하나의 세션 흐름으로 묶는 데 시간을 더 썼습니다.

```
Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind CSS v4 · Zustand · Vercel
```

---

## 사용자 흐름

```
[1] 준비    Google OAuth 로그인, 세션 생성
[2] 자료    Signed URL 발급 → GCS PUT → 완료 통지 → AI 문서 요약
[3] 연습    질문 TTS 재생 → 음성 녹음 + 얼굴 랜드마크 샘플링 → 턴 제출
[4] 분석    턴별 피드백 확인 → 세션 종합 리포트
```

프론트엔드는 Spring Boot 제품 API만 호출합니다. FastAPI AI 서버를 직접 부르지 않기로 한 이유, TTS 파일 URL을 프록시로 바꿔야 하는 이유는 [`docs/live-ai-stt-mediapipe-integration-notes.md`](docs/live-ai-stt-mediapipe-integration-notes.md)에 FE / Spring / FastAPI 역할 경계표와 같이 정리해뒀습니다.

---

## 구현 노트

### 1. 카메라 지표는 브라우저에서 계산하고 서버에는 평균만 보낸다

매 프레임을 서버로 올리면 전송 비용도 늘고 얼굴 영상을 계속 넘기게 됩니다. MVP에 그만한 값을 하지 않는다고 봤습니다.

MediaPipe FaceLandmarker를 클라이언트에서 동적으로 불러와 GPU·VIDEO 모드로 돌리되, 100ms 간격(10fps)으로만 추론합니다. 원본 프레임은 업로드하지 않고, 답변이 끝나면 시선·자세 점수의 평균값만 음성 파일과 같이 제출합니다.

대신 정확도를 포기했습니다. 여기서 나오는 값은 정밀 eye tracking이 아니라 코·눈 랜드마크의 좌우 이탈과 눈높이 차이로 만든 휴리스틱입니다. 그래서 UI에서도 절대 점수로 쓰지 않고 추이만 보여줍니다.

`lib/hooks/useVisionMetrics.ts`

### 2. 마이크·카메라 정리를 hook으로 몰았다

권한 거부, 화면 이탈, 브라우저별 지원 차이까지 화면 컴포넌트가 알고 있으면 정작 연습 단계 제어 코드가 묻힙니다. 이 부분만 custom hook으로 떼어냈습니다.

- MediaRecorder는 `audio/webm;codecs=opus`부터 `audio/wav`까지 후보 5개를 순서대로 확인해 지원되는 것을 씁니다. 정해진 MIME에 맞춰 파일 확장자도 같이 결정합니다.
- 녹음이 끝나거나 언마운트되면 media track을 전부 stop하고 ref를 비웁니다. 안 그러면 탭의 녹음 인디케이터가 계속 켜져 있습니다.
- 파형은 IntersectionObserver로 화면에 보일 때만 AudioContext를 열고, 45ms 간격으로 샘플을 읽어 Canvas에 그립니다.

`lib/hooks/useAudioRecorder.ts` · `components/live/LiveAudioWaveform.tsx`

### 3. 단계 진입 조건

한 화면에 비동기 작업이 줄줄이 엮여 있습니다. 문서 업로드가 끝나도 AI 요약 전에 세션을 시작하면 안 되고, 질문 TTS가 나오는 중에 녹음이 시작되면 질문 음성이 답변에 섞입니다.

그래서 UI 이벤트에서 API를 바로 부르지 않고, 앞 작업의 완료를 다음 단계의 진입 조건으로 걸었습니다.

- 업로드는 Signed URL 발급, 스토리지 PUT, 완료 통지, AI 요약까지 한 흐름으로 묶고 요약이 실패하면 시작 버튼을 열지 않습니다.
- 녹음은 TTS 종료 callback 뒤에만 시작합니다. 다만 오류 callback에서도 다음 단계로 넘어가게 해뒀습니다. 음성 합성이 실패했다고 연습 전체가 막히면 곤란해서입니다.

### 4. 턴 중복 제출

답변 종료 버튼과 제한 시간 자동 제출이 겹치면 같은 턴이 두 번 올라갑니다. `useState`는 다음 렌더에야 반영되니 버튼 disabled만으로는 못 막습니다. 즉시 반영되는 ref guard를 제출 상태와 같이 써서, 클릭과 타이머가 동시에 들어와도 한 번만 나가게 했습니다.

### 5. 401 처리에 예외 하나

401이 오면 공통 인터셉터에서 로그인 페이지로 보냅니다. 단 `/api/users/me`는 제외합니다. 이걸 빼먹으면 `AuthProvider → initialize → fetchCurrentUser → 401 → 리다이렉트`가 무한히 돕니다. 한 번 당하고 넣은 예외라 코드에도 이유를 주석으로 남겼습니다.

라우트 가드는 `proxy.ts`(Next.js 16에서 middleware 이름이 바뀌었습니다)에서 세션 쿠키 유무로 처리합니다. 로그인 후 돌아갈 경로는 그대로 쓰지 않고 한 번 검증합니다. `//example.com`, 절대 URL, 역슬래시가 섞인 값은 전부 홈으로 보냅니다.

`lib/api/client.ts` · `lib/auth/routes.ts` · `lib/auth/routes.test.ts`

### 6. AI 응답 파싱

피드백이 Python dict 문자열로 올 때도 있고, `1. **레이블**: 내용`처럼 번호와 markdown 강조가 섞인 평문으로 올 때도 있습니다. 화면마다 이걸 알게 두면 형식이 하나 늘 때마다 화면을 고쳐야 합니다. 파서 한 곳에서 `FeedbackItem` 배열로 정리하고 화면은 그것만 봅니다.

`lib/parseFeedback.ts`

---

## 상태 관리

거대한 store 하나를 두지 않고 데이터 성격에 따라 넷으로 쪼갰습니다. 렌더링 영향 범위를 좁히려는 목적입니다.

| store             | 담는 것                                |
| ----------------- | -------------------------------------- |
| `auth`            | 로그인 사용자, 초기화 여부             |
| `practiceSession` | 세션 식별자, 세션 시작 응답, 턴별 질문 |
| `turnFeedback`    | 턴 단위 피드백                         |
| `avatar`          | 아바타 선택, TTS 보이스 성별           |

---

## 디렉토리

```
app/                 App Router 페이지 (login, home, live, feedback, report)
components/
  live/              연습 화면. 녹음, 파형, 카메라 가이드, 실시간 지표
  report/            리포트. SVG 라인 차트, 점수 링, 강약점
  ui/                공통 UI 프리미티브
lib/
  api/               axios client + 도메인별 API 모듈
  hooks/             useAudioRecorder / useVisionMetrics / useMouthCue
  stores/            Zustand 도메인 store
  tts/               Web Speech API 보이스 선택, mouth cue
  auth/              라우트 가드 규칙 (+ 단위 테스트)
types/               API DTO 타입
proxy.ts             Next.js 16 라우트 가드
```

---

## 실행

```bash
npm install
npm run dev
```

`NEXT_PUBLIC_API_BASE_URL`이 필요합니다. 값이 없으면 client를 만드는 시점에 바로 throw합니다. 런타임에 조용히 엉뚱한 주소로 붙는 것보다 낫다고 봤습니다.

## 검증

```bash
npm run verify   # typecheck + lint + format:check + test
```

- TypeScript `strict`, 소스 전체에 `any`가 없습니다. 명시적 `any`와 `as any` 모두 0건입니다.
- PR은 [템플릿](.github/PULL_REQUEST_TEMPLATE.md)의 검증 체크리스트(typecheck / lint / format / test / build)를 통과 여부와 같이 기록합니다. 안 돌린 항목은 사유를 적습니다.
- 브랜치, 커밋, PR 제목은 Jira 티켓(`KAN-###`)과 Conventional Commits를 따릅니다. 전문은 [`AGENTS.md`](AGENTS.md)에 있습니다.

## 배포

Vercel. `main`과 `develop`만 배포하고 나머지 브랜치는 `vercel.json`에서 막습니다.

---

## 작업 이력

기능 단위로 PR을 나누고 티켓을 붙여서, 어떤 결정이 언제 들어갔는지 목록에서 따라갈 수 있습니다.

- [전체 PR 목록](https://github.com/AXIA-AI-Tutor/frontend/pulls?q=is%3Apr)
- 인증 흐름: [#9](https://github.com/AXIA-AI-Tutor/frontend/pull/9) · [#10](https://github.com/AXIA-AI-Tutor/frontend/pull/10) · [#13](https://github.com/AXIA-AI-Tutor/frontend/pull/13) · [#36](https://github.com/AXIA-AI-Tutor/frontend/pull/36)
- 세션 전체 흐름 API 연결 + MediaPipe 지표 연동: [#28](https://github.com/AXIA-AI-Tutor/frontend/pull/28)
- 세션 생명주기와 진입 가드: [#34](https://github.com/AXIA-AI-Tutor/frontend/pull/34) · [#35](https://github.com/AXIA-AI-Tutor/frontend/pull/35)
- E2E 테스트 피드백 1~5차 반영: [#37](https://github.com/AXIA-AI-Tutor/frontend/pull/37) · [#38](https://github.com/AXIA-AI-Tutor/frontend/pull/38) · [#39](https://github.com/AXIA-AI-Tutor/frontend/pull/39) · [#43](https://github.com/AXIA-AI-Tutor/frontend/pull/43) · [#48](https://github.com/AXIA-AI-Tutor/frontend/pull/48)

---

## 남은 것

MVP라 손대지 못한 것들입니다.

- TTS 재생, 녹음, 제출, 완료가 아직 boolean 여러 개의 조합입니다. 명시적 state machine으로 옮겨야 조합이 늘어날 때 감당이 됩니다.
- 반응형에서 레이아웃이 갈릴 때 카메라·마이크가 두 번 마운트될 여지가 있습니다. 한 번만 잡고 소유권을 한 곳에 두는 정리가 필요합니다.
- 새로고침 후 진행 중이던 세션으로 돌아가는 경로, 측정 불가 상태, 실패 재시도를 아직 제품 상태로 만들지 못했습니다.
- 단위 테스트가 라우트 가드에만 있습니다. media hook과 연습 흐름도 같은 기준으로 덮을 계획입니다.
