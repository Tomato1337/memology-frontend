﻿---
description: Feature-Sliced Design (FSD) architecture rules for building scalable frontend applications with business-oriented structure and strict layer hierarchy
globs: src/**/*
---

# Feature-Sliced Design (FSD) Architecture Rules

## Core Principles

- Organize code by business features, not technical concerns
- All dependencies between modules must be explicit and unidirectional
- Each slice should be as independent as possible
- Each module exposes only necessary functionality through its public API (index file)
- Follow strict layer hierarchy with unidirectional imports

## Project Structure

- Use 6-layer architecture: app → pages → widgets → features → entities → shared
- Each layer can only import from layers below it
- No cross-imports between slices on the same layer
- Public API through index.ts files only
- Colocate tests with implementation

## Layer Import Rules (Critical)

- **app** → can import from: pages, widgets, features, entities, shared
- **pages** → can import from: widgets, features, entities, shared
- **widgets** → can import from: features, entities, shared
- **features** → can import from: entities, shared
- **entities** → can import from: shared
- **shared** → cannot import from any layer

## Layer Responsibilities

### app/

- Application initialization and bootstrapping only
- Global providers setup (Router, Store, Theme, i18n)
- Global styles and CSS reset
- Entry point configuration
- NO business logic

### pages/

- Route/page components
- Page-level data fetching
- Layout composition from widgets and features
- Page-specific business logic
- SEO and metadata management
- Handle complex multi-step flows within a page

### widgets/

- Complex composite UI blocks
- Combine multiple features and entities
- Widget-specific state management
- Reusable across different pages

### features/

- User interactions and actions
- Business operations and workflows
- Feature-specific state and logic

### entities/

- Business entities representation
- Entity data models and types
- Entity-specific UI components
- CRUD operations for entities

### shared/

- Reusable utilities without business logic
- UI kit and design system components
- API client configuration
- Constants and configurations
- Type definitions and interfaces

## Segment Structure

- Each slice contains: ui/, model/, lib/, api/, config/, index.ts
- ui/ → UI components and styles
- model/ → State management (stores, events, effects)
- lib/ → Helper functions specific to slice
- api/ → API requests and data fetching
- config/ → Slice configuration
- index.ts → Public API exports only

## Naming Conventions

- Use **kebab-case** for folders and files
- Use **PascalCase** for components
- Use **camelCase** for utilities
- Use **UPPER_SNAKE_CASE** for constants
- Always use absolute imports with aliases (@/shared, @/features, etc.)

## Public API Rules

- Export only what's needed from index.ts
- Never export internal implementations
- Keep internal helpers and utilities private
- Use barrel exports for cleaner imports

## Anti-Patterns to Avoid

- Never import across slices on same layer
- Never import from non-public API (bypass index.ts)
- Never place business logic in shared layer
- Never create circular dependencies
- Never handle complex orchestration outside of pages
- Never violate layer hierarchy

## State Management

- Each layer can have its own stores
- Stores should be colocated with their features
- Use consistent state management patterns
- Handle cross-slice communication through events

## Testing

- Colocate tests with implementation
- Use .test.ts(x) or .spec.ts(x) suffix
- Test public API, not internal implementation
- Mock dependencies from lower layers

## Path Aliases Configuration

- Set up tsconfig paths for clean imports
- Use @/app, @/pages, @/widgets, @/features, @/entities, @/shared
- Configure bundler to resolve aliases
- Set up ESLint import order rules

## Migration Strategy

- Start with shared layer extraction
- Identify and extract business entities
- Extract features (user actions)
- Compose widgets from features/entities
- Refactor pages to use widgets/features
- Setup app layer with providers

## Tools and Resources

- Use Steiger linter for FSD validation
- Install @feature-sliced/eslint-config
- Reference https://feature-sliced.design
- Check examples at https://github.com/feature-sliced/examples
