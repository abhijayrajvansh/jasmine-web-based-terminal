# Stabilizing SSH Sessions

## Current Behaviour
- Frontend establishes a single WebSocket per session; any `close` event triggers session cleanup and redirects to home.
- Backend immediately shuts down the SSH client (`ssh.end()`) whenever the WebSocket closes, so the SSH stream cannot survive transient network drops.

## Problem
When the browser tab is backgrounded or the device suspends the app, the OS often tears down the WebSocket. Because both client and server treat any close as final, users lose their SSH session even if connectivity returns moments later.

## Proposed Improvements
1. **Session Tokens & Reattachment**
   - Issue a session identifier on initial connect and persist it client-side.
   - Allow reconnecting WebSockets to reattach to the existing SSH client during a grace period instead of ending the shell immediately.

2. **Client Reconnection Strategy**
   - Replace immediate redirect-on-close with a reconnection loop (exponential backoff, status messaging, manual abort option).
   - Keep `Disconnect` button as the explicit teardown path.

3. **Server Grace Periods**
   - Delay `ssh.end()` when the WebSocket drops; retain the shell for a configurable timeout or until the client explicitly sends `disconnect`.
   - Emit heartbeat/timeout events so the client can update UI while waiting to reattach.

4. **Background Keep-Alives**
   - Continue pinging from the server (already in place) and consider light client-originated pings while backgrounded.
   - Surface reconnect failures clearly to the user so they can decide to abandon or retry manually.

## Next Steps
- Design the session persistence schema (in-memory map vs. external store if clustering is needed).
- Prototype client reconnection logic and integrate with the new backend handshake.
- Define and document configuration knobs for grace periods and heartbeat cadence.
