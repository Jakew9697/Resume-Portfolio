# Projects presented on devices

Published 2026-09-17 at https://jakeworsham.syncgr.com/works/.

## Design

Inspected the gallery and project presentation at https://khanhnguyen.design/works/. Its device scenes informed the new presentation: alternating landscape and portrait compositions, physical screen frames, soft lighting, and distinct settings for each project. The existing unframed gallery and full-screen project navigation remain.

The portfolio uses original CSS hardware and studio scenes, with the existing screenshots placed inside the screens. These are presentation mockups, not photographs or new native-device test evidence. No screenshot pixels were regenerated or edited. Images use `object-fit: contain`; bezels, cameras, and hardware sit outside the application content.

| Project | Device presentation |
|---|---|
| Prospects | Desktop display in a pale green-gray studio |
| Helga | Laptop in a warm charcoal studio |
| Move V | TV, tablet, and phone composition; dedicated desktop, TV, tablet, and phone detail views |
| Receptionist | Landscape tablet in a warm stone studio |
| Documents | Laptop in a light stone studio |
| RFP Response Builder | Desktop display in a cool gray studio |
| Content studio | Laptop in a warm sand studio |

The shared `DevicePreview` component also covers the Home mosaic, hover previews, service panels, and About project illustrations. The supplied portrait stays unchanged. Existing live-project links and demo applications are unchanged.

## Validation

Production build passed with TypeScript and all 22 static pages. All modified source files remain below 600 lines; `git diff --check` passed.

Headed browser checks on the deployed site:

| Page | Desktop 1440×1000 | Mobile 390×844 |
|---|---:|---:|
| Works | 52/52 | 50/50 |
| Home | 17/17 | 10/10 |
| About | 14/14 | 11/11 |

154/154 live checks passed, with zero reported browser runtime errors. Verification covers loaded complete screenshots inside devices, hardware bounds inside gallery scenes, positioned scene layers, unframed project previews, menu operation, project/detail/back/next/history navigation, links, title fit, and horizontal overflow. The local gallery also passed at 320×740. Gallery, detail, hover, and mobile About views were visually inspected.

Evidence: `evidence/devices-live-*.json`, with local screenshots under `evidence/devices-*.png` (screenshots are gitignored).

## Interface feel review

| Principle | Before | After |
|---|---|---|
| Context | Bare application screenshots | Full interfaces inside laptop, display, tablet, phone, and TV hardware |
| Framing | One landscape shape per screenshot | Mixed portrait/landscape scenes with complete, contained screen images |
| Depth | Flat image planes | Layered hardware shadows, bevels, and lighting; outer gallery remains unframed |
| Hover | Screenshot fades in an undersized holder | Entire scene fits its holder; existing interruptible opacity transition remains |
| Responsiveness | About image could use static positioning | Positioned scene contains every hardware/background layer at each viewport |

Neutral screen outlines, balanced headings, pretty wrapping, existing 40px+ targets, visible focus, press feedback, and reduced-motion support remain. New device poses are static and add no automatic animation or new dependency.

## Deployment

Ran `scripts/deploy.ps1 -FrontendOnly -Apply`. Updated only the portfolio S3 prefix and completed CloudFront invalidation `I8YP5909I0AOAT8Y5RQXBE0Q3E` on `E1EMVV1XZZTJAS` before live verification. No API, infrastructure, secrets, original screenshots, or original project repositories were changed. The previous Move V localhost playback limitation remains documented in `uncropped-previews-and-move-v.md`.

Next.js generated the repository's small `AGENTS.md` and `CLAUDE.md` files when the local preview ran. They point to the installed framework guides; they contain no credentials or project configuration changes.
