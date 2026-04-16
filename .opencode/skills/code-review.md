---
name: code-review
description: "Sisyphus x Oracle 코드 리뷰 & 기술 토론 프로토콜. 두 시니어 엔지니어가 코드를 보며 티키타카하는 구조화된 리뷰. 아키텍처 평가, 보안 점검, 프로덕션 readiness 체크에 사용. 모든 주장에 외부 근거(기술 문서, 블로그, CWE 등) 필수."
---

# Code Review & Technical Discussion Protocol

Sisyphus(메인 에이전트)와 Oracle(아키텍처 전문가)이 시니어 엔지니어 롤플레이로 코드를 리뷰하고 토론하는 프로토콜.

---

## When to Use

- 새 기능/모듈 구현 완료 후 품질 평가
- 아키텍처 결정의 타당성 검증
- 프로덕션 배포 전 readiness 체크
- 기술 부채 식별 및 우선순위 정리

---

## Phase 1: Context Gathering (Sisyphus 주도)

### 1.1 코드베이스 탐색 (병렬)

4-5개 explore agent를 동시에 실행하여 코드베이스를 **빠짐없이** 파악한다.

```
목표별 explore agent 분배:
├── Agent 1: 전체 아키텍처 패턴 (엔트리포인트, 라우팅, 미들웨어, DI)
├── Agent 2: 핵심 비즈니스 로직 (도메인별 서비스, 알고리즘)
├── Agent 3: 데이터 레이어 (DB 스키마, 마이그레이션, ORM, 쿼리 패턴)
├── Agent 4: 인프라/운영 (인증, 에러 핸들링, 로깅, 배포 설정)
└── Agent 5: 외부 연동 (API 클라이언트, SDK 래퍼, 메시지 큐)
```

### 1.2 직접 파일 읽기 (병렬)

explore agent가 탐색하는 동안, Sisyphus는 직접:
- 모든 소스 파일을 **실제로 읽는다** (요약이 아닌 전문)
- 타입 정의, 설정 파일, 마이그레이션 SQL 전체 확인
- 의존성 목록 (package.json) 확인

**원칙: 읽지 않은 코드에 대해 판단하지 않는다.**

### 1.3 초기 관찰 정리

코드를 모두 읽은 후, Sisyphus가 1차 관찰을 정리:
- **잘한 점** (구체적 코드 위치 포함)
- **의문점** (판단 보류, 질문 형태)
- **우려 사항** (잠재적 버그, 보안, 성능)

---

## Phase 2: Oracle Consultation (깊이 있는 리뷰)

### 2.1 Oracle에게 전달할 컨텍스트 구성

Oracle에게 **충분한 컨텍스트**를 제공해야 한다. 다음을 포함:

```
1. 프로젝트 개요 (한 문단)
2. 기술 스택 (전체 목록)
3. 아키텍처 다이어그램 (디렉토리 트리 + 모듈 관계)
4. 핵심 구현 상세 (코드 스니펫 포함, 파일:라인 명시)
5. Sisyphus의 초기 관찰 (잘한 점 + 의문점)
```

### 2.2 Oracle에게 요청하는 리뷰 항목

```
1. 전체 아키텍처 설계 평가 (잘한 점, 개선점)
2. Sisyphus 의문점에 대한 동의/반론 (근거 제시)
3. Sisyphus가 놓친 추가 이슈
4. 보안 관점 평가
5. 프로덕션 readiness 평가
```

### 2.3 근거 요구 사항

**모든 주장에는 반드시 근거를 제시해야 한다:**
- 공식 문서 (Node.js, PostgreSQL, 프레임워크 등)
- CWE/CVE 번호 (보안 이슈)
- 기술 블로그 또는 커뮤니티 글 (설계 패턴)
- GitHub issue (알려진 문제)
- 벤치마크 데이터 (성능 주장)

---

## Phase 3: Verification (Sisyphus가 Oracle 주장 검증)

### 3.1 Librarian 병렬 실행

Oracle이 제시한 핵심 주장들을 **외부 근거로 교차 검증**한다.

```
주장별 librarian agent 분배:
├── Librarian 1: 보안 관련 주장 (CWE, OWASP, 실제 exploit 사례)
├── Librarian 2: 프레임워크/인프라 주장 (공식 문서, GitHub issue)
└── Librarian 3: 패턴/설계 주장 (커뮤니티 합의, 대안 비교)
```

