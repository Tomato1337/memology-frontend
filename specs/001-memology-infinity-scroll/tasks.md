---
description: "Task list for MemoLogy feature (frontend-only)"
---

# Tasks: MemoLogy Meme Generation & UX Foundation

MCP Notes:
- Use MCP Chrome for local UI testing flows: open pages, fill forms, assert DOM.
- For up-to-date library docs during dev, use MCP directive: `use context7`.

## Phase 1: Setup (Shared Infrastructure)

- [ ] T001 Implement typed API helpers from src/shared/api/api-schema.d.ts in src/shared/api/client.ts
- [ ] T002 Replace native token interceptor with a reusable auth middleware in src/shared/api/client.ts
- [ ] T004 [P] Align MSW handlers to api-schema in src/mocks/handlers.ts
- [ ] T005 [P] Wire MSW in dev instrumentation in src/instrumentation-client.tsx
- [ ] T006 [P] Add Vitest + RTL config at vitest.config.ts
- [ ] T007 [P] Add bundle analyzer and baseline in next.config.ts
- [ ] T008 [P] Bootstrap design tokens in src/shared/theme/tokens.ts
- [ ] T009 [P] Integrate fonts via next/font in src/app/layout.tsx
- [ ] T010 [P] Map tokens and fonts in src/app/globals.css
- [ ] T011 [P] Add axe testing helper in tests/setup/axe.ts
- [ ] T012 [P] Add Lighthouse CI workflow at .github/workflows/lighthouse.yml

## Phase 2: Foundational (Blocking Prerequisites)

- [ ] T013 Configure TanStack Query provider and hydration in src/app/components/providers.tsx
- [ ] T014 Create auth middleware to protect /gallery and /profile in src/middleware.ts
- [ ] T015 [P] Add shared SSE helper for EventSource in src/shared/api/sse.ts
- [ ] T016 [P] Add search params helpers for SSR/CSR in src/lib/search-params.ts

## Phase 3: User Story 1 – Бесконечная лента (P1)

- [ ] T017 [US1] SSR first page with search in src/app/page.tsx
- [ ] T018 [US1] Client pagination with TanStack Query in src/components/all-memes-cards.tsx
- [ ] T019 [US1] Virtualized masonry grid in src/components/masonry-grid.tsx
- [ ] T020 [P] [US1] Search input and sort controls in src/app/page.tsx
- [ ] T021 [P] [US1] Loading skeletons with fixed aspect ratio in src/components/cards-skeleton.tsx

## Phase 4: User Story 2 – Генерация мемов (P1)

- [ ] T022 [US2] Create generation page route in src/app/generate/page.tsx
- [ ] T023 [US2] Form with RHF + zod schema in src/app/generate/page.tsx
- [ ] T024 [US2] Call /memes/generate using typed apiClient in src/app/generate/page.tsx
- [ ] T025 [US2] Handle SSE stream and append results in src/app/generate/page.tsx
- [ ] T026 [P] [US2] Image-to-image upload with size/mime validation in src/components/generation/upload.tsx
- [ ] T027 [P] [US2] Cancel generation and clear UI state in src/app/generate/page.tsx

## Phase 5: User Story 5 – Аутентификация (P1)

- [ ] T028 [US5] Login page with form in src/app/auth/login/page.tsx
- [ ] T029 [US5] Register page with avatar upload in src/app/auth/register/page.tsx
- [ ] T030 [US5] Wire /auth/login and redirect on success in src/app/auth/login/page.tsx
- [ ] T031 [US5] Wire /auth/register with client-side validation in src/app/auth/register/page.tsx

## Phase 6: User Story 3 – Личная галерея (P2)

- [ ] T032 [US3] Gallery page fetching /users/me/gallery in src/app/gallery/page.tsx
- [ ] T033 [US3] Group items by date with util in src/lib/date-grouping.ts
- [ ] T034 [P] [US3] Infinite scroll for user gallery in src/app/gallery/page.tsx

## Phase 7: User Story 4 – Профиль и тема (P3)

- [ ] T035 [US4] Profile page with displayName/avatar form in src/app/profile/page.tsx
- [ ] T036 [US4] Wire /users/me/profile update in src/app/profile/page.tsx
- [ ] T037 [P] [US4] Theme toggle persistence in src/components/app-sidebar.tsx

## Final Phase: Polish & Cross-Cutting

- [ ] T038 [P] SEO meta via generateMetadata in src/app/**/page.tsx
- [ ] T039 [P] JSON-LD WebSite scaffold in src/app/layout.tsx
- [ ] T040 [P] Error/empty/loading states audit in src/components/meme-card.tsx
- [ ] T041 [P] MSW responses parity audit in src/mocks/handlers.ts
- [ ] T042 [P] Update quickstart with MCP/context7 in specs/001-memology-infinity-scroll/quickstart.md

## Dependencies

- US1 depends on: Phase 1 (client, tokens, MSW), Phase 2 (Query, search helpers)
- US2 depends on: Phase 1 (client, tokens), Phase 2 (SSE helper)
- US5 depends on: Phase 1 (client), Phase 2 (auth middleware)
- US3 depends on: Phase 1 (client), Phase 2 (auth middleware)
- US4 depends on: Phase 1 (fonts/tokens), Phase 2 (auth middleware)

## Parallel execution examples

- During Phase 1: T004, T005, T006, T007, T009–T012 can run in parallel after T001–T003
- US1: T020 and T021 can run in parallel to T018–T019
- US2: T026 and T027 can run in parallel to T024–T025
- US3: T033 and T034 can run in parallel to T032
- US4: T037 can run in parallel to T035–T036

## Implementation strategy

- MVP scope: Complete US1 (feed) + US5 (login) minimal to access protected areas; US2 basic text-to-image (single image) optional if time permits.
- Incremental delivery: Finish Phase 1/2, then US1 → US5 → US2 → US3 → US4 → Polish.
- Testing: Add minimal unit/interaction tests during Phase 1; expand per story as components stabilize.
