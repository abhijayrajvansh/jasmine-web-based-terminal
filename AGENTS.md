# Repository Guidelines

## Project Structure & Module Organization
The Next.js client lives under `src/app`, with route segments in `terminal/`. Shared UI pieces are in `src/components`, while TypeScript helpers and data contracts sit in `src/types`. Assets served directly are stored in `public/`, and developer notes belong in `docs/`. The Node-based SSH bridge is implemented in `server/index.js`; keep server-side utilities colocated in that directory. Tailwind and ESLint configs reside at the repo root.

## Build, Test, and Development Commands
- `pnpm install` ensures dependencies match `pnpm-lock.yaml`.
- `pnpm dev` runs Next.js and the WebSocket bridge together for local iteration.
- `pnpm build` compiles the Next app with Turbopack; run before shipping config changes.
- `pnpm start` serves the production build alongside the SSH bridge.
- `pnpm lint` applies the shared ESLint ruleset.
- `pnpm exec tsc --noEmit` performs the required project-wide type check.

## Coding Style & Naming Conventions
Use TypeScript and modern React patterns (server/actions where possible). Favor functional, stateless components and keep side effects in hooks. Follow 2-space indentation, PascalCase for components, camelCase for functions and variables, and UPPER_SNAKE_CASE for runtime constants. JSX should remain concise; extract helpers into `src/components`. Tailwind utility classes belong in markup—avoid custom CSS unless necessary.

## Testing Guidelines
There is no automated test harness yet; include a manual test plan in each PR that covers SSH connection flows, error states, and terminal resizing. When adding utility logic, prefer writing it in a testable function under `src/types` or a new `__tests__` directory to ease future Jest adoption. Always run `pnpm exec tsc --noEmit` and `pnpm lint` before requesting review.

## Commit & PR Workflow
Commits should follow `docs:`, `update:`, or `fix:` prefixes and capture a single concern. Push the branch after every successful commit. Pull requests must explain motivation, implementation notes, manual verification, and any screenshots showing UI changes. Link related issues and flag environment variables that need updates.

## Configuration & Security Tips
Never hard-code credentials; rely on runtime secrets passed to the SSH bridge. The server respects `WS_PORT`, `WS_HEARTBEAT_INTERVAL_MS`, and `SSH_KEEPALIVE_*` environment variables—document changes to them. Use `DEBUG=1` locally to trace WebSocket traffic, but disable it in production. Scrub logs of sensitive hostnames before sharing.
