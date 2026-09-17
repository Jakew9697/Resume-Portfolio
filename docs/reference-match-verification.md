# Reference layout rebuild — September 16, 2026

Live target: https://jakeworsham.syncgr.com

Reference: https://khanhnguyen.design/

This revision supersedes the independent slide decks described in `carousel-revision-verification.md`. Jake's latest instruction was to match the reference itself. Inspection showed separate routes, continuous horizontal desktop chapters, a scrolling work gallery, and full-screen project details. The earlier top navigation, slide counters, and next/previous buttons were not in the reference and have been removed.

## Final experience

- Home, About, and Works are separate static routes. Home and About translate continuous vertical scrolling into horizontal chapters on desktop. Home includes the held, expanding work-image interlude, selected-project links, service strips, experience links, and contact section.
- The desktop navigation is a 64px left rail and an oversized numbered menu. Mobile uses the reference's 65px top header and vertically stacked content. About puts the text before the portrait on mobile and beside the portrait on desktop.
- Works is a horizontal strip of unframed images with alternating aspect ratios. Wheel input anywhere on the page and arrow keys scroll the gallery. Each of the six projects opens a full-screen detail route with metadata on the left and a scrolling image sequence on the right. Back, Next project, browser history, direct reloads, and native live-demo links are supported.
- The reference's PP Editorial Old and PP Neue Montreal typefaces, warm charcoal/stone/paper palette, title scale, spacing, and navigation proportions are used. Jake's longer surname and project titles are fitted to their available width. Font attribution and personal-use scope are in `public/fonts/NOTICE.md`.
- Content is Jake's own: resume-backed Sync experience, his public GitHub portrait, and existing working project screenshots. Original reference project assets, biography, and employers are not substituted for Jake's history.

## Verification

The repeatable rendered-browser check is `scripts/check-reference-flow.js`, run through headed agent-browser sessions. It exercises visible controls, scrolling, project links, browser history, mobile stacking, title fit, and image loading without writing demo records.

| Check | Result |
|---|---|
| Production build | Next build, TypeScript, and static generation passed for all 21 routes. |
| Local desktop, 1440×1000 | 66/66 checks: Home 16, About 13, Works and all six detail flows 37. |
| Local mobile, 390×844 | 54/54 checks: Home 9, About 10, Works and all six detail flows 35. |
| Local small screen, 320×568 | 54/54 checks with reduced motion. |
| Live desktop, 1440×1000 | 66/66 production browser checks passed. |
| Live mobile, 390×844 | 54/54 production browser checks passed. |
| Live routes | HTTP 200 for Home, About, Works, Contact, all six detail routes, and all six applications (16/16). |
| Demo return | A native click on See It Live opened the actual Helga app; browser Back returned to the Helga detail route, then Back returned to Works. |
| Runtime errors | No application runtime errors in the final production browser session. |
| Keyboard focus | Focusing an offscreen chapter link moves its chapter into view, including the extra interlude scroll distance. |
| Escape | Native Escape closes the menu and restores focus to the menu trigger. |
| Reduced motion | Chapter navigation updates instantly and computed CSS transition duration is 0s. |
| Input interruption | Keyboard input cancels the gallery wheel animation before starting keyboard scrolling. |

CloudFront invalidation `I3I7N4IFKIVFWJTSCHAQ2YSUZ2` completed before the production checks. This supersedes the preceding invalidation `IEL0QU2G0OKFKZNUH6Q9XHYDUL`, which was followed by a small menu typography correction.

Evidence: `evidence/reference-flow-local-{desktop,mobile,small}.json`, `evidence/reference-flow-live-{desktop,mobile,routes}.json`, and `evidence/reference-flow-input.json`. Comparison screenshots under `evidence/screenshots/exact-reference-*` and `reference-match-*` were inspected locally and remain ignored.

## Interface feel review

| Principle | Previous revision | Current revision |
|---|---|---|
| Structure | Hash-switched slide decks with counters | Separate reference-style routes and continuous desktop chapters |
| Typography | Approximate type pairing and scale | Reference webfonts, measured spacing, and content-aware title fitting |
| Work presentation | One image per carousel slide | Unframed gallery opening full-screen split project views |
| Responsive layout | Desktop carousel scaled down | Mobile header and vertically stacked reference layout |
| Input and focus | Fixed slide steps | Interruptible gallery motion, keyboard navigation, focus recovery, and reduced-motion support |

Balanced headings, pretty body text, font smoothing, tabular time, 44px primary controls, explicit transitions, and press feedback are present. The design uses dividers and unframed images without decorative card surfaces. All new source files remain under 600 lines.

## Deployment scope

The existing `scripts/deploy.ps1 -FrontendOnly -Apply` workflow builds and publishes to `s3://sync-static-sites/tenants/jakeworsham/` and invalidates only this tenant on CloudFront `E1EMVV1XZZTJAS`. The project demos, API, secrets, IAM, DNS, and Terraform resources are unchanged by this revision. Earlier end-to-end API and voice evidence remains in `reference-revision-verification.md` and `verification.md`; those suites were not repeated for this presentation change.
