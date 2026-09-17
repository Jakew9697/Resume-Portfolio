# Complete project previews and Move V

Deployed 2026-09-17 to https://jakeworsham.syncgr.com/.

## Result

- All seven Works previews preserve each screenshot's natural aspect ratio. Hover changes opacity without enlarging or cropping the image.
- Full-screen project views show complete screenshots rather than a second, cropped copy. Home and About project images use `contain`; the Home mosaic stays within the screen.
- Move V appears in Works, the Home selection, and `/works/move-v/`. Its live link opens https://move-v.app/.
- Move V has four real captures: desktop 1440×1000, TV 1920×1080, tablet 1024×768, phone 390×844.

## Move V capture provenance

Reviewed `D:/p/bp-streaming`, including the web, Expo mobile, React Native TV, and webOS / Tizen applications. No tracked file in that repository changed.

The older `bp-streaming.syncgr.com` hostname currently serves a frontend that calls the **production** API at `vod.move-v.app`. The current dev CI configuration no longer deploys a separate web frontend. Its legacy documentation still labels that hostname as dev.

Ran the existing web source at `http://localhost:3100` with `NEXT_PUBLIC_VOD_API_URL=https://bp-vod.syncgr.com`. Signed in through the UI using the existing SecureString credentials `/sync/qa/bp-streaming/email` and `/sync/qa/bp-streaming/password`, fetched from SSM at runtime. Verified an authenticated session and populated catalog requests to the dev API.

Built the existing webOS / Tizen source into an ignored capture directory and served it at `http://localhost:4173`, an allowed dev API origin. Used the normal TV pairing flow through the authenticated dev web application, selected the existing QA profile, and captured its populated TV interface. No credentials or tokens were written to source or capture artifacts.

Phone and tablet captures show the responsive web application. The TV capture is the actual TV interface rendered in a browser. These are not native-device or app-store acceptance tests.

A separate local dev web playback attempt for Big Buck Bunny received HTTP 200 from playback authorization but displayed “We lost the video stream” when loading the HLS manifest. Browser resource timing reported status 0 for the manifest. Playback in this localhost setup remains unverified; neither a root cause nor a production playback failure was established. No Move V source, credentials, or infrastructure were changed to work around it.

## Validation

`npm run build` passed, including TypeScript and all 22 exported pages. `git diff --check` passed. Modified source files remain under 600 lines.

Headed browser checks against the deployed portfolio:

| Page | Desktop 1440×1000 | Phone 390×844 |
|---|---:|---:|
| Works | 49/49 | 47/47 |
| Home | 16/16 | 9/9 |
| About | 13/13 | 10/10 |

144/144 checks passed. These cover every gallery entry, complete loaded screenshots, native project links, full-screen details, next/back navigation, titles, overflow, menu operation, and the page-specific scroll flows. All four Move V images were decoded in its project view. No portfolio browser runtime errors were reported. Existing isolated-demo APIs were unchanged and not rerun.

Evidence: `evidence/uncropped-live-{works,home,about}-{desktop,mobile}.json`. Local visual screenshots are under `evidence/`; the four published source captures are under `public/projects/`.

## Interface feel review

| Principle | Before | After |
|---|---|---|
| Image framing | Portrait frames and `cover` removed application edges | Natural screenshot proportions and `contain` preserve every edge |
| Hover motion | Image zoom clipped screenshot content | Explicit opacity transition; reduced-motion override retained |
| Preview targets | Desktop live link minimum height 24px | Minimum height 40px |
| Layout | Oversized decorative mosaic could clip previews | Six-image mosaic fits within the page, including mobile rotation |

Existing balanced headings, pretty body wrapping, font smoothing, tabular counters, visible keyboard focus, button press feedback, and reduced-motion support remain in place. No card framing, tinted screenshot outline, or `transition: all` was introduced.

## Deployment

Ran `scripts/deploy.ps1 -FrontendOnly -Apply`. Updated only `s3://sync-static-sites/tenants/jakeworsham/` and invalidated `/tenants/jakeworsham/*` on distribution `E1EMVV1XZZTJAS`. Invalidation `IBVCTCUPHX6539WS7XG1ICLRRV` completed before live acceptance. No Terraform or backend changes were required.
