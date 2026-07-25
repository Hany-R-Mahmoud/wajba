---
id: 033
title: "Meal Plan and Grocery Organizer"
brand: "MealPlanPilot"
category: "Home & Lifestyle"
platform: "web"
difficulty: "medium"
capabilities: "web, medium"
---

# Build `MealPlanPilot` — Meal Plan and Grocery Organizer

You are the product manager, UX designer, software architect, full-stack engineer, database engineer, QA engineer, accessibility reviewer, and technical writer for this project.

Build the application end to end. Produce real, runnable functionality rather than a visual prototype. Do not begin by asking broad preference questions. Read the complete specification, choose sensible reversible defaults, and ask one concise question only when a genuinely blocking decision cannot safely be inferred.

## 1. Product brief

**Product name:** `MealPlanPilot`  
**Product type:** web application  
**Difficulty:** medium  
**Category:** Home & Lifestyle

**One-sentence concept:** Plan meals, reuse recipes, create grocery lists, and track pantry availability.

**Primary users:** households and meal planners.

**Primary success outcome:** A new user can complete the product's central workflow, save the result, reopen it, modify it, and understand what happened without developer assistance.

### Product principles

- Make the first useful action obvious.
- Prefer a focused, practical MVP over a crowded feature set.
- Use plain language, accessible forms, consistent navigation, and responsive layouts.
- Never hide incomplete features behind convincing buttons or fake success messages.
- Use realistic seed data so every important screen can be evaluated immediately.
- Preserve user ownership and portability of source code, database schema, files, and exports.
- Do not require deployment or publishing.

## 2. Clarification protocol

Before implementation:

1. Summarize the product, primary user, main workflow, chosen stack, and the assumptions you will use.
2. Inspect the builder environment for frontend, backend, database, authentication, file storage, local execution, and testing capabilities.
3. Use sensible defaults for colors, spacing, component libraries, naming, and other reversible choices.
4. Ask a question only when the answer materially changes an irreversible architecture decision, requires credentials, or blocks a core feature.
5. Ask no more than one blocking question at a time. Offer 2–4 concrete choices and recommend one.
6. Do not ask about hosting or deployment because deployment is outside scope.
7. If Supabase credentials are not available, continue with the local PostgreSQL fallback rather than blocking.
8. Record any assumptions in the README and proceed.

## 3. Required scope

Build a complete multi-screen product with a maintainable data model, authentication when useful, robust CRUD flows, search or filtering, realistic empty/loading/error states, and meaningful automated tests. Implement 6–10 primary screens or views. Include import/export, attachments, offline support, or role-based permissions only where listed in the requirements.

### Core features

1. **Recipe library** — implement the complete create, view, edit, validation, success, empty, and failure behavior.
2. **Weekly meal calendar** — implement the complete create, view, edit, validation, success, empty, and failure behavior.
3. **Serving scaling** — implement the complete create, view, edit, validation, success, empty, and failure behavior.
4. **Ingredient aggregation** — implement the complete create, view, edit, validation, success, empty, and failure behavior.
5. **Grocery checklist** — implement the complete create, view, edit, validation, success, empty, and failure behavior.
6. **Pantry matching** — implement the complete create, view, edit, validation, success, empty, and failure behavior.
7. **Dietary tags** — implement the complete create, view, edit, validation, success, empty, and failure behavior.
8. **Print view** — implement the complete create, view, edit, validation, success, empty, and failure behavior.

For every feature, implement:

- clear entry points and navigation;
- required inputs and validation;
- permission checks where applicable;
- loading, success, empty, offline, and error states;
- duplicate-submission protection;
- helpful confirmation and undo behavior where appropriate;
- persistence and retrieval of real data;
- acceptance tests for the main success and failure paths.

### Explicit non-goals

- Paid third-party services
- Payment processing
- Mandatory email or SMS delivery
- Builder-specific hosting
- Fake backend responses presented as completed functionality
- Unrelated social feeds, gamification, or enterprise administration
- High-risk medical, legal, financial, identity-verification, or regulated decisions


## Product-specific constraints

- Informational dietary tags only.
- Use only free, open-source, local, or user-owned infrastructure.
- Do not require a paid API, premium data source, payment gateway, proprietary email/SMS provider, or builder-specific hosting.
- Do not deploy the product. The required outcome is a complete project that runs and can be verified locally.


## 4. Recommended technology

Next.js with TypeScript, Tailwind CSS, and an accessible component system such as shadcn/ui. Use server actions or route handlers for backend operations. Prefer a user-owned Supabase project for PostgreSQL, authentication, storage, and realtime only when those capabilities are actually needed. When Supabase credentials are unavailable, use local PostgreSQL through Docker with portable SQL migrations and local file storage.

Equivalent alternatives are allowed only when they are stable, free to run, portable, and clearly justified.

### Portability requirements

