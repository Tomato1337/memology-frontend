# Data Model: MemoLogy Feature

## Entities

### Meme
Fields:
- id (UUID)
- authorId (UUID, FK User)
- createdAt (timestamp)
- prompt (text)
- style (enum StylePreset)
- sourceType (enum 'text' | 'image')
- sourceImageRef (string | null)
- width (int)
- height (int)
- popularityMetric (int) // likes count (initial definition)
- tags (string[])

Validation:
- width,height within preset list sizes
- prompt length 3..500 chars
- style in presets
- sourceImageRef required iff sourceType='image'

### GenerationRequest
Fields:
- id (UUID)
- userId (UUID)
- prompt (text)
- mode (enum 'text'|'image2image')
- model (string)
- style (enum StylePreset)
- sizePreset (enum e.g. 'square','portrait','landscape')
- quantity (int 1..4)
- status (enum 'pending'|'started'|'success'|'error'|'rate-limited')
- createdAt (timestamp)

### User
Fields:
- id (UUID)
- email (string)
- passwordHash (string) // storage detail outside FE
- displayName (string 2..40)
- avatarUrl (string | null)
- themePreference (enum 'light'|'dark'|'system')
- dailyGenerationCount (int)
- lastGenerationCounterAt (date)

### StylePreset
Fields:
- id (string)
- name (string)
- description (string)
- promptAugmentation (string)

## Relationships
- User 1..* Meme
- User 1..* GenerationRequest
- StylePreset 1..* Meme

## Derived / Computed
- popularityMetric could later evolve to weighted score; initial is likes.
- dailyGenerationCount resets when date != lastGenerationCounterAt.

## State Transitions (GenerationRequest)
- pending -> started -> success | error
- pending/started -> rate-limited (if quota exceeded mid-flight)

## Constraints & Indexing (Conceptual)
- Index Meme(authorId, createdAt DESC)
- Index Meme(createdAt DESC)
- Index GenerationRequest(userId, createdAt DESC)
- Unique User.email

## Open Questions
- Weighted popularity formula (future) — currently simple like count.
- Storage of tags: normalized table vs array (future backend choice).
