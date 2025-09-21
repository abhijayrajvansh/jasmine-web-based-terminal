
# Mobile Safari Scroll Behaviour Lock

The app now keeps Safari's URL bar fixed in its expanded state when users swipe on iOS. This behaviour stems from two coordinated layout changes:

## Root Document Locked

- `styles/globals.css`: `body` switched to `overflow-hidden` and the `.wrapper` div assumed responsibility for vertical scrolling via `overflow-y-auto`. Because the root document no longer scrolls, Safari no longer detects page movement needed to collapse its chrome.

## Viewport Height Pinned

- `components/ViewportHeight.tsx`: the helper writes `window.innerHeight` to the `--app-viewport-height` custom property used by `.wrapper`. On iOS this value matches the viewport height when the URL bar is fully visible, so the scroll container height stays frozen even as the browser chrome would normally shrink.

Together, these updates keep the Safari UI locked, preventing the usual URL bar minimisation while scrolling up or down.
