# Phase 0 Research: MemoLogy Meme Generation & UX Foundation

## Overview
Resolve unknowns enumerated in Technical Context and establish initial design decisions to unblock Phase 1 design & contracts.

## Decision Log

### 1. Next.js Version
- **Decision**: Use Next.js 15 (latest stable/RC at implementation time). Lock exact version in package.json to avoid unexpected breaking changes.
- **Rationale**: Needed for App Router & streaming optimizations.
- **Alternatives**: Next 14 (stable) – less future-proof for features (RSC improvements). CRA – outdated, misses hybrid SSR.

### 2. Auth Refresh Contract
- **Decision**: `/api/auth/refresh` POST, expects refresh cookie, returns JSON `{accessToken, expiresIn}` and sets new refresh cookie (rotated). 401 means invalid refresh.
- **Rationale**: Simple RESTful pattern; avoids leaking refresh token to client JS (http-only).  
- **Alternatives**: Silent iframe (legacy), WebSocket re-auth (complex, unnecessary).

### 3. Persistence Stack (Future)
- **Decision**: Plan around PostgreSQL for metadata (meme, user, generation_request) + object storage (S3-compatible) for image binaries.
- **Rationale**: Relational queries (sorting, grouping by date) & scalability; object storage cheaper for images.
- **Alternatives**: MongoDB (simpler schema evolution but weaker relational grouping), local FS (not scalable).

### 4. SSE Event Schema
- **Decision**: EventSource endpoint `/api/generation/stream?id=<requestId>`. Events:
  - `progress`: `{requestId, index, status: 'pending'|'started'}`
  - `image`: `{requestId, index, imageUrl, final: boolean}`
  - `error`: `{requestId, message}`
  - `complete`: `{requestId, total}`
- **Rationale**: Minimal set covers progressive UI updates and finalization.
- **Alternatives**: WebSockets (overkill for one-way stream), polling (higher latency, more requests).

### 5. Style Presets & Models
- **Decision**: Initial style presets array (e.g., `['classic-meme','comic','cyberpunk','anime','minimal']`) – stored client-side until backend schema ready.
- **Rationale**: Fast iteration; later served from API.
- **Alternatives**: Hard-coded per model mapping (less flexible), dynamic fetch (adds early complexity).

### 6. Test Runner Selection
- **Decision**: Vitest + React Testing Library for unit/interaction; future Playwright for e2e.
- **Rationale**: Fast, TS-native, good watch mode.
- **Alternatives**: Jest (heavier), Cypress (e2e only), Playwright-only (slower cycle for unit tests).

### 7. File Size Limits
- **Decision**: Avatar ≤1MB (JPEG/PNG/WebP), Source image (image-to-image) ≤2MB (JPEG/PNG/WebP). Enforce MIME + size pre-upload client-side.
- **Rationale**: Controls bandwidth & generation latency.
- **Alternatives**: Higher limits (slower), only server-side validation (delayed feedback).

### 8. Accessibility Testing Automation
- **Decision**: Integrate axe-core via @testing-library/jest-dom (Vitest adapters) in interaction tests; later add Lighthouse CI GitHub workflow.
- **Rationale**: Immediate dev feedback + metrics stage.
- **Alternatives**: Manual review only (risk leaks), Playwright axe plugin only (slower feedback).

### 9. SEO Structured Data
- **Decision**: Add JSON-LD `ImageObject` for meme detail (when detail pages appear) and generic site `WebSite` schema on root.
- **Rationale**: Prepares for future discoverability with minimal overhead.
- **Alternatives**: Delay structured data (miss early indexing advantages).

## Open Follow-ups (Tracked for Phase Tasks)
- Implement token storage & refresh middleware (fetch wrapper) with retry once then redirect.
- Add bundle analyzer & capture initial size baseline.
- Draft tokens.ts (color, spacing, typography scale) before expanding UI.
- Keep `src/shared/api/api-schema.d.ts` as the canonical contract for auth and generation endpoints.

## Resolved Unknowns Summary
All enumerated unknowns have concrete decisions; remaining work is execution (no blockers for Phase 1).