### 3.2 사실 오류 교정

Oracle의 주장에 사실 오류가 있으면 **즉시 교정**한다.

```markdown
**🟢 Sisyphus (Correction ⚠️):** Oracle의 사실관계 오류.
Librarian 검증 결과: [실제 내용 + 출처 URL]
```

### 3.3 부분 동의 표현

```markdown
**🟢 Sisyphus (Verification):** 동의. 단, [추가 맥락/반론].
```

---

## Phase 4: Structured Discussion (티키타카)

### 4.1 라운드 구성

토론은 **라운드** 단위로 구성한다:

| 라운드 | 내용 |
|--------|------|
| Round 1 | 전체 아키텍처 평가 (잘한 점 중심) |
| Round 2 | 의문점 토론 (항목별 동의/반론/합의) |
| Round 3 | Oracle 추가 발견 이슈 |
| Round 4 | 보안 평가 |
| Round 5 | 최종 합의 (프로덕션 readiness 점수) |

### 4.2 개별 이슈 토론 형식

```markdown
### ① [이슈 제목]

**🟢 Sisyphus:** [초기 관찰/의문]

**🔵 Oracle:** [동의/반론 + 근거]

**🟢 Sisyphus (Verification):** [외부 근거로 검증]
> **[출처 이름]** — [출처 URL]:
> "[핵심 인용]"

**✅ 합의:** [최종 판단 + 우선순위]
```

### 4.3 합의 도달 규칙

- 양쪽 모두 외부 근거를 제시해야 합의 성립
- 사실 오류는 즉시 교정 (근거 필수)
- 의견 차이는 **risk/cost ratio**로 판단
- 합의에 반드시 우선순위 태그 포함: `P0`(즉시), `P1`(이번 스프린트), `P2`(스케일링 전), `P3`(nice-to-have)

---

## Phase 5: Synthesis (결과 정리)

### 5.1 최종 출력 형식

```markdown
## 잘한 점 (합의됨)
1. [항목] — [근거]
...

## 개선 필요 (우선순위별)

| 우선순위 | 항목 | 근거 |
|----------|------|------|
| P0 | ... | [출처 URL] |
| P1 | ... | [출처 URL] |
| P2 | ... | [출처 URL] |

## 보안 평가 테이블
| 항목 | 상태 | 심각도 |
|------|------|--------|

## 프로덕션 Readiness
- 점수: X/5
- 갖춘 것: [목록]
- 부족한 것: [목록]
- 핵심 리스크 시나리오: [1-3개]
```

### 5.2 후속 조치 연결

리뷰 결과를 **실행 가능한 태스크**로 변환:
- WorkBlocks에 Phase 추가 (Roam 사용 시)
- 또는 GitHub Issue 생성
- 각 태스크에 수정 대상 파일:라인, 수정 방향, 근거 URL 포함

---

## Anti-Patterns

| 하지 마라 | 대신 |
|-----------|------|
| 근거 없이 "이건 나쁘다" | 구체적 문제 시나리오 + 외부 근거 제시 |
| Oracle 주장을 무비판 수용 | Librarian으로 교차 검증 후 동의/반론 |
| "일반적으로 ~해야 한다" | "이 코드의 [파일:라인]에서 [구체적 문제]" |
| 전부 고치라고 지적 | risk/cost ratio로 우선순위 정리 |
| 읽지 않은 코드 추측 | 모든 소스 파일을 실제로 읽은 후 판단 |
| 이론적 완벽함 추구 | MVP 맥락에서 실용적 판단 (지금 vs 나중에) |

---

## Invocation Examples

### 전체 서버 리뷰
```
skill("code-review")
→ server/ 디렉토리 전체를 대상으로 Phase 1-5 실행
```

### 특정 모듈 리뷰
```
skill("code-review")
→ "AI Session Engine (server/src/ai/) 모듈만 리뷰해줘"
→ Phase 1에서 해당 모듈 + 의존 모듈만 탐색
```

### 보안 집중 리뷰
```
skill("code-review")
→ "보안 관점에서만 리뷰해줘"
→ Round 4 확장, 나머지 축소
```

### 위임 시
```
task(category="unspecified-high", load_skills=["code-review"], prompt="...")
```
