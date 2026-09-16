# Production verification — September 16, 2026

Target: https://jakeworsham.syncgr.com. API: dedicated `jake-portfolio-prod` Lambda URL. All records and test audio were synthetic. The original projects and company customer data were untouched.

## Completed checks

| Area | Live evidence and outcome |
|---|---|
| Prospects | Browser create, edit stage and activity note, reload persistence, two-step delete, empty search. Qualified filter returned 2 records sorted by value. Follow-ups returned 7 records with a matching footer. CSV and pipeline PDF downloaded. |
| Helga | Bedrock tools saved task, event and email draft. Browser microphone recording with a deterministic WAV fixture used the real MediaRecorder → Transcribe → Claude path and created a task. Completion, event and draft survived reload. |
| Speech | Polly returned a real MP3. Browser playback reached currentTime 0.1126 seconds, duration 5.232 seconds, readyState 4. Audio ownership rejected a foreign guest with 404. |
| Receptionist | Caller message with name, repair request and sample callback number produced a reply; ending the call saved a summary and complete transcript. Summary included supplied details and outstanding questions without claiming a confirmed appointment. |
| Documents | Generated proposal, saved edits, recorded a demo signature and downloaded a two-page PDF. Editing cleared the prior signature. Updated export was opened with PyMuPDF, text checked, and page 1 rendered and inspected. Markdown markers removed, headings styled, footer numbered. |
| RFP | TXT and PDF references uploaded and text extracted. All 3 sections generated; citations included uploaded filenames and missing experience was marked for confirmation. Edits survived reload. Three-page response PDF downloaded and parsed. Unsupported file rejected; generation disabled when references removed. |
| CMS | Edited headline/accent, published a snapshot and opened it. Saved an alternate draft, reloaded it, and verified the published page retained the earlier headline. Invalid email rejected without corrupting saved data. Mobile preview width 343px. |
| Recovery | Aborted Helga state request in the test browser; visible error and Try again appeared. Removing interception and retrying restored the real workspace. |
| Mobile | `/`, `/prospects/`, `/helga/`, `/receptionist/`, `/documents/`, `/rfp/`, `/cms/`: innerWidth 390, document width 375, no horizontal overflow. Mobile navigation opened and selected CMS. Desktop references captured at 1440×1000. |
| Isolation | Independent guests started with independent records. Missing/invalid tokens returned 401; invalid origin 403; unknown workspace 404; stale write 409; invalid data 400. |
| Runtime | Final fresh navigation sweep reported no application runtime errors and no HTTP 4xx/5xx requests. Deliberate negative tests were run separately. |

API evidence is in `evidence/live-api-checks.json` (14 successful non-audio checks) and `evidence/live-voice-checks.json` (4 successful audio checks). The first combined run stopped at a broken local FFmpeg executable; the audio fixture generation was replaced with Polly PCM and the isolated voice rerun passed. The failed harness entry is retained rather than rewritten as a pass.

## Build and infrastructure

- Production Next build and TypeScript passed. Two targeted tests passed: guest token integrity and all bounded seed schemas. npm audit reported zero vulnerabilities.
- Both Terraform leaves validated. Prod provisions ten isolated resources; dev was initialized for validation only, not applied.
- Existing Route53 wildcard, TLS certificate, shared CloudFront router and S3 tenant hosting were reviewed live. No DNS/CDN configuration changes were needed. Publish path is `s3://sync-static-sites/tenants/jakeworsham/`.
- Production API/model update changed only its Lambda and IAM policy. Existing company applications were not modified.
- Last frontend deployment uses `scripts/deploy.ps1 -FrontendOnly -Apply`; invalidation `I3R8EX9Q8LRH05I9QCYXOE8KW3`.
- AWS signing material is in SSM only. Data access is limited to the isolated table/audio bucket. Retention: logical guest session 24h, DynamoDB TTL, one-day audio lifecycle, 14-day logs. AWS physical cleanup is asynchronous.

## Problems found and corrected

1. Nova Lite returned only planning markup on a tool request. Switched to Claude Haiku 4.5 on Bedrock and verified real saved actions; response extraction rejects empty planning-only output.
2. Next segment-prefetch URLs did not match exported paths on shared static hosting. Native page links avoid those requests. Fresh live routes and favicon subsequently returned successfully.
3. PDF output initially showed raw Markdown and weak heading pagination. Formatter now strips markers, styles headings, measures long words, and avoids orphan headings.
4. Follow-up footer originally counted the unfiltered pipeline. It now reflects the displayed rows.
5. Compact controls were enlarged to at least 44px. Reduced motion, explicit transitions, focus outlines, balanced headings, tabular numbers, neutral surface outlines and press feedback were checked in source and visual QA.

## Browser automation notes and limits

Tests used headed Chrome through agent-browser 0.31.2. Its Windows download helper supplied extended `\\?\` paths that Chrome rejected. Normal browser downloads succeeded under the user's Downloads location after resetting test download behavior. Downloaded PDFs were copied to ignored local evidence and inspected.

Native pointer/keyboard commands occasionally reported success without dispatching the expected interaction, and some screenshots timed out at the daemon. Remaining checks used agent-browser DOM click/focus/input events against the rendered controls, then verified actual server persistence. These are browser integration checks, not a claim of exhaustive physical-device, assistive-technology, or cross-browser coverage. Earlier successful desktop/mobile screenshots remain under ignored `evidence/screenshots/`.

No actual customer telephone calls, external emails, real calendar accounts, or customer CMS deployments were used. The site explicitly identifies the browser call, unsent drafts, demo signatures, and visitor-scoped published snapshot. Real human microphone acoustics and Safari/Firefox were not tested.
