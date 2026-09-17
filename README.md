# Jake Worsham — Working portfolio

Live: https://jakeworsham.syncgr.com

Seven portfolio projects: six independent, functional browser demonstrations rebuilt from the projects on Jake's resume, plus Move V's cross-platform streaming application. Prospects follows the current Sync portal design. Helga follows its original obsidian, amber, and Fraunces interface. Businesses and records in the six isolated demonstrations are fictional.

| Demo | Working path |
|---|---|
| Prospects | Create/edit/delete leads, stages, search, follow-ups, activity notes, CSV and PDF reports |
| Helga | Typed or recorded request → Claude → saved task, calendar event, or email draft; Polly playback |
| Receptionist | Browser conversation → intake → saved callback summary and transcript |
| Documents | Notes → generated copy → edits → demo signature → paginated PDF |
| RFP | TXT/Markdown/text PDF references → grounded sections → edits → response PDF |
| Content studio | Editable page → preview → saved draft → published snapshot |
| Move V | Authenticated dev catalog captures across desktop, tablet, phone, and TV interface; links to the live streaming platform |

These are isolated portfolio adaptations. The receptionist does not place phone calls. Email drafts are not sent. Signatures are demonstration acknowledgments. CMS publication is scoped to the visitor's workspace, not a public customer website. Helga's original desktop services are adapted to browser recording and AWS services.

Move V is a case study of the existing application, not an isolated remake. Phone and tablet images show its responsive web interface; the TV image shows the actual webOS / Tizen interface running in a browser against the development API. These captures do not establish native-device or app-store release readiness.

## Architecture

- Next.js static export with React; no Next server required.
- Existing Sync S3 bucket and shared CloudFront host the `tenants/jakeworsham/` prefix. Existing wildcard DNS and TLS cover the host.
- Dedicated Hono API: `jake-portfolio-prod` Lambda, DynamoDB table, and private audio bucket. No connection to real platform tenant records.
- Claude Haiku 4.5 via Bedrock US inference profile; Polly neural speech; Amazon Transcribe.
- HMAC-signed guest sessions expire after 24 hours. The browser stores its session in sessionStorage. Each tab/visitor starts a separate workspace; closing the tab ends access. DynamoDB TTL and S3 lifecycle clean up expired data; physical deletion is asynchronous.
- The signing key is loaded from AWS SSM `/sync/jake-portfolio/prod/session-signing-key` at runtime. No keys in source or environment files.
- API validates schemas and origins, applies optimistic concurrency, and enforces per-session/IP/global usage limits. Public guest access is intentionally available; origin validation is an additional browser control, not identity authentication.
- Global daily limits: 400 AI requests, 600 speech requests, 100 recordings, 500 new sessions. Lambda concurrency is capped at 3. Errors and exhausted allowances are visible in the UI.

## Local development

Use Node 22+ and `npm ci`. `npm run build` copies the matching PDF worker before building. `npm run test:api` checks guest-token integrity and fixture contracts. `npm run check` checks TypeScript.

The dev Terraform leaf mirrors production but is not provisioned by default. To work against it, authenticate with `AWS_PROFILE=sync-admin`, build the API, run `scripts/ensure-signing-key.mjs dev`, then initialize, review, and apply `infra/dev`. Set `NEXT_PUBLIC_DEMO_API` to that leaf's API URL and run `npm run dev -- --port 3046`. Production accepts the live site's origin only.

## Deployment

From PowerShell, `./scripts/deploy.ps1` builds the API and produces a Terraform plan without applying. Review it, then run `./scripts/deploy.ps1 -Apply`. For a frontend-only change, use `./scripts/deploy.ps1 -FrontendOnly -Apply`.

The script verifies the AWS account, preserves the SSM key, applies only this repo's production leaf, uploads assets and pages under the portfolio prefix, and invalidates only that prefix. It preserves older hashed assets for cached pages. Rollback uses a previous Git revision followed by the same deployment process; do not destroy infrastructure to roll back code.

Both `infra/dev` and `infra/prod` use the shared module and separate remote state. No shared DNS/CDN configuration or platform source is changed. Keep both dependency lock files committed. Native links intentionally avoid Next 16 segment-prefetch requests that require extra rewrites on this shared static host.

## Verification

Set `DEMO_API_URL` to the deployed API and `AWS_PROFILE=sync-admin`, then run `node scripts/verify-live.mjs`. It exercises persistence, validation, session isolation, AI actions, generation, caller summaries, speech, transcription, and audio ownership. It uses synthetic information and consumes bounded demo quota. `VOICE_ONLY=1` scopes a rerun to audio. Credentials are never written to evidence.

Browser QA uses headed agent-browser. See `docs/verification.md` for live results and `docs/build-plan.md` for source/design references. On Windows, agent-browser 0.31's download helper can pass an unsupported extended path to Chrome; `scripts/configure-qa-downloads.mjs` resets the test browser's download behavior. Normal browser downloads work.

Source references were reviewed in place. The original employer-specific Prospects backend, original Helga checkout, and platform repository were not modified or copied into this repo.
