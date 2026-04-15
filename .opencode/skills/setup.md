---
name: setup
description: "프로젝트 초기 셋업. AGENTS.md에 {{PROJECT_NAME}} 플레이스홀더가 남아있으면 자동 로드. 대화형으로 정보 수집 → 파일 치환 → Roam 페이지 생성 → 의존성 설치."
---

# Project Initial Setup

이 skill은 템플릿에서 생성된 프로젝트의 첫 셋업을 안내한다.
AGENTS.md에 `{{PROJECT_NAME}}` 플레이스홀더가 남아있을 때 자동으로 로드된다.

---

## Phase 1: 정보 수집

사용자에게 다음 정보를 **한 번에** 수집한다. 한 질문씩 나누지 않는다.

### 필수 항목

| 항목 | 예시 | 기본값 |
|------|------|--------|
| 프로젝트 이름 | Health Monster | (필수, 기본값 없음) |
| 프로젝트 설명 (한 줄) | 건강 관리 SaaS | = 프로젝트 이름 |
| 프로젝트 목적 (한 줄) | 사용자 건강 데이터 분석 및 인사이트 제공 | TBD |
| 현재 Phase | Phase 0: 초기 셋업 | Phase 0: 초기 셋업 |
| 인프라 | Netlify + Railway + Supabase | Netlify + Railway + Supabase |

### Roam API 토큰

`opencode.json`의 `ROAM_API_TOKEN`이 `<REPLACE_WITH_YOUR_TOKEN>`이면 사용자에게 토큰을 요청한다.
이미 유효한 값이면 스킵.

**Roam 그래프는 `John_Development_Graph` 고정. 변경 불필요.**

### 동적 추가 항목

기본값을 보여준 뒤 추가 여부를 묻는다:

**프로젝트 페이지 참조 (기본):**
- `[ProjectName]/WorkBlocks`
- `[ProjectName]/Memory`
- `[ProjectName]/PRD`
- `[ProjectName]/Six Pager`

→ "추가할 페이지 참조가 있나요? (없으면 엔터)"

**메모리 태그 (기본):**
- `[ProjectName]/Memory/Context` — 현재 세션 상태
- `[ProjectName]/Memory/Core` — 핵심 상식

→ "추가할 메모리 태그가 있나요? (예: Design, API, Product 등. 없으면 엔터)"

---

## Phase 2: 파일 플레이스홀더 치환

수집한 정보로 아래 파일들을 수정한다. **sed 또는 Edit 도구 사용.**

**Project Slug:** 프로젝트명에서 자동 생성. 소문자 + 하이픈. (예: "Health Monster" → "health-monster")

### 치환 맵

| 파일 | 플레이스홀더 | 치환값 |
|------|-------------|--------|
| `AGENTS.md` | `{{PROJECT_NAME}}` | 프로젝트명 |
| `AGENTS.md` | `{{PROJECT_DESCRIPTION}}` | 프로젝트 설명 |
| `AGENTS.md` | `{{CURRENT_PHASE}}` | 현재 Phase |
| `AGENTS.md` | `{{PROJECT_PURPOSE}}` | 프로젝트 목적 |
| `AGENTS.md` | `{{INFRASTRUCTURE}}` | 인프라 |
| `README.md` | `{{PROJECT_NAME}}` | 프로젝트명 |
| `README.md` | `{{PROJECT_DESCRIPTION}}` | 프로젝트 설명 |
| `.opencode/agents/po.md` | `{{PROJECT_NAME}}` | 프로젝트명 |
| `.opencode/agents/web-designer.md` | `{{PROJECT_NAME}}` | 프로젝트명 |
| `opencode.json` | `<REPLACE_WITH_YOUR_TOKEN>` | Roam API 토큰 |
| `opencode.json` | `<REPLACE_WITH_PROJECT_NAME>` | 프로젝트명 |
| `src/lib/config.ts` | `projectSlug: "mvp-landing"` | `projectSlug: "[slug]"` |

**치환 후 검증:** `grep -r '{{PROJECT_NAME}}\|{{DESCRIPTION}}\|<REPLACE_WITH' --include='*.md' --include='*.json' --include='*.ts' .` 실행.
`setup.md` 자체와 `setup.sh`(이미 없음)를 제외하고 결과가 없어야 한다.

---

## Phase 3: .env 생성

`.env` 파일이 없으면 생성한다:

```
PROJECT_NAME=[프로젝트명]
ROAM_API_TOKEN=[토큰]
ROAM_GRAPH_NAME=John_Development_Graph
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_PROJECT_SLUG=[slug]
```

이미 존재하면 스킵.

---

## Phase 4: Roam 페이지 생성

Roam MCP가 연결되지 않았으면 (토큰 미설정 등) 이 Phase를 스킵하고, 사용자에게 수동 생성 안내.

### 4-1. `[ProjectName]` 최상위 페이지

`roam_create_page` 사용:

```
title: "[ProjectName]"
content:
  - level 1, heading 2: "Pages"
  - level 2: "[[{ProjectName}/WorkBlocks]]"
  - level 2: "[[{ProjectName}/Memory]]"
  - level 2: "[[{ProjectName}/PRD]]"
  - level 2: "[[{ProjectName}/Six Pager]]"
  - (사용자 추가 참조들도 level 2로)
```

### 4-2. `[ProjectName]/WorkBlocks` 페이지

`roam_create_page` 사용:

```
title: "[ProjectName]/WorkBlocks"
content:
  - level 1: "> **원칙:** Block이 완료되지 않으면 다음 Block으로 진행하지 않는다. 참조: AGENTS.md"
```

### 4-3. `[ProjectName]/Memory` 페이지

`roam_create_page` 사용:

```
title: "[ProjectName]/Memory"
content:
  - level 1, heading 3: "메모리 태그"
  - level 2: "[[{ProjectName}/Memory/Context]] — 현재 세션 상태 (항상 최신 1개만 유지)"
  - level 2: "[[{ProjectName}/Memory/Core]] — 핵심 상식 (세션마다 필수 로드)"
  - (사용자 추가 태그들도 level 2로, 같은 형식)
```

---

## Phase 5: 의존성 설치

순서대로 실행:

```bash
cd .opencode && npm install
npm install          # frontend (프로젝트 root)
cd server && npm install  # backend
```

실패해도 중단하지 않는다. 실패한 항목만 사용자에게 보고.

---

## Phase 6: 완료 보고

체크리스트:
- [ ] 모든 플레이스홀더 치환 완료 (grep 결과 없음)
- [ ] opencode.json에 유효한 Roam 토큰 설정
- [ ] .env 파일 생성
- [ ] Roam 페이지 3개 생성: [ProjectName], [ProjectName]/WorkBlocks, [ProjectName]/Memory (또는 수동 생성 안내)
- [ ] npm install 완료

사용자에게 보고:

```
셋업 완료.

- 프로젝트: [ProjectName] (slug: [slug])
- Roam: [ProjectName] / [ProjectName]/WorkBlocks / [ProjectName]/Memory 페이지 생성
- 메모리 태그: Context, Core[, 추가 태그들]

다음 단계:
1. .env에 Supabase/API 환경변수 채우기
2. supabase/migrations/001_init.sql 실행
3. npm run dev (frontend) + cd server && npm run dev (backend)
```
