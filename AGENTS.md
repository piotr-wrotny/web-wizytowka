# Prototype Instructions

## Confirmed design and content decisions

- On 2026-10-30 the founder selected the attached mockup, displayed option 3, internally called Esej autorski. Exact source: `design/selected-reference.jpeg`.
- Keep the warm paper, large Newsreader typography, Inter body text, personal name and full-width pine-green main offer. The reference has no photography. Do not add portraits or decorative AI assets.
- 2026-11-09, founder: the primary service is **bespoke AI consulting** ("konsultacje AI szyte na miarę"). W (team standard), K (single decision) and R (offer review, enquiry-only) are the three delivery formats under that umbrella, with W still the most elaborate. This supersedes the DR07 ordering (W primary, K secondary). Do not turn expertise domains into additional services.
- Use-case placeholders are allowed: generic roles and situations (sales team, customer service, management, analytics, HR) that show the kind of question and the chosen format. They must be labelled as illustrative examples, never as engagements or clients. Content lives in `site.cases` and is marked `DRAFT` until approved.
- 2026-11-09, founder: the home page must share one typographic scale with the article pages. The mock's native proportions (893 px wide) are the ceiling: the opening is no longer scaled up 1.6× to 1440 px. Scale tokens `--t-display/--t-title/--t-h2/--t-h3/--t-lead` in `styles.css` are the single source; do not add per-section font sizes outside them.
- Founder name, public biography, contact, domain and real client evidence remain placeholders. No invented clients, metrics or certifications. No public prices in this prototype.
- The contact form is a local demonstration: validate and show a draft; never send data or claim a message has been sent.
- Content and navigation are Polish first, with separate editable content modules. Keep article pages and the synthetic example accessible without lead capture.


Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

## Durable design feedback

- 2026-11-09, founder: the current prototype feels like "a meagre shell" (mizerna powłoka). It must read as a credible showcase for an AI expert, not a template. Raise perceived depth and craft (content density, proof-of-thinking, detail, interaction quality) within the constraints above: no portraits, no AI decorative assets, no invented clients/metrics, no public prices.
- 2026-11-09, founder approved `docs/plan-fable.md`: (1) `design/selected-reference.jpeg` is binding only for the opening, down to and including the K row; below it the layout is free within the visual system (tokens, Newsreader/Inter, no imagery). (2) Home page is restructured as one axis: Sytuacja folds into W; K becomes one compact section with R as its footnote. (3) A shortened example standard (6 definition rows) appears on the home page as a captioned exhibit labelled synthetic. (4) New voice content ("Czego nie robię", working glossary as marginalia) may be drafted; mark it `DRAFT` until the founder approves the wording. One boundary statement per context instead of several; no factual caveat is removed.