- Keep business logic independent from proprietary builder SDKs.
- Store configuration in environment variables and provide `.env.example` without real secrets.
- Generate portable SQL migrations and a reversible seed script for every database-backed feature.
- Prefer standard PostgreSQL data types and constraints.
- Keep storage access behind a small service layer so Supabase Storage can be replaced with local storage or another S3-compatible service.
- Provide import/export for user-owned content when relevant.
- Include clear local setup, reset, migration, seed, test, and run commands.
- Do not claim portability unless the project runs outside the builder preview.

## 5. Users, roles, and permissions

- **Primary user**: define exactly what this role can view, create, edit, delete, export, or administer.

Apply authorization on the server or database layer, not only by hiding interface controls. A user must never gain access to another user's private records by changing a URL, client state, or request payload.

## 6. Main user journeys

Implement and test these journeys:

1. **First-use journey:** launch the app, understand the value, complete any minimal setup, and reach a useful populated state.
2. **Primary creation journey:** create the main record, validate it, save it, and see it reflected in the appropriate list, dashboard, calendar, timeline, map, or report.
3. **Review and update journey:** find an existing record, inspect its history, edit it, and verify the changes persist.
4. **Recovery journey:** handle invalid input, interruption, duplicate submission, missing data, offline mode, or a failed backend request without data loss.
5. **Data ownership journey:** export or back up the user's data in a documented portable format.
6. **Collaboration journey:** when the product has multiple roles, invite or add a fictional member, apply permissions, and verify access boundaries.

## 7. Screen and navigation requirements

Create a screen inventory and navigation map before coding. At minimum include:

- Home or dashboard
- Primary recipe library view
- Create/edit Household flow
- Dedicated visual planning or insight screen
- Settings, data export/backup, and privacy controls
- Helpful empty, loading, offline, validation, and error states

Every screen must define its purpose, target role, main action, secondary actions, displayed data, responsive behavior, keyboard behavior, and error handling.

## 8. UX and visual direction

Create a polished but restrained identity for `MealPlanPilot`.

- Use a modern, calm, utility-focused visual style.
- Choose one accessible primary accent and a neutral scale. Document the design tokens.
- Use a consistent spacing system, typography scale, border radius, icon family, and component states.
- Provide light and dark appearance when it can be implemented cleanly; otherwise prioritize one excellent accessible theme.
- Meet WCAG 2.2 AA for contrast, focus visibility, labels, keyboard navigation, touch targets, and semantic structure.
- Avoid excessive animation. Respect reduced-motion preferences.
- Make mobile layouts thumb-friendly and web layouts efficient at common laptop widths.
- Use clear content hierarchy instead of decorative dashboards.
- Include helpful onboarding copy, empty-state guidance, confirmations, and recovery messages.
- Never use lorem ipsum.

## 9. Data model

Design a normalized schema around these required entities:

- `User`: define its purpose, fields, validation, ownership, relationships, indexes, timestamps, and deletion/archive behavior.
- `Household`: define its purpose, fields, validation, ownership, relationships, indexes, timestamps, and deletion/archive behavior.
- `Recipe`: define its purpose, fields, validation, ownership, relationships, indexes, timestamps, and deletion/archive behavior.
- `Ingredient`: define its purpose, fields, validation, ownership, relationships, indexes, timestamps, and deletion/archive behavior.
- `MealPlan`: define its purpose, fields, validation, ownership, relationships, indexes, timestamps, and deletion/archive behavior.
- `MealSlot`: define its purpose, fields, validation, ownership, relationships, indexes, timestamps, and deletion/archive behavior.
- `GroceryItem`: define its purpose, fields, validation, ownership, relationships, indexes, timestamps, and deletion/archive behavior.
- `PantryReference`: define its purpose, fields, validation, ownership, relationships, indexes, timestamps, and deletion/archive behavior.

Also include:

- stable IDs;
- created and updated timestamps;
- ownership or workspace scope;
- soft deletion or archive rules where useful;
- uniqueness constraints;
- foreign-key behavior;
- indexes for common searches and ordering;
- optimistic-concurrency protection for records that may be edited from multiple devices;
- an audit or status-history table when state changes matter.

Provide an entity-relationship diagram in Mermaid and document why each relationship exists.

## 10. Backend, authentication, and storage

Use authentication only when the requirements need multiple users, synchronization, private cloud records, or role permissions. Do not force registration for a device-only small app.

When authentication is used:

- support email/password or magic-link capability available through user-owned Supabase;
- provide a local development user flow when Supabase is unavailable;
- implement sign-in, sign-out, session recovery, and account deletion;
- enforce row ownership and role permissions with Row Level Security or equivalent server authorization;
- include tests proving that users cannot access each other's private records.

For file or image features:

- validate file type and size;
- generate safe unique names;
- prevent path traversal;
- show upload progress and recoverable errors;
- store metadata separately from binary content;
- provide local storage fallback;
- remove or orphan files safely when records are deleted.

## 11. Offline, synchronization, and resilience

When offline behavior is relevant:

