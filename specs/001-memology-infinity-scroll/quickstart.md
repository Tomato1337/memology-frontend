# Quickstart: MemoLogy Feature

## Goal
Enable browsing, meme generation, and user personalization with robust UX, performance and quality gates.

## Prerequisites
- Node & pnpm installed
- Environment vars (future): API_BASE_URL, FEATURE_FLAGS (style presets), SENTRY_DSN (optional)

## Steps
1. Install deps: `pnpm install`
2. Start dev server: `pnpm dev`
3. Open http://localhost:3000
4. Browse public feed (infinite scroll, search param `?search=`)
5. Register user (auth page) then login
6. Generate memes on /generate (observe streaming right panel)
7. View personal gallery /gallery (date grouping)
8. Update profile /profile and toggle theme

## Testing
- Unit / interaction: `pnpm test`
- (Later) Lighthouse CI: `pnpm lighthouse` (placeholder)
- Coverage threshold: ≥85% statements/lines

## Architecture Notes
- Hybrid SSR+CSR strategy: first page render uses search param server component fetch; subsequent pages via TanStack Query.
- Token refresh interceptor wraps fetch; on 401 refresh failure → redirect /auth.
- Virtualization & masonry optimize large image lists.
- SSE streaming reduces latency for generation feedback.

## Troubleshooting
- Infinite scroll stalls: check network pagination cursor & intersection observer rootMargin.
- SSR search mismatch: ensure server + client share deterministic query param normalization.
- Theme flash: verify class injection occurs before paint (e.g., next-themes or custom script).

## Next Steps
- Integrate real backend (replace MSW) using the canonical types in `src/shared/api/api-schema.d.ts`.
- Add structured data & meta tags per page.
- Add Storybook (or alternative) for design system docs.
