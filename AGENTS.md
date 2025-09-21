# Repository Guidelines

## Project Overview

This project is a web-based SSH terminal built with Next.js, TypeScript, and Tailwind CSS. It uses xterm.js for the terminal interface and a custom WebSocket server to bridge the connection to an SSH server. The application allows users to connect to an SSH server from their web browser.

The frontend is a Next.js application that provides the terminal UI. The backend is a simple Node.js server that uses the `ssh2` library to create an SSH client and `ws` to create a WebSocket server. The frontend and backend communicate over WebSockets.

## Golden Rules
- Always use `pnpm` for package and script commands.
- Never start the dev server locally (it already runs on 3000).
- Do not run build or lint unless explicitly requested.
- Always type‑check after any code change and fix all errors.

## Always After Changes (Mandatory)
- Type check: run `pnpx tsc --noEmit`; resolve all errors.
- Stage files: `git add <each_changed_file>` (no `-a`).
- Commit: `git commit -m "feat: <6–7 word summary>"` (use correct type: feat/fix/docs/style/refactor/perf/test).
- Push: `git push origin <CURRENT_BRANCH_NAME>` (push to the current branch on origin after every successful agent completion).

## Pull Request Guidelines (On Request Only)
### When asked to raise a pull request:
- Always build the project first using `pnpm run build`.
- Ensure all errors are resolved.
- Create PR from current branch to `dev` branch.
- Use a structured PR description; refer to `.github/pr-template.md` for the template.
- Read the current branch commits and ensure the PR description is short, clear, and concise.

## Git Workflow
### Committing
- Use git CLI only; never use `git commit -a`.
- Stage explicitly: `git add <file>`.
- Message format by type:
  - `feat:` new features
  - `fix:` bug fixes
  - `docs:` documentation
  - `style:` formatting only
  - `refactor:` non‑feature/non‑fix changes
  - `perf:` performance improvements
  - `test:` tests
- Keep summary ~6–7 words.
- After commit: `git push`.

## Coding Style & Naming Conventions
Use TypeScript and modern React patterns (server/actions where possible). Favor functional, stateless components and keep side effects in hooks. Follow 2-space indentation, PascalCase for components, camelCase for functions and variables, and UPPER_SNAKE_CASE for runtime constants. JSX should remain concise; extract helpers into `src/components`. Tailwind utility classes belong in markup—avoid custom CSS unless necessary.

## Configuration & Security Tips
Never hard-code credentials; rely on runtime secrets passed to the SSH bridge. The server respects `WS_PORT`, `WS_HEARTBEAT_INTERVAL_MS`, and `SSH_KEEPALIVE_*` environment variables—document changes to them. Use `DEBUG=1` locally to trace WebSocket traffic, but disable it in production. Scrub logs of sensitive hostnames before sharing.
