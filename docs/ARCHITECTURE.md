# Architecture Overview

## Project Overview

This project is a web-based SSH terminal built with Next.js, TypeScript, and Tailwind CSS. It uses xterm.js for the terminal interface and a custom WebSocket server to bridge the connection to an SSH server. The application allows users to connect to an SSH server from their web browser.

The frontend is a Next.js application that provides the terminal UI. The backend is a simple Node.js server that uses the `ssh2` library to create an SSH client and `ws` to create a WebSocket server. The frontend and backend communicate over WebSockets.

## High-Level Flow
Users land on the credential form at `src/app/page.tsx`. When the form is submitted the browser opens a WebSocket to the local bridge (`ws://<host>:3001` by default), requests an SSH credential test, and on success stores the session config in `sessionStorage` before redirecting to `/terminal`. The terminal page rehydrates the config, boots an `xterm.js` instance, and reuses the same WebSocket connection to proxy terminal input/output between the browser and the SSH host.

## Next.js Client
The UI runs on Next.js 15 with the App Router. Client components live under `src/app`, and shared primitives sit in `src/components`. `src/app/terminal/page.tsx` dynamically loads `xterm` and the `FitAddon` to render the interactive console, handles responsive resizing with `ResizeObserver`, and forwards keyboard input and resize events back to the bridge. Credentials and transient status messages persist in `sessionStorage` so a hard refresh resets the session safely. Environment variables prefixed with `NEXT_PUBLIC_WS_*` let deployments point the client at a remote bridge without code changes.

## WebSocket Bridge Server
`server/index.js` hosts an HTTP server with an attached `ws` WebSocketServer. On `connect` messages it instantiates an `ssh2.Client`, negotiates an interactive `shell`, and relays byte streams to the browser. `test-connection` messages trigger a short-lived SSH probe that returns friendly error codes for common failure modes. The bridge maintains heartbeats (`ping`) and configurable keep-alives (`SSH_KEEPALIVE_*`) to reduce dropped sessions and times out stalled handshakes after 10 seconds. Environment variables `WS_PORT`, `WS_HEARTBEAT_INTERVAL_MS`, and `DEBUG` control local behavior.

## Data Contracts & Message Types
Browser and server exchange JSON envelopes. Core message types include `connect`, `test-connection`, `input`, and `resize` from the client, and `ready`, `data`, `close`, `error`, `test-progress`, and `test-success` from the server. Payloads carry terminal geometry (`cols`, `rows`) and raw UTF-8 data streams. Persisted SSH configuration is limited to the fields expected by `ssh2.Client` and never written to disk.

## Operational Considerations
The Next.js app and bridge run side-by-side via `pnpm dev`, `pnpm start`, or platform-specific process managers. Because SSH credentials pass through the browser, production deployments should secure the WebSocket endpoint with TLS (`wss://`) and restrict access to trusted networks, disable verbose logging, and rotate any long-lived private keys out-of-band.
