# Magnify and Websites

Published September 17, 2026 at https://jakeworsham.syncgr.com/.

Magnify is the eighth application in Works and appears in Home's selected work. Its full-screen case study includes actual desktop and mobile captures of the seeded residential-inspection template, taken after signing into the Magnify demo. Opening its live link visits https://magnify.syncgr.com/. The original Magnify source and customer records were not modified.

Websites is a separate navigation destination at `/websites/`, with 20 entries and direct detail routes. It shares the reference gallery, keyboard/wheel navigation, browser history, and full-screen detail flow with Works. Each website has desktop and phone screenshots inside device mockups; entire captured viewports are preserved with `object-fit: contain`. Projects retain their own design and colors inside the screens.

## Sources and scope

Inventory: `scripts/website-inventory.json`, backed by KB client overviews, the Beneath Pictures website plan, Scott Devon release records, and current source/live-site inspection. Includes Scott Devon, Move V Studio, Beneath the Varnish, Mitten Chips, Traverse Bay Pizza Co., The Green Apple Pantry, Platinum Roofing, Mich-Inspect, Blue Shore, Aerie, Enchanted Gardener, It Better Be Sweet, Eclipse Drywall, EBD Wall, Klingman's Design, Sync, Sapphire Hulls, Construction Simplified, Tim's Gourmet Sliders, and Neisha Neshae.

- Move V's studio site is `move-v.com`; the separate streaming application remains `move-v.app` in Works. The older Beneath Pictures alias renders the rebranded studio.
- Beneath the Varnish's main domain still renders the older website. This portfolio links the verified Sync build at `beneaththevarnish.syncgr.com`, explicitly labeled Demo. Klingman's Design is also labeled Demo.
- Blue Shore's public domain and checked Sync aliases return 404. Its entry is labeled Archive, with captures from the existing source at `D:/p/blue-shore-construction`, run locally on port 3047. It has no broken live CTA. Original checkout stayed clean and its server was stopped after capture.
- Website scope credits development at Sync, without inventing individual delivery dates or claiming sole authorship.
- Magnify QA credentials were absent from SSM. The documented seeded demo credential was migrated to SecureString parameters `/sync/qa/magnify/email` and `/sync/qa/magnify/password`, then fetched at runtime for browser login. No credential values are stored in the repository. Captures show the template, not customer inspection addresses or chat history.
- Capture provenance: `evidence/websites-capture.json`. Screenshots show real viewport states; they are not full-page images or evidence that every external site's transaction flow has been tested. No new backend or hosting infrastructure was created.

## Validation

- Production build, including TypeScript, passed: 44 exported pages. Modified source files stay below 600 lines; diff hygiene passed.
- Live headed browser checks passed 420/420: Websites 120 desktop +118 mobile; Works 60+58; Home 20+13; About 17+14. No portfolio runtime errors were reported.
- Verified all eight application and 20 website detail flows, image decoding, complete screenshots inside devices, device bounds, native destination links, titles, menu current states, browser Back/Next, horizontal navigation, and responsive overflow. The website gallery also passed 118/118 locally at 320×740.
- Desktop/mobile galleries, Magnify details, all desktop source screenshots, and the five-item menu were visually inspected. Live menu navigation to Websites and direct Magnify navigation succeeded.
- Deployed with the existing frontend-only script to `sync-static-sites/tenants/jakeworsham/`. CloudFront invalidation `I1YOSJPPRDLFGMYNDX7FJ1MS9U` completed before live acceptance.
- Existing six-demo backend flows were not changed or rerun; external Magnify write workflows and streaming playback are outside this presentation update's proof.

## Interface feel review

| Principle | Before | After |
| --- | --- | --- |
| Navigation | Four destinations | Five readable destinations; current page highlighted; all labels fit at 320px |
| Typography | Long website names overflowed during testing | Website-specific heading sizes fit desktop and phone widths |
| Presentation | No website collection or Magnify | Real screens in device frames, with uncropped pixels and layered shadows |
| Interaction | Works-only gallery state | Independent Works/Websites positions, native links, keyboard/wheel, Back/Next |

Existing font smoothing, balanced headings, pretty body text, neutral image outlines, 40px+ targets, press feedback, explicit interruptible transitions, and reduced-motion behavior are retained. No new continuous animation or `transition: all` was added.
