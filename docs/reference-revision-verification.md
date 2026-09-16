# Reference fidelity revision — September 16, 2026

Live site: https://jakeworsham.syncgr.com

The later [carousel revision](carousel-revision-verification.md) replaces the homepage's shared horizontal track and project grid. The demo-app verification below remains the record for the reference-fidelity release.

## References and implementation

- Inspected https://khanhnguyen.design/ in a headed browser at 1440×1000 and 390×844. The new portfolio uses warm charcoal/ivory, oversized editorial type, a vertical rail, horizontal desktop chapters, a full-screen menu, and stacked mobile sections. Text and app screenshots belong to this portfolio; no reference photography or proprietary fonts were copied.
- Read the original Prospects-Client parent layout, menu, map, markers, legend, forms, and filters. Replaced the table-first interpretation with a full-viewport Google Map, floating New Prospect/menu controls, right-side panels, discovery, saved prospects, filters, and reporting. Colors follow Sync portal tokens.
- Read and rendered the original Helga UI locally without running its account-connected application. Matched its 200px sidebar, metadata row, calendar/orb/inbox layout, four compact widgets, bottom activity/transcript panels, amber network animation, typography, and Voice Mode/Stop controls.
- All public workspaces remain isolated guest demonstrations. Helga's private account and financial connections are not exposed. Google discovery results are actual public business listings; contacts and test actions were synthetic. No outreach was performed.

## Live checks

| Check | Result |
|---|---|
| Google map | Actual tiles rendered on the production hostname, with seven initial visible markers and dark styling. |
| Prospect details | Marker opened its popup; popup opened the edit drawer. Priority and next action persisted after reload. |
| Discovery | Google Places returned ten real businesses. Saved a place, opened Saved Future Prospects, converted it into a prospect, and verified its marker after reload. Address, city, state, and ZIP were populated. |
| Geocoding | A new sample prospect at 300 Monroe Ave NW returned real coordinates and saved successfully. |
| Filters | High-priority filter reduced the actual marker set to Juniper Market; modal and map counts agreed. |
| Reporting | Downloaded CSV through the rendered button. Parsed the file and verified one filtered record, priority, value, and updated next action. |
| Helga tools | Typed request created a task and email draft. A manually added calendar event survived reload. Task completion updated the workspace. |
| Helga voice input | Headed Chrome with a synthetic WAV microphone used the real MediaRecorder → AWS Transcribe → Claude → DynamoDB flow. Voice Mode and Stop produced a saved “Review the voice demonstration” task and a real response. |
| Helga speech | Listen played actual Polly audio: readyState 4, duration 10.344 seconds, playback advancing. |
| Helga draft | Draft opened with generated content. Clipboard rejection in an unfocused automation window is handled with a visible message and selectable text; do not treat this as proof of an OS clipboard write. |
| Dashboard preferences | Hiding the Cash flow widget persisted after reload; restoring it worked. |
| Mobile | Homepage, full-screen menu, contact anchor, map, prospect menu, Helga dashboard/transcript, and expanded Helga navigation checked at 390×844. Final prospect drawer has no horizontal overflow and its search controls remain in one row. |
| Homepage | Six actual app screenshots loaded as their chapters entered the viewport. Menu navigation reached the correct chapter on desktop and mobile. Keyboard focus brought an offscreen project into view. |
| Routes | Homepage and all six app routes returned HTTP 200. |
| Browser runtime | No application runtime errors in the Prospects, Helga, and showcase sessions. Browser-harness syntax/ref/timing mistakes were corrected separately. |
| API regression | All 18 live checks passed, covering session/origin/isolation/conflicts, prospects, Helga, documents, RFP, receptionist, Polly, Transcribe, and audio ownership. Evidence: `evidence/live-api-checks.json`. |
| Build/contracts | Production Next build and TypeScript passed. Bounded schema/session tests passed, including invalid map coordinates and persistence of map fields. Dev Terraform validation passed. |

## AWS and scope

The existing `jake-portfolio-prod` Lambda retrieves `/sync/google/api-key` from SSM at runtime. The authenticated Maps configuration endpoint returns `Cache-Control: no-store`. No Google key is stored in source or static build output. The KB identifies this existing key as a browser Maps key; authorization was verified on the live hostname, without changing GCP restrictions.

Terraform applied only the existing portfolio Lambda and its IAM policy. The policy adds GetParameter access to that one parameter; no new resources, shared CloudFront routing, DNS, tables, or buckets were created or changed. A subsequent plan reported no changes. Both dev and prod use the updated shared module.

Static files were deployed to `sync-static-sites/tenants/jakeworsham/`; invalidations were limited to that tenant. Homepage publication invalidation `I3LNLWDNFLHWJ41XPO6FDF1DJZ` completed. Original Prospects, Helga, and platform repositories remain unchanged.

## Interface checklist

- Balanced headings, pretty body copy, root font smoothing, and tabular changing numbers.
- Neutral screenshot outlines, restrained layered shadows, consistent nested spacing/radii.
- Main controls have at least 40px targets; focus states and native dialog focus trapping are present.
- Explicit interruptible transition properties; press feedback; no new `transition: all`.
- Reduced-motion mode disables decorative CSS motion and the orb's animation loop.
- Files split by map/form/panel, Helga widgets/views, and style concerns; new source files remain below 600 lines.

Local browser captures are under `evidence/screenshots/` (ignored). The six optimized portfolio images are versioned under `public/projects/`.
