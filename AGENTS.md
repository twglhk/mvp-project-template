# AGENTS.md - AI Agent Guidelines for {{PROJECT_NAME}}

> {{PROJECT_DESCRIPTION}}

## Project Status

**Phase**: {{CURRENT_PHASE}}

---

## Initial Setup (첫 실행 감지)

> 이 파일에 `{{PROJECT_NAME}}` 플레이스홀더가 남아있으면 아직 초기 셋업이 완료되지 않은 상태이다.

**셋업 미완료 시:** `skill("setup")` 로드 → 지침에 따라 대화형 셋업 진행 → 완료 후 정상 세션 시작. 다른 작업은 셋업 완료 전까지 수행하지 않는다.

---

## Block-Based Work Principle (Session Start Required)

> **Work Blocks:** `roam_fetch_page_by_title("{{PROJECT_NAME}}/WorkBlocks")`
> **Current Context:** `roam_search_for_tag(primary_tag="{{PROJECT_NAME}}/Memory", near_tag="{{PROJECT_NAME}}/Memory/Context")` — 항상 로드
> **Core 상식:** `roam_search_for_tag(primary_tag="{{PROJECT_NAME}}/Memory", near_tag="{{PROJECT_NAME}}/Memory/Core")` — 항상 로드 (세션마다 필수 기반 지식)
> **토픽별 조회:** `roam_search_for_tag(primary_tag="{{PROJECT_NAME}}/Memory", near_tag="{{PROJECT_NAME}}/Memory/[Topic]")` — 온디맨드 (태그 목록: {{PROJECT_NAME}}/Memory 페이지 참조)

**문서 정책:** 모든 문서 작업은 RoamResearch 우선. 로컬 백업 불필요 (정본 = Roam).

### Session Start

1. `roam_search_for_tag(primary_tag="{{PROJECT_NAME}}/Memory", near_tag="{{PROJECT_NAME}}/Memory/Context")` — Current Context 로드
2. `roam_search_for_tag(primary_tag="{{PROJECT_NAME}}/Memory", near_tag="{{PROJECT_NAME}}/Memory/Core")` — 핵심 상식 로드 (항상 필요)
3. `roam_fetch_page_by_title("{{PROJECT_NAME}}/WorkBlocks")` — 현재 Block + 미완료 Sub Task 파악 → Todo 등록
4. 사용자 요청에서 토픽 추론 → `roam_search_for_tag(primary_tag="{{PROJECT_NAME}}/Memory", near_tag="{{PROJECT_NAME}}/Memory/[Topic]")` 추가 실행

### Block Rules

- **현재 Block의 모든 Sub Task 완료 전까지 다음 Block 진입 금지**
- Block 내 Sub Task는 병렬 진행 가능
- Block 완료 시: Sub Task 체크 → 검증 → WorkBlocks 업데이트 (`roam_process_batch_actions`) → 다음 Block
- 블로커 발생 시 사용자에게 보고. 긴급 핫픽스는 현재 Block 완료 후 별도 Block으로.

---

## Roam Research Skill

Roam 도구의 상세 사용법 (배치 액션, 마크다운 문법, 쿼리 패턴 등)은 **skill로 분리**되어 있다.

- **메인 에이전트**: `skill("roam-research")` 호출로 로드
- **서브에이전트 위임 시**: `task(..., load_skills=["roam-research"])` 로 주입

Roam에 데이터를 읽거나 쓸 때, 문법이나 도구 사용법이 불확실하면 skill을 로드한다.

---

## Memory 운영 원칙 (RoamResearch)

> **전제 조건:** MCP 설정에 `ROAM_MEMORIES_TAG="{{PROJECT_NAME}}/Memory"` 필수.
> **태그 목록:** `roam_fetch_page_by_title("{{PROJECT_NAME}}/Memory")` 참조

### 2-Tier Memory System

이 프로젝트는 **프로젝트 메모리**와 **범용 메모리** 두 계층을 운용한다.

#### Tier 1: 프로젝트 메모리 (`{{PROJECT_NAME}}/Memory`)

프로젝트에 종속된 지식. `ROAM_MEMORIES_TAG`로 자동 태깅.

```
{{PROJECT_NAME}}/Memory/
├── {{PROJECT_NAME}}/Memory/Context       ← 현재 세션 상태 (항상 최신 1개만 유지)
├── {{PROJECT_NAME}}/Memory/Core          ← 핵심 상식 (세션마다 필수 로드)
└── {{PROJECT_NAME}}/Memory/[Topic]       ← 토픽별 메모리 (온디맨드)
```

#### Tier 2: 범용 메모리 (`Agent Memory`)

프로젝트를 넘어 모든 작업에서 유효한 지식. 직접 태깅.

```
Agent Memory/
├── Agent/Dev                      ← 개발 관련 범용 지식 (트러블슈팅, 도구 팁)
├── Agent/Patterns                 ← 패턴/컨벤션 (코드스타일, 아키텍처 결정)
├── Agent/Preferences              ← 사용자 선호도 (워크플로우, 도구 선택)
└── Agent/Lessons                  ← 배운 교훈 (실수, 해결책, 삽질 기록)
```

### 기억 저장

**프로젝트 메모리:**
```
roam_remember(
  memory="기억할 내용",
  categories=["{{PROJECT_NAME}}/Memory/[Topic]"]
)
```

**범용 메모리 (프로젝트 무관한 지식일 때):**
```
roam_remember(
  memory="기억할 내용 #[[Agent Memory]]",
  categories=["Agent/[Category]"],
  include_memories_tag=false
)
```

