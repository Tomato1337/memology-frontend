# Implementation Plan: MemoLogy Meme Generation & UX Foundation

**Branch**: `001-memology-infinity-scroll` | **Date**: 2025-10-14 | **Spec**: ./spec.md
**Input**: Feature specification from `/specs/001-memology-infinity-scroll/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Launch core user value: (1) публичная бесконечная лента мемов с поиском/сортировкой и виртуализацией, (2) генерация мемов (text-to-image, image-to-image) с SSE стримингом результатов, (3) пользовательская галерея по датам, (4) аутентификация/профиль/переключение темы. Проект ФРОНТЕНД‑ТОЛЬКО: серверная логика вне скоупа, допускается тонкая прослойка/моки. Используем Next.js (App Router) для гибридного SSR + клиентской догрузки через TanStack Query. Генерация — асинхронный запрос + SSE для поступающих изображений. Формы валидируются через zod + react-hook-form. Токены (access/refresh) в http‑only cookies, обновление через fetch‑перехватчик, при фейле refresh — редирект на страницу входа. Источник API типов: `src/shared/api/api-schema.d.ts`.

## Technical Context

**Language/Version**: TypeScript (ES2023) / Next.js (latest 15 beta? confirm) — NEEDS CLARIFICATION (точная версия Next.js зафиксировать в package.json).  
**Primary Dependencies**: Next.js App Router, React 19, TanStack Query, TanStack Virtual, shadcn/ui (Radix), Tailwind CSS v4, react-hook-form, zod, MSW (моки), SSE (native EventSource).  
**Storage**: Фронтенд‑только: данных персистентных нет; для локального dev — MSW моки. Внешний API будет подключён позже по схеме.  
**Testing**: Vitest / Jest (не указано в repo — NEEDS CLARIFICATION), React Testing Library, Playwright для e2e (добавить позже).  
**Target Platform**: Web (desktop + mobile responsive ≥320px), Node.js runtime (Edge optional later).  
**Project Type**: Single web frontend (app/ directory structure) consuming future API.  
**Performance Goals**: LCP ≤2.5s (p75), CLS ≤0.1, INP ≤200ms, initial JS ≤150KB gzip, additional feature bundle delta ≤10KB, virtual scroll FPS ≥55.  
**Constraints**: Rate limit 20 generation requests/day/user; 1..4 images per request; avatar size ≤1MB (assumption), source image ≤2MB (assumption) — NEEDS CLARIFICATION (точные лимиты).  
**Scale/Scope**: Initial: 1K daily active users; design for scale to 100K (caching layers & CDN for images).  

Unknowns (Phase 0 research):
1. Next.js exact version & stability considerations.
2. Backend auth refresh endpoint contract (paths, status codes).
3. Final persistence stack (DB + storage) & naming conventions.
4. SSE event schema for image generation streaming.
5. Formal list of style presets & model identifiers.
6. Choice test runner (Vitest vs Jest) & coverage tooling.
7. Exact file size limits (avatar/source image) & mime whitelist.
8. Accessibility test automation approach (axe integration vs lighthouse CI).
9. SEO structured data model (ImageObject fields). 

Assumptions documented; will be validated in research.md.

MCP Testing Notes:
- Для локального тестирования UI использовать MCP Chrome (мануал к задачам). 
- Для получения актуальной документации библиотек в разработке использовать директиву MCP: `use context7`.

## Constitution Check (Pre-Design Baseline)

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The implementation plan MUST list current status (Pass/Fail/Risk) for each gate below and mitigation for any Fail/Risk:

| Gate | Target | Status | Mitigation (if needed) |
|------|--------|--------|------------------------|
| ESLint Errors | 0 blocking | Baseline Pending | Запустить lint audit; добавить в CI gate |
| Dead Exports | 0 | Baseline Pending | Включить unused exports rule / ts-prune step |
| Test Coverage (Stmts/Lines) | ≥85% | Fail (нет метрик) | Добавить тест раннер + initial smoke tests Phase 1 |
| Branch Coverage | ≥80% | Fail | Аналогично — после тест инфраструктуры |
| PR Test Runtime | <60s | Pass (низкая база) | Следить при росте тестов |
| Accessibility (Lighthouse) | ≥95 | Baseline Pending | Добавить Lighthouse CI + axe playwright Phase 1 |
| LCP (p75) | ≤2.5s | Baseline Pending | Измерить после реализации скролла & генерации mock |
| CLS (p75) | ≤0.1 | Baseline Pending | Убедиться в фиксированных размерах媒体 |
| INP (p75) | ≤200ms | Baseline Pending | Профилировать интеракции (search, theme toggle) |
| Initial JS Gzip | ≤150KB | Risk (неизмерено) | Запустить bundle analyzer; отслеживать delta |
| SEO Score | ≥95 | Baseline Pending | Добавить meta + structured data шаблон |
| Design Token Drift | 0 untracked tokens | Baseline Pending | Ввести tokens.ts и аудит скрипт TODO |

If any performance/SEO metric cannot yet be measured (new route/components), mark as "Baseline Pending" and create a follow-up task.

## Project Structure

### Documentation (this feature)

```
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

