# Independent portfolio carousels — September 16, 2026

Live: https://jakeworsham.syncgr.com

Home, About, Work, and Contact now each own an independent horizontal carousel. Home has two slides, About has three, Work has six, and Contact has two. The former Approach content is in About; the previous `#approach` link still opens that page. Navigation uses normal page hashes, including browser back/forward.

Every Work project fills the available viewport (the desktop navigation rail is 64px wide). Previews have no card container, padding, radius, border, or shadow. A full-bleed image, legible title, and Open project link replace the old six-card grid. Google map attribution stays visible in the Prospects preview.

Each carousel has its own counter and previous/next controls. Native horizontal scrolling supports touch and trackpads. Arrow keys, Home, and End work inside the focused carousel. Inactive pages and slides are excluded from keyboard navigation. Page changes, viewport resizing, and reloads retain the selected slide; optional session storage falls back to in-memory state if unavailable. There is no autoplay.

## Verification

| Check | Result |
|---|---|
| Production build | Next build, TypeScript, and all static routes passed. |
| Desktop, 1440×1000 | 22/22 live browser checks: all 13 slides, independent carousels, project dimensions, frame-free styling, links, boundary controls, and retained page positions. |
| Mobile, 390×844 | The same 22/22 checks passed on production. All Work previews occupy 390×844. |
| Small screen, 320×568 | 22/22 local checks passed with reduced motion. Long editorial content can scroll inside its slide without clipping its final content behind navigation. |
| Touch input | Chrome native touchStart/touchMove/touchEnd moved Work from Prospects to Helga on the live mobile viewport. |
| Keyboard and reduced motion | Native Home/ArrowRight/End moved through Work; reduced-motion mode changed the position instantly and disabled CSS transitions. |
| Demo return | Open Helga reached the actual dashboard; browser Back returned to Work at Helga, slide 02/06. Reload also preserved the selected slide. |
| Navigation dialog | Native Escape closed the dialog; page selection closed it and focused the new carousel. |
| Routes | Homepage and all six demo routes returned HTTP 200. |
| Browser errors | No application runtime errors in the final production browser session. |

Evidence: `evidence/carousel-live-{desktop,mobile,touch,input,routes}.json` and `evidence/carousel-local-{desktop,mobile,small,touch}.json`. Visual captures under `evidence/screenshots/carousel-*` were inspected locally and remain ignored. Reusable browser checks are in `scripts/check-folio-carousels.js` and `scripts/check-folio-swipe.mjs`.

## Interface feel review

| Principle | Before | After |
|---|---|---|
| Navigation | One shared scroll position across chapters | Each page owns its slide position, controls, and accessible count |
| Work composition | Six framed project thumbnails | One full-screen, unframed project per slide |
| Input | Vertical scrolling drove the desktop track | Native horizontal gestures, explicit buttons, and keyboard commands |
| Motion | Shared track movement | Interruptible native smooth scrolling; instant movement with reduced motion |
| Focus | Offscreen focus scrolled the full chapter track | Inactive slides are inert; focused-carousel label and controls have visible indicators |

Balanced headings, pretty prose, font smoothing, tabular counters, 44px controls, explicit transition properties, and press feedback are preserved. There are no new decorative card surfaces or image outlines. All changed source files remain below 600 lines.

## Deployment scope

Deployed using `scripts/deploy.ps1 -FrontendOnly -Apply` to the existing S3 tenant prefix and CloudFront distribution. Invalidation `IEO3R9ZJZ13AQWEU2UL5TPXJPX` completed before live verification. This revision changes only the portfolio presentation and its browser checks. Demo code, APIs, IAM, secrets, DNS, and other infrastructure were not changed. The earlier API and voice evidence applies to the preceding reference-fidelity release; those suites were not rerun for this frontend-only change.