- 프로젝트 메모리: `#[[{{PROJECT_NAME}}/Memory]]` 자동 추가 (`ROAM_MEMORIES_TAG`)
- 범용 메모리: `include_memories_tag=false` + `#[[Agent Memory]]`를 memory 텍스트에 직접 포함
- 기록 전 자문: "다음 세션 Agent가 이걸 몰랐을 때 실패하는가?" → Yes면 기록
- 추가 자문: "이건 이 프로젝트에서만 유효한가, 어디서든 유효한가?" → 후자면 범용 메모리

### 기억 조회

| 목적 | 도구 |
|------|------|
| Current Context | `roam_search_for_tag(primary_tag="{{PROJECT_NAME}}/Memory", near_tag="{{PROJECT_NAME}}/Memory/Context")` |
| 전체 프로젝트 메모리 | `roam_recall()` (필터 없는 전체 덤프 전용) |
| 토픽별 필터 | `roam_search_for_tag(primary_tag="{{PROJECT_NAME}}/Memory", near_tag="{{PROJECT_NAME}}/Memory/[Topic]")` |
| 범용 메모리 전체 | `roam_search_for_tag(primary_tag="Agent Memory")` |
| 범용 메모리 카테고리별 | `roam_search_for_tag(primary_tag="Agent Memory", near_tag="Agent/Dev")` 등 |

### Current Context 업데이트 (항상 최신 1개만 유지)

1. `roam_search_for_tag(primary_tag="{{PROJECT_NAME}}/Memory", near_tag="{{PROJECT_NAME}}/Memory/Context")` — 기존 블록 UID 조회
2. `roam_process_batch_actions` — 기존 블록 삭제 (delete-block)
3. `roam_remember(memory="...", categories=["{{PROJECT_NAME}}/Memory/Context"])` — 새 블록 기록

**목표:** `roam_recall()` 응답이 항상 **1,000 토큰 이내** 유지. 불필요한 기록 금지.

---

## Session Cleanup Principle (세션 정리 원칙)

사용자가 **세션 정리** 또는 **세션 마무리**를 요청한 경우 다음을 수행한다:

### 1. 파일 정리

| 대상                                          | 작업                                               |
| --------------------------------------------- | -------------------------------------------------- |
| 임시 파일 (테스트 스크립트, 디버깅용 파일 등) | 삭제                                               |
| 잘못된 위치의 파일                            | 올바른 디렉토리로 이동                             |
| 빈 placeholder 파일 (.gitkeep 등)             | 실제 파일 존재 시 삭제                             |
| root 디렉토리 정리                            | 설정 파일 외 코드 파일이 있다면 적절한 위치로 이동 |

### 2. Git 커밋

- 커밋되지 않은 변경사항이 있다면 **커밋 처리**
- 커밋 메시지는 작업 내용을 명확히 반영

### 3. Git Push (조건부)

- 프로덕션 영향이 없는 경우 자동 push 가능
- 불확실하면 사용자에게 push 여부 확인 후 진행

### 4. RoamResearch Memory 업데이트

- **Current Context** 업데이트: `roam_remember(memory="...", categories=["{{PROJECT_NAME}}/Memory/Context"])` (이전 블록 먼저 삭제)
- **범용 메모리** 체크: 이번 세션에서 프로젝트 무관한 유용한 지식이 있었는지 확인 → 있으면 Agent Memory에 기록

### 5. 기억/망각 정리

Roam 메모리의 기억/망각 로직에 따라, 이번 세션을 근거로 정리할 것이 있는지 체크한다.

---

## Project Context

### Quick Reference

- **목적:** {{PROJECT_PURPOSE}}
- **인프라:** {{INFRASTRUCTURE}}

<!-- 아래는 프로젝트에 맞게 작성 -->

<!--
### Agent Team (예시)

| Agent | ID | 역할 |
|-------|-----|------|
| Commander | `main` | 오케스트레이션 |

### Core Tenets (예시)

1. **Signal Over Noise** — 양보다 질
2. **Source Attribution** — 출처 명시
-->

---

## Project Structure

```
{{PROJECT_NAME}}/
├── AGENTS.md                    # AI Agent 지침서
├── README.md
├── .env                         # 시크릿 (gitignored)
├── .gitignore
├── opencode.json                # MCP 서버 설정 (gitignored)
├── .opencode/                   # OpenCode 프로젝트 설정
│   ├── oh-my-openagent.json     # 모델/카테고리 배정
│   ├── package.json             # 플러그인 의존성
│   ├── agents/
│   │   ├── po.md                # PO 컨설턴트 에이전트
│   │   └── web-designer.md      # 웹 디자이너 에이전트
│   └── skills/
│       └── roam-research.md     # Roam 오퍼레이션 가이드
└── ...
```

---

## Available Agents

| Agent | 파일 | 역할 |
|-------|------|------|
| PO Consultant | `.opencode/agents/po.md` | 프로덕트 전략, 지표 설계, 성장 모델링. Roam 프레임워크 on-demand 로드. |
| Web Designer | `.opencode/agents/web-designer.md` | 랜딩 페이지 디자인 + 구현. 레퍼런스 기반, 목적 중심, AI 슬롭 제거. 단계별 사용자 확인. |

## Agent-Specific Instructions

<!-- 프로젝트에 맞는 에이전트 운영 지침을 여기에 작성 -->

---

## Permissions

### 확인 없이 실행 가능

- 파일 읽기, 디렉토리 탐색
- 설정 파일 수정
- Git 커밋 (요청 시)

### 먼저 확인

- 배포 / 재시작
- 새 에이전트 추가
- API 키 변경

### 절대 금지

- 시크릿/API 키 하드코딩 또는 커밋
- 명시적 요청 없이 프로덕션 변경
