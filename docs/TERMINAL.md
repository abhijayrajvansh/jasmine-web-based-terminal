# Terminal Client Architecture

This document explains how the browser-side terminal experience is composed so we can rebuild the client for other platforms (e.g. React Native) while reusing the existing WebSocket bridge.

## Responsibilities at a Glance
- Collect SSH credentials, validate them against the bridge, and persist the session config locally only.
- Establish a resilient WebSocket session that streams input/output to the SSH bridge.
- Render an interactive terminal surface, expose supplemental controls (assistive keys, disconnect, reload guard), and surface status.

## Screen Flow
1. **Home / Credentials (`src/app/page.tsx`)**
   - Presents the credential form and auth-method selector.
   - On submit builds the WebSocket URL from `NEXT_PUBLIC_WS_*` envs and launches a temporary socket.
   - Sends `test-connection` to the bridge; shows progress updates (`test-progress`) and friendly errors (`test-error`).
   - On `test-success`, stores the raw SSH config in `sessionStorage` under `sshConfig` then routes to `/terminal`.
2. **Terminal (`src/app/terminal/page.tsx`)**
   - Rehydrates the config from `sessionStorage`; redirects home if missing.
   - Dynamically imports `xterm` + `FitAddon`, mounts them into the page, and fits to the container/viewport via `ResizeObserver` + window `resize`.
   - Opens a long-lived WebSocket, sends `connect` with the SSH config and terminal geometry, then streams `input`/`resize` events.
   - Responds to bridge messages (`ready`, `data`, `error`, `close`) to update UI, drain buffers into xterm, and handle teardown.

## Component Breakdown
- **Credential Form (`src/app/page.tsx`)**
  - Local `useState` handles form fields and connection status.
  - Keeps UX light: optimistic progress copy, dismissible errors surfaced from the bridge.
  - Persists `sshError` in `sessionStorage` to show a helpful banner on return navigation.
- **Terminal Shell (`src/app/terminal/page.tsx`)**
  - Owns the WebSocket lifecycle through `wsRef` and guards reentrancy with `readyRef`.
  - Hooks that stream term events (`term.onData`, `term.onResize`) are mirrored by helper closures (`sendSeq`, `sendTab`).
  - Supplies top and bottom status bars only through Tailwind utility classes; layout is a flex column with a fill container for the terminal canvas.
- **Assistive Touch (`src/components/AssistiveTouch.tsx`)**
  - Floating UI for touch/mobile users; draggable FAB backed by `localStorage`.
  - Emits pre-canned escape sequences (Tab, arrow keys, Ctrl+C, etc.) over the same `sendSeq` channel.
  - Uses Radix Dialog for the key grid.
- **Confirm Reload Dialog (`src/components/ConfirmReloadDialog.tsx`)**
  - Reusable Radix-powered confirm modal that locks scroll while open.
  - Used twice on the terminal screen: once for reload protection, once for manual disconnect.

## State & Persistence Contracts
- **Session persistence**: SSH config lives only in `sessionStorage` (`sshConfig`) and errors in `sshError`. Clearing either ends the session.
- **Focus management**: Terminal attempts to retain focus after helper interactions by calling `focusXtermSoon`.
- **Unload safety**: Window `beforeunload` is vetoed unless the user confirms via the dialog. Keyboard shortcuts for reload/close are intercepted.

## WebSocket Contract (Client Perspective)
- **Outbound messages**
  - `test-connection`: `{ type: "test-connection", config }`
  - `connect`: `{ type: "connect", config, cols, rows }`
  - `input`: `{ type: "input", data }`
  - `resize`: `{ type: "resize", cols, rows }`
  - `disconnect`: `{ type: "disconnect" }`
- **Inbound messages**
  - `test-progress`, `test-success`, `test-error`
  - `ready`, `data`, `error`, `close`
  - Optional raw strings (fallback writes directly to xterm)

Keep this contract identical in the React Native client so the existing bridge (`server/index.js`) works unchanged.

## Porting Notes for React Native
- Replace xterm with a native-compatible terminal renderer (e.g. wrap a `react-native-pty` surface or embed an xterm canvas inside a WebView) but preserve the same event interface: `write(data)` for inbound bytes and `onData`-style callback for outbound input.
- Map `sessionStorage` usage to a mobile-safe store (Expo Secure Store, MMKV, etc.) and decide how aggressively to clear credentials after disconnects.
- Recreate the status surfaces (connecting, ready, error) and the assistive key UI; the helper panel can become a modal or action sheet that posts the same escape sequences.
- Leverage `AppState` / lifecycle hooks to emulate `beforeunload` behavior (warn before backgrounding/closing while a session is active).
- Build the WebSocket URL using the same env-style inputs; expose them via runtime config or user input.

With these slices in mind, the React Native terminal can be built as a standalone package that speaks the shared WebSocket protocol while adapting storage, lifecycle, and terminal rendering to mobile primitives.
