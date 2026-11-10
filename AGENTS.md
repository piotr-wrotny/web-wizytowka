# Prototype Instructions

Visual direction, typography, colour, layout and motion are deliberately not prescribed here. Only content and business rules are binding.

## Content and business rules

- Founder name is **Piotr Wrotny** (confirmed 2026-11-09). Public biography, contact, domain and real client evidence remain placeholders. No invented clients, metrics, testimonials or certifications. No public prices in this prototype.
- 2026-11-09, founder: the primary service is **bespoke AI consulting** ("konsultacje AI szyte na miarę"). Standard dla zespołu (W), Jedna decyzja (K) and Przegląd oferty (R, enquiry-only) are the three delivery formats under that umbrella, with W the most elaborate. Do not turn expertise domains into additional services.
- 2026-11-10, founder: the **main use case and main example of work** on the site is the consultation itself: before the consultation the client's biggest problems, pain points and knowledge level are established; material is gathered for them; it is presented and explained; there is a meeting; at the end the client receives documents with all the knowledge. Each stage is shown with its value for the client. Content lives in `site.flow`; the sheet contents are illustrative and the wording is `DRAFT` until approved.
- 2026-11-10, founder: the consultation flow is the main example of work; the other examples (formats, example standard, analyses) are secondary. It also has its own page, `/konsultacja/`, a scrolled presentation where each stage is one screen and the whole page takes the stage's theme. The home section and the page share `site.flow`.
- 2026-11-10, founder: state the consultation terms together (`site.flow.terms`): a meeting tailored to needs, any number of participants, and so on. Add more visual calls to action after the main sections. Develop the "Od czego zaczynają klienci" section further; the founder considers it a strong asset.
- 2026-11-10, founder: `/konsultacja/` should use rich, scroll-driven animation and visual effects; layout and quality were approved, the earlier version felt under-animated. Motion stays in the pencil-and-paper language and the page stays complete without it.
- 2026-11-10, founder approved the home page as **one axis: the consultation at the centre, the situations as evidence, everything else as background**. The hero names the offer (it absorbed the former blue offer block; headline "Konsultacje AI szyte na miarę.", DRAFT wording). Order: hero, flow, situations, formats as compact rows, "Czego nie robię", analyses, person, contact. Do not reintroduce a second process or a second "example of work" on the home page; the three-step method and the example standard live outside it.
- 2026-11-10, founder liked the visual direction, typefaces and quality of the `redesign/reimagined` branch (described in README). Extend it rather than replace it.
- Use-case placeholders are allowed: generic roles and situations that show the kind of question and the chosen format. They must be labelled as illustrative examples, never as engagements or clients. Content lives in `site.cases` and is marked `DRAFT` until approved.
- Voice content drafted by the assistant ("Czego nie robię", glossary, article theses, the hero illustration in `site.proof`) stays marked `DRAFT` until the founder approves the wording. One boundary statement per context; no factual caveat is removed.
- The example standard is synthetic and must be labelled as such wherever it appears.
- The contact form is a local demonstration: validate and show a draft; never send data or claim a message has been sent.
- Content and navigation are Polish first, with separate editable content modules in `src/content`. Keep article pages and the synthetic example accessible without lead capture.
- The page must be fully readable without JavaScript and with `prefers-reduced-motion`.

When the founder gives durable prototype-specific feedback or decisions, record them in this file.
