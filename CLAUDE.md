@AGENTS.md

## Claude Code

- 다중 파일 수정, 구조 변경, Git 작업 전에는 짧은 계획을 먼저 제시한다.
- 커밋/푸시는 사용자가 명시적으로 요청한 경우에만 수행한다.
- 커밋 메시지, PR 제목, 브랜치명은 AGENTS.md의 Git/Jira 컨벤션을 따른다.
- PR 생성은 사용자가 명시적으로 요청한 경우에만 수행하며, PR merge는 수행하지 않는다.
- `gh pr create`를 실행하기 전에는 PR 제목과 본문을 먼저 제안하고 사용자 확인을 받는다.
- Next.js 작업 중 `next-devtools-mcp`가 연결되어 있고 개발 서버가 실행 중이면 MCP 진단 도구를 우선 활용한다.
- `/memory` 명령으로 이 파일과 import된 AGENTS.md가 로드되었는지 확인할 수 있다.