# AGENTS.md
Guidance for autonomous coding agents working in `C:\users\franc\desktop\nqws_web`.

## 1) Rule Files (Cursor/Copilot)
- Checked `.cursor/rules/**`.
- Checked `.cursorrules`.
- Checked `.github/copilot-instructions.md`.
- Result: none of these files currently exist.
- If added later, treat them as highest-priority local instructions.

## 2) Repository Snapshot
- Stack: Next.js 16 App Router + React 19 + TypeScript.
- Linting: ESLint 9 using `eslint-config-next/core-web-vitals` and Next TypeScript rules.
- Styling: `app/globals.css` + component-scoped CSS Modules.
- Telemetry: `@vercel/analytics` included in `app/layout.tsx`.
- Structure:
- `app/` route-level layout/page/loading/error.
- `components/` UI and interactive client components.
- `lib/` fetch/data logic and shared types.

## 3) Package Manager
- Canonical package manager: npm.
- Evidence: root `package-lock.json` and npm scripts in `package.json`.
- `pnpm-lock.yaml` exists, but prefer npm unless user requests pnpm.

## 4) Build / Lint / Test / Run Commands
- Install dependencies:
```bash
npm install
```
- Start dev server:
```bash
npm run dev
```
- Build production bundle:
```bash
npm run build
```
- Start built app:
```bash
npm run start
```
- Lint whole project:
```bash
npm run lint
```
- Type-check project (explicit, no script yet):
```bash
npx tsc --noEmit
```

## 5) Testing Status And Single-Test Guidance
- No test runner is currently configured.
- No `*.test.*`/`*.spec.*` files were found.
- No `jest`, `vitest`, `playwright`, or `cypress` config files were found.
- So there is no true "run one test" command yet.
- Use this full validation sequence for now:
```bash
npm run lint && npx tsc --noEmit && npm run build
```
- For targeted iteration on one file, use ESLint file mode:
```bash
npm run lint -- --file app/page.tsx
```
- If you add tests, also add scripts and document single-test usage in this file immediately.
- Recommended future single-test command patterns:
- Vitest: `npx vitest run path/to/file.test.ts -t "case name"`
- Jest: `npx jest path/to/file.test.ts -t "case name"`

## 6) Code Style Guidelines

### 6.1 TypeScript
- Respect strict mode (`tsconfig.json` has `strict: true`).
- Prefer explicit interfaces/types for props and API payloads.
- Reuse shared domain types from `lib/`.
- Avoid `any`; use unions, generics, or `unknown` with narrowing.
- Use literal unions for finite options (`Language`, `Theme`, etc.).
- Keep exported function return types explicit when useful for clarity.

### 6.2 Imports
- Prefer `@/*` aliases for cross-folder imports.
- Use relative imports for nearby sibling files.
- Keep import groups ordered and readable:
- external/framework packages,
- internal alias imports,
- relative imports,
- styles.
- Use `import type` for type-only imports.
- Remove unused imports before finishing.

### 6.3 React / Next.js Patterns
- Default to Server Components.
- Add `"use client"` only when hooks or browser APIs are required.
- Keep route composition in `app/`; move reusable UI to `components/`.
- Use PascalCase for component names and filenames.
- Name props interfaces `<ComponentName>Props`.
- Keep components small; extract helpers when render logic gets crowded.
- Use `Suspense` fallback patterns for async server rendering where appropriate.

### 6.4 State And Effects
- Keep state minimal and derived when possible.
- Use `useEffect` cleanup for listeners and document/body mutations.
- Keep dependency arrays intentional and complete.
- Access `window`, `document`, and `localStorage` only in client-side execution paths.
- Use mounted guards to avoid hydration mismatches when needed.

### 6.5 Error Handling
- Check `res.ok` and throw informative errors for HTTP failures.
- Validate API payload shape assumptions defensively.
- Re-throw lower-level fetch errors when callers need to decide UX.
- Log at handling boundaries (current pattern: `app/error.tsx`, `lib/api.ts`).
- Show user-safe fallback UI for runtime failures.
- Avoid empty `catch` blocks unless there is a deliberate no-op reason.

### 6.6 Naming And Semantics
- Use intention-revealing identifiers (`isRefreshing`, `setIsSettingsOpen`, etc.).
- Boolean names should read naturally with `is/has/can` prefixes.
- Use uppercase snake case for true constants (`API_URL`).
- Prefer semantic HTML (`main`, `header`, `footer`, `article`, `time`).

### 6.7 Formatting
- Match the surrounding file style; avoid unrelated reformatting.
- Keep semicolons (dominant style in repo).
- Quote and indentation are mixed across files; stay consistent per touched file.
- Break long JSX props across lines for readability.
- Keep edits ASCII unless file already requires non-ASCII characters.

### 6.8 CSS And UI
- Use CSS Modules for component styles.
- Keep shared design tokens and global resets in `app/globals.css`.
- Prefer existing CSS variables before introducing new color/spacing constants.
- Preserve current responsive behavior and mobile layout constraints.
- Prefer class-based styling over large inline style objects unless dynamic behavior requires inline styles.

### 6.9 Accessibility
- Provide `aria-label` for icon-only controls.
- Keep modal `role="dialog"` and `aria-modal` usage.
- Preserve keyboard escape behavior and click-outside close behavior.
- Keep interactive targets discoverable and keyboard-accessible.

## 7) Working Agreement For Agents
- Read neighboring files before editing; mirror local patterns.
- Keep changes focused on requested scope.
- Do not add dependencies unless necessary and justified.
- Do not silently change architecture during small fixes.
- Run `npm run lint` after code edits.
- For larger changes, run:
```bash
npm run lint && npx tsc --noEmit && npm run build
```
- If checks fail, fix root cause instead of bypassing checks.

## 8) Suggested Next Repo Improvements
- Add scripts: `test` and `typecheck`.
- Choose a test runner and document single-test command in Section 5.
- Optionally add Prettier if formatting churn becomes frequent.
- If Cursor/Copilot rules appear later, keep them and this file aligned.
