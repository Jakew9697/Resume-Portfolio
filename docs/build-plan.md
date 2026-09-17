# Jake Worsham working portfolio

## Brief and source review

Build and deploy to https://jakeworsham.syncgr.com. Six self-contained working demonstrations: Prospects, Helga, receptionist, document automation, RFP responses, CMS. The existing Resume-Portfolio repo was a generic 2025 starter with fabricated placeholder profile data; none of those claims will be published.

Sources reviewed: Jakew9697/helga (GitHub main 1b453cd plus current uncommitted UI as visual reference), Jakew9697/Prospects-Client and Prospects-API (fresh shallow clones), syncgr/platform portal source (4997f19), and Sync reports source. Originals remain untouched. The Prospects API belongs to an employer-specific legacy service: recreate its workflows with synthetic records; do not copy datasets, credentials, internal endpoints or backend implementation into the public demo.

## Design direction

- Portfolio: crisp white #F7F8FC, ink #182238, cobalt #3659E3, subtle blue-gray #E9EDF6. Geist body, Fraunces display. Large left-aligned introduction followed by live-product previews; the work is the focal point.
- Prospects and portal-derived apps: current portal graphite #14171B, raised #1F242A, foreground #EDEDED, cyan #00AEEF. Geist body/mono and Fraunces titles. Compact 220px navigation, 56px top bar, table-centric sales workspace, mobile cards.
- Helga: source obsidian #0A0A0B, surface #121215, amber #E8B86B, warm white #ECE9DF, Fraunces display. Preserve orb, surrounding daily widgets, conversational transcript and understated sidebar.
- Every control: real action, visible failure/loading/success feedback, keyboard access, 44px targets, explicit interruptible transitions and reduced-motion support.

## Isolation and hosting

Existing wildcard Route53 A/AAAA and ACM/CloudFront E1EMVV1XZZTJAS already cover requested host. Live router maps subdomain to tenants/jakeworsham; the S3 prefix is empty. No DNS or CDN config changes needed.

Public candidate demos must not receive platform tenant credentials or access real customer data. A small Hono API in this standalone portfolio repo serves isolated guest workspaces. Dedicated DynamoDB + private temporary audio S3; Bedrock for real generation, Polly for speech, Transcribe for microphone recordings. Long-lived signing secret read from SSM at runtime. Short-lived signed guest sessions, bounded inputs, per-session/IP/global quotas and TTL cleanup. Terraform module with matching dev/prod leaves; operator deploy script builds, plans, applies only this isolated leaf, uploads the static export and invalidates only the portfolio prefix. No platform API or Lambda code will be changed.

## Acceptance

Prospects: create, filter, edit, activity note, delete and export; prove persistence after reload.
Helga: typed and microphone requests, audible generated reply, task/calendar/draft tools with real saved results in visitor workspace.
Receptionist: complete a sample intake conversation, generate call summary, persist it; browser call demo is labeled separately from the original telephone integration.
Documents: edit inputs, generate from provided notes, download valid PDF, record demo signature.
RFP: upload reference text/PDF, draft sections grounded in provided source, edit, save and download.
CMS: edit a sample page, preview, publish revision and view published content.
Production: all routes, API paths and downloads verified on requested HTTPS host; desktop/mobile screenshots, zero unexpected runtime errors, session isolation and negative-input tests.
