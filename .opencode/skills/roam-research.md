---
name: roam-research
description: "Roam Research 오퍼레이션 가이드. Roam MCP 도구 사용법, 배치 액션 패턴, 마크다운 문법, 쿼리 작성, 메모리 관리 상세 패턴. Roam에 데이터를 읽고 쓸 때 반드시 로드."
---

# Roam Research Operations Guide

이 skill은 Roam Research MCP 도구의 **상세 사용법**을 다룬다.
프로젝트별 태그 체계와 세션 프로토콜은 AGENTS.md를 참조.

---

## Tool Selection (어떤 도구를 쓸지)

```
CREATING:
├─ 새 페이지 + 구조        → roam_create_page
├─ 기존 페이지/블록에 추가:
│   ├─ 단순 아웃라인       → roam_create_outline
│   └─ 복잡한 마크다운     → roam_import_markdown
├─ 페이지 전체 개정        → roam_update_page_markdown (BEST — fetch+diff+update 한 번에)
├─ 세밀한 CRUD             → roam_process_batch_actions (10+ 블록이면 이것)
├─ 테이블                  → roam_create_table
├─ 메모리 저장             → roam_remember
└─ 투두                    → roam_add_todo

SEARCHING:
├─ 태그로                  → roam_search_for_tag
├─ 텍스트로                → roam_search_by_text
├─ 날짜로                  → roam_search_by_date
├─ 상태로 (TODO/DONE)      → roam_search_by_status
├─ 블록 참조               → roam_search_block_refs
├─ 오늘 수정된 페이지      → roam_find_pages_modified_today
├─ 페이지 내용             → roam_fetch_page_by_title
├─ 블록 (자식/조상)        → roam_fetch_block
├─ 메모리 조회             → roam_recall
├─ 서브페이지 목록         → roam_get_subpages
└─ 복잡한 쿼리             → roam_datomic_query
```

### API 효율 순위 (best → worst)

1. `roam_update_page_markdown` — 한 번에 fetch + diff + update
2. `roam_process_batch_actions` — 여러 오퍼레이션 배치
3. `roam_create_page` — 페이지 생성 + 내용 한 번에
4. `roam_create_outline` / `roam_import_markdown` — 검증 포함
5. 순차적 개별 호출 — **피할 것**

---

## Batch Actions 패턴

### 기본: 블록 생성

```json
[
  {
    "action": "create-block",
    "location": { "parent-uid": "PAGE_UID", "order": "last" },
    "string": "블록 내용"
  }
]
```

### UID 플레이스홀더 (부모-자식 관계)

같은 배치에서 생성하는 블록끼리 참조할 때:

```json
[
  {
    "action": "create-block",
    "uid": "{{uid:parent1}}",
    "location": { "parent-uid": "PAGE_UID", "order": "last" },
    "string": "부모 블록"
  },
  {
    "action": "create-block",
    "location": { "parent-uid": "{{uid:parent1}}", "order": 0 },
    "string": "자식 블록"
  }
]
```

서버 응답: `{ "uid_map": { "parent1": "Xk7mN2pQ9" } }`

### 블록 업데이트 + 삭제

```json
[
  {
    "action": "update-block",
    "uid": "EXISTING_BLOCK_UID",
    "string": "수정된 내용"
  },
  {
    "action": "delete-block",
    "uid": "DELETE_THIS_UID"
  }
]
```

### 블록 이동

```json
[
  {
    "action": "move-block",
    "uid": "BLOCK_TO_MOVE",
    "location": { "parent-uid": "NEW_PARENT_UID", "order": "first" }
  }
]
```

---

## Current Context 관리 패턴

프로젝트 메모리의 Context는 항상 **최신 1개만** 유지한다.

```
1. 기존 조회:
   roam_search_for_tag(primary_tag="[Project] Memory", near_tag="[Project]/Context")
   → 블록 UID 획득

2. 기존 삭제:
   roam_process_batch_actions([{ "action": "delete-block", "uid": "OLD_UID" }])

3. 새로 기록:
   roam_remember(memory="현재 상태 요약", categories=["[Project]/Context"])
```

---

## 메모리 저장 패턴

### 프로젝트 메모리 (ROAM_MEMORIES_TAG 자동 태깅)

```
roam_remember(
  memory="기억할 내용",
  categories=["[Project]/[Topic]"]
)
```

### 범용 메모리 (Agent/Agent Memory — 프로젝트 무관)

```
roam_remember(
  memory="기억할 내용 #[[Agent/Agent Memory]]",
  categories=["Agent/Agent Memory/[Category]"],
  include_memories_tag=false
)
```

**카테고리 선택:**
- `Agent/Agent Memory/Core` — 핵심 상식 (세션마다 자동 로드)
- `Agent/Agent Memory/Dev` — 개발 팁, 트러블슈팅, 도구 사용법
- `Agent/Agent Memory/Patterns` — 코드 패턴, 아키텍처 결정, 컨벤션
- `Agent/Agent Memory/Preferences` — 사용자 선호도, 워크플로우, 도구 선택
- `Agent/Agent Memory/Lessons` — 실수, 해결책, 삽질 기록

**카테고리 목록 확인:** `roam_get_subpages(prefix="Agent/Agent Memory")`

### 저장 전 체크리스트

1. "다음 세션 에이전트가 이걸 몰랐을 때 실패하는가?" → No면 저장 불필요
2. "이건 이 프로젝트에서만 유효한가?" → Yes면 프로젝트 메모리, No면 Agent/Agent Memory
3. `roam_recall()` 응답이 **1,000 토큰 이내** 유지되는가?