- maintain a clear local source of truth;
- show online, offline, syncing, synced, and failed states;
- queue writes safely;
- make queued operations idempotent;
- define conflict-resolution rules;
- never silently overwrite newer data;
- allow retry and manual conflict review for important records.

For all networked versions:

- use timeouts and meaningful errors;
- handle expired sessions;
- prevent duplicate creates;
- validate on both client and server;
- log technical details safely without exposing secrets or private content.

## 12. Search, sorting, and data volume

Implement the search, filters, and ordering implied by the feature list.

- Debounce interactive searches.
- Preserve filter state during navigation where useful.
- Provide clear zero-result states.
- Use pagination or virtualization when lists can grow.
- Add database indexes that match common queries.
- Test with enough seed data to expose layout, ordering, and performance issues.

## 13. Seed data

- Create at least 3 realistic sample user profiles using fictional names such as Maya Hassan, Omar Adel, and Lina Brooks when accounts are relevant.
- Create at least 12 realistic records across the primary entities: User, Household, Recipe, Ingredient, MealPlan.
- Include examples for normal, empty, overdue or inactive, completed, and edge-case states where those states apply.
- Use believable dates, labels, notes, and attachments represented by safe local sample files or placeholders generated inside the project.

Seed data must be clearly marked as fictional and removable with a reset command.

## 14. Security and privacy

- Never place secrets in source code, browser bundles, screenshots, logs, or seed files.
- Sanitize and validate all user input.
- Protect against injection, cross-site scripting, insecure direct-object references, path traversal, and unsafe file uploads.
- Use secure session and cookie settings where applicable.
- Minimize stored personal information.
- Provide deletion and export flows for user-owned data.
- Do not collect analytics beyond a simple local product-event log unless the user explicitly enables it.
- Document any residual risk that requires human review.

## 15. Testing and verification

Create and run:

- unit tests for core calculations, validation, state transitions, and formatting;
- integration tests for persistence, authorization, migrations, and file operations;
- end-to-end tests for the first-use, creation, update, recovery, and export journeys;
- accessibility checks for primary screens;
- responsive tests for representative mobile, tablet, and desktop sizes where the platform applies.

Do not mark the project complete while critical tests fail. If the environment cannot execute a test category, provide the test files and clearly state the limitation.

## 16. Required documentation

Create a complete `README.md` containing:

- product summary and screenshots or screen descriptions;
- chosen architecture and tradeoffs;
- folder structure;
- prerequisites;
- local installation and run instructions;
- Supabase connection instructions;
- local PostgreSQL fallback instructions;
- environment-variable reference;
- database migration, seed, reset, and backup commands;
- test commands;
- data export and import formats;
- accessibility notes;
- known limitations;
- decisions and assumptions;
- exact manual steps that remain, if any.

Also provide:

- `.env.example`;
- SQL migrations;
- seed script;
- API or server-function documentation;
- role and permission matrix;
- Mermaid ER diagram;
- concise changelog of implemented work.

## 17. Implementation workflow

Work in this order:

1. Requirement summary and assumptions
2. Screen inventory and navigation map
3. Architecture and data model
4. Project setup and design tokens
5. Database migrations and seed data
6. Authentication and permissions when required
7. Primary user journey
8. Secondary workflows and edge states
9. Import, export, offline, media, or local-AI capabilities specified for this product
10. Automated tests and accessibility review
11. Documentation and final verification

At the end of each phase, state what was implemented, what was tested, and any limitation. Do not repeatedly request confirmation for reversible decisions.

## 18. Definition of done

The project is complete only when:

- the main user journey works end to end with persisted real data;
- all listed core features are implemented or an unavoidable limitation is explicitly documented;
- no required control is a dead button or fake interaction;
- the app is responsive and accessible for its target platform;
- permissions are enforced beyond the client UI;
- local run instructions work;
- migrations and seed data work from a clean state;
- critical tests pass;
- error, empty, loading, and offline states are usable;
- user data can be exported or backed up when relevant;
- the project does not depend on paid services or builder hosting.

### Short completion checklist

- [ ] Complete primary workflow
- [ ] Real persistence
- [ ] Responsive and accessible UI
- [ ] Validation and error recovery
- [ ] Portable database/schema
- [ ] Tests for critical paths
- [ ] Local setup documentation
- [ ] No paid services or hidden deployment dependency

## 19. Optional customization

The prompt is immediately usable as written. Before building, the user may optionally change only these values:

- product name `MealPlanPilot`;
- primary accent and visual tone;
- default language;
- whether cloud synchronization is enabled;
- maximum attachment size;
- data-retention period.

Do not require these customizations to begin.

## Start now

Begin by outputting:

1. your concise understanding of `MealPlanPilot`;
2. the assumptions you will use;
3. the selected stack and fallback plan;
4. the screen inventory;
5. the initial data model;
6. any single genuinely blocking question.

If there is no genuine blocker, state that clearly and proceed with implementation.
