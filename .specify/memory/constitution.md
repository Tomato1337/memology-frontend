# AI Memes Frontend Constitution

<!--
Sync Impact Report
Version change: N/A → 1.0.0
Modified principles: (initial adoption)
Added sections: Core Principles, Quality & Performance Benchmarks, Workflow & Quality Gates, Governance
Removed sections: none
Templates requiring updates:
	.specify/templates/plan-template.md ✅
	.specify/templates/spec-template.md ✅
	.specify/templates/tasks-template.md ✅
Deferred TODOs: none
-->

## Core Principles

### 1. Code Quality Is Non‑Negotiable
Every merge MUST leave the codebase equal or better in: readability, cohesion, explicitness.
Rules:
- Enforce strict TypeScript types (no implicit any, no unused disable comments).
- Public component/API surface MUST have minimal JSDoc/TSDoc describing purpose & invariants.
- No dead code (unused exports, commented blocks) at merge time.
- Complexity (cyclomatic > 10 or nested > 3 levels) MUST be refactored or justified in PR.
- Lint & format (ESLint + Prettier) MUST pass – no warnings ignored unless rule‑scoped rationale.
Rationale: High quality reduces defect rate, accelerates onboarding, enables confident iteration.

### 2. Test Discipline & Coverage
Testing provides executable specification — untested behavior is unsupported.
Rules:
- P1 logic (data transforms, API clients, critical UI state) MUST have unit tests.
- Shared UI primitives (design system components) MUST have interaction tests (e.g. RTL) for core states.
- New bugs MUST first receive a failing regression test before fix.
- Coverage thresholds (global): statements ≥ 85%, branches ≥ 80%, lines ≥ 85% (enforced in CI).
- Tests MUST be deterministic (no real network; use MSW/fakes) and < 5s total per PR delta.
Rationale: Predictable velocity and resilience require fast, meaningful, enforced feedback.

### 3. Consistent & Inclusive User Experience
UI behavior and affordances MUST feel uniform and accessible.
Rules:
- All interactive elements: accessible name, focus state, keyboard navigation (no key traps).
- Visual spacing & typography follow the design token scale (see design system foundations file when added).
- Dark mode & responsive (≥320px width) behavior required for any new screen or component.
- Empty, loading, error states MUST be explicitly designed (no blank screens or raw errors).
- No breaking UX pattern divergence without ADR/justification.
Rationale: Consistency reduces cognitive load; accessibility broadens reach and complies with standards.

### 4. Performance & Web Vitals
We optimize for perceivable speed and efficiency first.
Rules:
- Core Web Vitals targets (measured on representative page): LCP ≤ 2.5s (p75), CLS ≤ 0.1, INP ≤ 200ms.
- Above-the-fold bundle for landing page ≤ 150KB gzip; long‑term goal 100KB.
- Images MUST use next/image (or equivalent optimization) and explicit sizes to prevent layout shift.
- Expensive computations & 3rd‑party scripts lazy‑loaded or deferred.
- Each PR adding >10KB gzip to initial JS MUST justify value & consider code splitting.
Rationale: Performance correlates with engagement, retention, and SEO rank.

### 5. SEO & Discoverability
Rules:
- Each routable page MUST set: title, meta description, canonical URL, and Open Graph/Twitter tags where relevant.
- Semantic HTML (no div-only landmarks): use <header>, <main>, <nav>, <footer>, aria labels as needed.
- Structured data (JSON-LD) added for rich content types when introduced (e.g., memes as creativeWork/ImageObject).
- Avoid duplicate content; use canonical & robots directives judiciously.
- 404 & 500 pages MUST provide recovery navigation.
Rationale: Organic discovery is a primary acquisition channel; semantics aid accessibility & ranking.

### 6. Modern Design System as a Product
The design system is a governed dependency, not ad hoc code.
Rules:
- All shared visual/interactive primitives live under `src/app/components/ui/` (or future `design-system/`).
- Components MUST be: themable (tokens, no hard-coded colors), composable (no overreaching side-effects), documented via stories or MDX (TODO: integrate Storybook/alternative).
- Tokens (color, spacing, typography, radius, shadow, z-index) defined centrally – no magic numbers in components.
- Breaking changes to exported component APIs require semver major bump in design system package (once externalized) + migration notes.
- Only one implementation source of truth per component (no forks or local variations) — extend via props or composition.
Rationale: Consistency, speed of iteration, and lower defect surface depend on a single governed system.

## Quality & Performance Benchmarks
This section operationalizes principles into measurable gates.

| Area | Metric | Threshold | Tooling |
|------|--------|-----------|---------|
| Code Quality | ESLint Errors | 0 blocking | ESLint CI step |
| Code Quality | Dead Exports | 0 | TypeScript + unused exports rule |
| Testing | Coverage (Stmts/Lines) | ≥85% | Coverage report in CI |
| Testing | PR Test Runtime | < 60s | CI timer |
| UX | Accessibility score | ≥ 95 (Lighthouse) | Lighthouse CI (TODO) |
| Performance | LCP (p75) | ≤ 2.5s | Web Vitals instrumentation |
| Performance | CLS (p75) | ≤ 0.1 | Web Vitals instrumentation |
| Performance | JS Initial Gzip | ≤ 150KB | Bundle analyzer |
| SEO | Lighthouse SEO score | ≥ 95 | Lighthouse CI |
| Design System | Token Drift | 0 untracked tokens | Token audit script (TODO) |

Violations MUST include: (1) measurable delta, (2) mitigation plan, (3) issue reference, before merge (unless hotfix severity P0).

## Workflow & Quality Gates
Defines how we apply governance during delivery.

1. Spec → Plan must enumerate Constitution Check gating section referencing all failing or at-risk metrics.
2. Pre-implementation: write or update tests for changed contracts (Principle 2) before feature code.
3. Design system additions require token usage review & documentation stub (Principle 6).
4. Performance sensitive changes (new dependency, image format, data fetch) MUST include before/after note in PR.
5. SEO changes validated locally (meta tags, structured data) — attach snippet or Lighthouse diff.
6. Accessibility checks run for new interactive components (keyboard nav, aria roles) before approval.
7. CI is authoritative: failing gate blocks merge; overrides require maintainer approval + follow-up issue.
8. Post-merge monitoring: regressions in Web Vitals or accessibility open auto issue (TODO instrumentation).

## Governance
Scope: This constitution supersedes informal practices. All contributors and automation MUST comply.

Amendments:
- Proposal via PR modifying this file + Sync Impact Report comment.
- Classify change (MAJOR/MINOR/PATCH) with rationale; update version accordingly.
- Obtain approval from ≥1 maintainer + ≥1 peer contributor (two-party minimum).
- For MAJOR: include migration plan & affected templates updates in same PR.

Versioning Policy:
- MAJOR: Removal or redefinition of a principle, or downgrading mandatory thresholds.
- MINOR: New principle, new measurable gate, or materially expanded rule set.
- PATCH: Clarifications, wording, non-normative examples, tooling notes.

Compliance Review:
- Each PR checklist MUST include: Code Quality, Tests Added/Updated, UX/Accessibility, Performance Impact, SEO Meta, Design System impact.
- Quarterly audit (TODO schedule) to re-measure benchmarks and propose adjustments.

Enforcement:
- CI failing gate = must fix or formally justify with linked issue before merge.
- Repeated non-compliance (≥3 occurrences in 30 days) triggers mandatory review of contributor workflow with maintainers.

**Version**: 1.0.0 | **Ratified**: 2025-10-14 | **Last Amended**: 2025-10-14