ios/ or android/
```
src/
├── app/                       # Next.js app router
│   ├── layout.tsx
│   ├── page.tsx                # public feed
│   ├── generate/               # generation page
│   ├── gallery/                # user gallery (protected)
│   ├── profile/                # profile (protected)
│   └── auth/ (login, register) # auth pages
├── components/
│   ├── ui/                     # design system primitives (shadcn adapted)
│   ├── masonry-grid.tsx
│   ├── meme-card.tsx
│   └── generation/
├── hooks/
├── shared/
│   ├── api/ (client.ts, endpoints wrappers)
│   ├── types/
│   └── config/
├── lib/ (utils, search params helpers, token refresh interceptor)
tests/
├── unit/
├── integration/
├── ui/ (RTL interaction tests)
└── e2e/ (future Playwright)
specs/001-memology-infinity-scroll/
└── (documents & contracts)
```

**Structure Decision**: Single Next.js app with modular feature folders under `app/` and shared primitives under `components/ui`. Contracts & spec docs isolated under `specs/<feature>/`.

## Complexity Tracking

*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Missing coverage gates | Initial repo lacks test infra | Must add tooling before enforcing |
| Bundle size unknown | Need baseline measurement | Cannot optimize blind; measure first |
| No token drift audit | Tokens not centralized yet | Ad-hoc styles risk inconsistency |

## Constitution Check (Post-Design Re-Eval)

| Gate | Target | Status | Mitigation |
|------|--------|--------|------------|
| ESLint Errors | 0 blocking | Pending Audit | Run lint + fix; add CI step |
| Dead Exports | 0 | Pending | Introduce ts-prune script before Phase 2 |
| Test Coverage (Stmts/Lines) | ≥85% | Planned (Fail until infra) | Add Vitest + initial tests tasks.md Phase 2 |
| Branch Coverage | ≥80% | Planned | Same as above |
| PR Test Runtime | <60s | Pass (expected) | Monitor when tests grow |
| Accessibility (Lighthouse) | ≥95 | Planned | Add axe + lighthouse CI workflow |
| LCP (p75) | ≤2.5s | Baseline Pending | Measure after implementation of feed & generation mock |
| CLS (p75) | ≤0.1 | At Risk (masonry relayout) | Reserve aspect ratio boxes; skeleton sizes fixed |
| INP (p75) | ≤200ms | Baseline Pending | Defer heavy work off main thread (none yet) |
| Initial JS Gzip | ≤150KB | Risk (unknown) | Bundle analyzer baseline commit |
| SEO Score | ≥95 | Planned | Add meta + JSON-LD scaffold |
| Design Token Drift | 0 untracked tokens | Risk (tokens not centralized) | Introduce tokens.ts + lint rule Phase 2 |

No blockers to proceed to tasks phase once initial infra tasks scheduled.