---

## 범용 메모리 조회 패턴

| 목적 | 도구 |
|------|------|
| Core (세션 시작 시 자동) | `roam_search_for_tag(primary_tag="Agent/Agent Memory", near_tag="Agent/Agent Memory/Core")` |
| 카테고리별 | `roam_search_for_tag(primary_tag="Agent/Agent Memory", near_tag="Agent/Agent Memory/[Category]")` |
| 카테고리 목록 확인 | `roam_get_subpages(prefix="Agent/Agent Memory")` |
| Agent 전체 구조 | `roam_get_subpages(prefix="Agent")` |
| 이미 공유된 지식인지 확인 | 해당 카테고리 검색 후 중복 여부 판단 |

---

## Roam 마크다운 문법

### 기본

| 문법 | 결과 |
|------|------|
| `**bold**` | **bold** |
| `__italic__` | *italic* |
| `^^highlight^^` | highlight |
| `~~strike~~` | ~~strike~~ |
| `` `code` `` | `code` |

### 링크 & 참조

| 문법 | 용도 |
|------|------|
| `[[Page Name]]` | 페이지 참조 (생성/링크) |
| `((block-uid))` | 블록 참조 (인라인) |
| `{{[[embed]]: ((uid))}}` | 블록 임베드 (자식 포함) |
| `{{[[embed-children]]: ((uid))}}` | 자식만 임베드 |
| `{{[[embed-path]]: ((uid))}}` | 조상 경로 포함 임베드 |
| `[표시 텍스트]([[실제 페이지]])` | 앨리어스 페이지 링크 |
| `[표시 텍스트](<((uid))>)` | 앨리어스 블록 링크 |

### 태그

- 단일 단어: `#tag`
- 복수 단어: `#[[multiple words]]`
- 하이픈: `#self-esteem`
- **절대 금지**: `#knowledgemanagement` → `#[[knowledge management]]`

### 날짜

항상 서수 형식: `[[January 1st, 2025]]`, `[[December 23rd, 2024]]`

### 태스크

- `{{[[TODO]]}} 할 일`
- `{{[[DONE]]}} 완료`

### 속성

```
Type:: Book
Author:: [[Person Name]]
```

"이걸 그래프 전체에서 쿼리할 일이 있나?" → Yes면 `Attr::`, No면 `**Label:**`

---

## 테이블 구조

Roam 테이블은 중첩 블록 구조:

```
{{[[table]]}}
    - Header 1
        - Header 2
            - Header 3
    - Row 1 Label
        - Cell 1.1
            - Cell 1.2
```

**5컬럼 이하 권장.** `roam_create_table` 도구가 이 구조를 자동 생성.

---

## Datomic 쿼리 팁

### 기본 구조

```clojure
[:find ?block-string
 :where
 [?block :block/string ?block-string]
 [(clojure.string/includes? ?block-string "검색어")]
 :limit 25]
```

### 유용한 속성

| 속성 | 설명 |
|------|------|
| `:block/string` | 블록 텍스트 |
| `:node/title` | 페이지 제목 |
| `:block/uid` | 블록 UID |
| `:block/page` | 블록이 속한 페이지 |
| `:block/parents` | 모든 조상 |
| `:block/children` | 직계 자식 |
| `:block/refs` | 참조하는 페이지/블록 |
| `:create/time` | 생성 시간 |
| `:edit/time` | 수정 시간 |

### 술어

`clojure.string/includes?`, `clojure.string/starts-with?`, `clojure.string/ends-with?`, `<`, `>`, `<=`, `>=`, `=`, `not=`

### 예시: 특정 태그 + 텍스트 포함 블록 찾기

```clojure
[:find ?string ?uid
 :where
 [?b :block/string ?string]
 [?b :block/uid ?uid]
 [?b :block/refs ?ref]
 [?ref :node/title "Agent/Agent Memory"]
 [(clojure.string/includes? ?string "패턴")]
 :limit 20]
```

---

## 안티패턴

| 잘못 | 올바름 |
|------|--------|
| `#multiplewords` | `#[[multiple words]]` |
| `#1`, `#2` | `Step 1`, `No. 1` |
| `[[january 1, 2025]]` | `[[January 1st, 2025]]` |
| `[text](((uid)))` | `[text](<((uid))>)` |
| `{{embed: ((uid))}}` | `{{[[embed]]: ((uid))}}` |
| `[[TODO]] task` | `{{[[TODO]]}} task` |
| `**Attr**:: val` | `Attr:: val` |
| fetch→modify→fetch 루프 | `roam_process_batch_actions`로 배치 |
| 매번 page_title로 조회 | UID 캐시해서 재사용 |

---

## WorkBlocks 관리 패턴

### 블록 구조 (Roam 페이지)

```
[Project] WorkBlocks
├── Block 1: [작업 제목]
│   ├── {{[[TODO]]}} Sub Task A
│   ├── {{[[DONE]]}} Sub Task B
│   └── {{[[TODO]]}} Sub Task C
├── Block 2: [다음 작업]
│   └── ...
```

### 블록 완료 처리

```
1. 모든 Sub Task가 DONE인지 확인
2. Block 제목을 {{[[DONE]]}}으로 변경
3. 다음 Block으로 진행
```

roam_process_batch_actions로 한 번에 업데이트:
```json
[
  { "action": "update-block", "uid": "SUBTASK_UID", "string": "{{[[DONE]]}} Sub Task C" },
  { "action": "update-block", "uid": "BLOCK_UID", "string": "{{[[DONE]]}} Block 1: 작업 제목" }
]
```
