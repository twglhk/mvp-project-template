# {{PROJECT_NAME}}

> {{PROJECT_DESCRIPTION}}

## Stack

- **AI Agent**: OpenCode + Oh My OpenAgent + Roam Research Memory
- **Frontend**: Next.js 16 + Tailwind CSS v4 + Supabase (Netlify)
- **Backend**: Hono + @hono/node-server (Railway)
- **Database**: Supabase (shared project, `landing_page_id` isolation)

## Quick Start

### 1. Use this template

GitHub에서 **"Use this template"** 클릭 → 새 레포 생성.

### 2. Clone & Setup

```bash
git clone <your-new-repo-url>
cd <your-new-repo>
chmod +x setup.sh
./setup.sh
```

스크립트가 처리하는 것:
- 프로젝트 이름 → `AGENTS.md`, `README.md`, `opencode.json` 등의 플레이스홀더 치환
- Roam API 토큰 + 그래프 이름 → `opencode.json` 설정
- `.env` 자동 생성
- OpenCode 플러그인 설치

### 3. Roam 페이지 생성

셋업 후 Roam에서 두 페이지를 만든다:

- **`[ProjectName] WorkBlocks`** — 작업 블록 관리용
- **`[ProjectName] Memory`** — 프로젝트 메모리 저장소

### 4. Install & Run

```bash
# Frontend
npm install
npm run dev          # http://localhost:3000

# Backend
cd server
npm install
npm run dev          # http://localhost:3001

# OpenCode (AI Agent)
opencode
```

## Prerequisites

- [OpenCode](https://opencode.ai) 설치
- [Oh My OpenAgent](https://github.com/code-yeongyu/oh-my-openagent) 글로벌 플러그인 등록
  - `~/.config/opencode/opencode.json`에 `"plugin": ["oh-my-openagent"]` 포함 필요
- Roam Research API 토큰 ([발급 방법](https://roamresearch.com/#/app/developer))

## Environment Variables

`.env.example` → `.env` 복사 후 값 채우기:

| Variable | Where | Description |
|----------|-------|-------------|
| `PROJECT_NAME` | Setup | 프로젝트 이름 (Roam 메모리 태그에 사용) |
| `ROAM_API_TOKEN` | Setup | Roam Research API 토큰 |
| `ROAM_GRAPH_NAME` | Setup | Roam 그래프 이름 |
| `NEXT_PUBLIC_SUPABASE_URL` | Frontend | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Frontend | Supabase anon key |
| `NEXT_PUBLIC_API_URL` | Frontend | Backend API URL |
| `NEXT_PUBLIC_PROJECT_SLUG` | Frontend | 프로젝트 식별자 (Supabase landing_page_id) |
| `SUPABASE_URL` | Backend | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Backend | Supabase service role key |
| `CORS_ORIGINS` | Backend | 허용 CORS origins |

## Deployment

### Netlify (Frontend)
- 이 repo에 연결, push 시 자동 배포
- Netlify 대시보드에서 env vars 설정

### Railway (Backend)
1. 새 프로젝트 생성 → 이 repo 연결
2. Root directory를 `server/`로 설정
3. Env vars 설정
4. Deploy

## Content

랜딩 페이지 콘텐츠는 `src/lib/config.ts` 한 파일에서 관리:
- Headlines, story, features, CTA text
- Survey questions
- Design tokens (accent color, border radius)

## Database

Supabase SQL Editor에서 `supabase/migrations/001_init.sql` 실행.

## AI Agent System

### Memory System (2-Tier)

**Tier 1: 프로젝트 메모리** — `ROAM_MEMORIES_TAG`로 자동 태깅

```
[ProjectName] Memory/
├── [ProjectName]/Context     ← 세션 상태 (1개만 유지)
├── [ProjectName]/Core        ← 핵심 상식 (매 세션 로드)
└── [ProjectName]/[Topic]     ← 토픽별 (온디맨드)
```

**Tier 2: 범용 메모리** — 프로젝트 무관, 모든 프로젝트에서 접근

```
Agent Memory/
├── Agent/Dev            ← 개발 팁
├── Agent/Patterns       ← 패턴/컨벤션
├── Agent/Preferences    ← 사용자 선호도
└── Agent/Lessons        ← 교훈
```

### Available Agents

| Agent | 파일 | 역할 |
|-------|------|------|
| PO Consultant | `.opencode/agents/po.md` | 프로덕트 전략, 지표 설계, 성장 모델링 |
| Web Designer | `.opencode/agents/web-designer.md` | 랜딩 페이지 디자인 + 구현 |

### Model Preset

| 역할 | 모델 |
|------|------|
| Sisyphus (메인) | Claude Opus 4 |
| Oracle (아키텍처) | Claude Opus 4 |
| Explore (탐색) | Grok Code Fast |
| Librarian (문서) | MiniMax M2.7 |
| Visual Engineering | Claude Sonnet 4 |
| Quick Tasks | GPT-5.4 Mini |
| Ultrabrain | Claude Opus 4 (xhigh) |

## File Structure

```
project/
├── AGENTS.md                    # AI Agent 지침서
├── README.md
├── .env.example                 # 환경변수 템플릿
├── .gitignore
├── opencode.json                # MCP 서버 설정 (gitignored)
├── setup.sh                     # 초기화 스크립트 (사용 후 삭제 가능)
├── .opencode/
│   ├── oh-my-openagent.json     # 모델/카테고리 프리셋
│   ├── package.json             # 플러그인 의존성
│   ├── agents/
│   │   ├── po.md                # PO 컨설턴트
│   │   └── web-designer.md      # 웹 디자이너
│   └── skills/
│       └── roam-research.md     # Roam 오퍼레이션 가이드
├── src/                         # Next.js Frontend
│   ├── app/                     # App Router pages
│   ├── components/              # React components
│   └── lib/
│       ├── config.ts            # 랜딩 콘텐츠 (Forge 타겟)
│       ├── i18n.ts              # 국제화
│       └── supabase.ts          # Supabase client
├── server/                      # Hono Backend
│   └── src/
│       ├── index.ts             # Entry point
│       ├── routes/              # API routes
│       └── services/            # Business logic
├── supabase/
│   └── migrations/              # DB schema
├── netlify.toml                 # Netlify 빌드 설정
├── CUSTOMIZATION.md             # 커스터마이징 가이드
├── package.json
└── tsconfig.json
```

## Customization

자세한 커스터마이징 가이드는 [CUSTOMIZATION.md](./CUSTOMIZATION.md) 참조.
