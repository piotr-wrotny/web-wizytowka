# Design QA

Source visual truth: `design/selected-reference.jpeg`, supplied by the founder, 893 × 1536 pixels, desktop composition. No source photography, logos or raster illustrations to reproduce. Standard directional icons use Phosphor Light; no hand-drawn replacements.

Implementation: cloud-browser render of the prototype. Initial screen: `../analysis/browser-reference-width-first.jpg`. Normalized combined comparison: `../analysis/comparison-01.jpg`.

Viewport: a same-origin iframe with a real CSS viewport of 893 × 1536 in Chrome. This provides responsive rendering without browser-specific viewport-control APIs. The outside browser canvas is cropped away for comparison; no app pixels are stretched. Initial capture includes a 15px iframe scrollbar, removed from the QA wrapper for subsequent same-width comparisons. This QA wrapper is not part of the built website.

State: homepage at scroll origin, closed details, empty demonstrative form. Date: 2026-10-30.

## Findings in first comparison

- [P2] Display weight and vertical rhythm differ. Headline wraps correctly into the three reference lines but medium weight is heavier and line height pushes the lead and primary CTA down. Fix: Newsreader 400, tighter display line height, shorter header and hero gaps.
- [P2] Perspective strip wraps its title into three lines, against two in the source. This increases its height and pushes the primary green region down. Fix: regular weight and available width; retain the explicit line break after “Produkt. Proces.”.
- [P2] Main green service heading is materially too small. Fix: increase display scale while preserving one line at the desktop comparison width.

## Fidelity surfaces

- Fonts: actual locally hosted Newsreader/Inter with Polish glyphs; regular display weight selected after comparison. Browser computed family inspected. Recheck wrapping after fixes.
- Spacing/layout: initial comparison identifies the offsets above. Header, hero, perspective and green service are retained in the source order.
- Colors/tokens: paper #F6F4EE, ink #202823, pine #20594D, muted #5F6862. Generated photographic noise is not interpreted as a required background asset. Flat, accessible surfaces preserve the editorial intent.
- Image quality: source has no independent raster artwork. Text stays semantic HTML; icon assets come from Phosphor.
- Copy/content: source hero and visible service text match. Further sections implement the requested DR07-aligned content, not invented clients or outcomes. Prices remain hidden.

## Comparison history

1. Opened source and browser implementation together in `comparison-01.jpg`. Three P2 differences recorded. Current fixes are in `src/styles.css`; a fresh capture is required before acceptance.

2. Second comparison: `../analysis/comparison-02.jpg` and focused `../analysis/comparison-type-02.jpg`. The earlier headline and perspective issues are corrected. A remaining P2 service-region height and consultation-row wrap were identified. Fixed service spacing, heading scale and teaser column padding; fresh capture required.

3. Responsive pass: 390 px has no horizontal overflow and preserves clear hierarchy. At 320 px the hero orphaned “Od”; reduced only the smallest display scale to 44 px. Article title links received a continuous block hit area, and mobile article-arrow targets were widened to 44 px. Fresh captures and interaction verification follow.

## Completed checks and final evidence

- Final normalized full comparison: `../analysis/comparison-final.jpg`. Both images are 893 × 1536 before the comparison caption. Source and implementation are shown together, with no app-image scaling. Chrome devicePixelRatio was read as 1.
- Focused type comparison: `../analysis/comparison-type-02.jpg`. This remains valid for the final display typography. Final service/CTA details are readable in the full final comparison. Earlier P2 offsets, wrapping and scale are corrected.
- Final desktop content capture: `../analysis/desktop-selected-final.jpg`; direct full homepage: `../analysis/browser-desktop-full.jpg`. Reviewed additional crops `review-scope.jpg`, `review-method.jpg`, `review-contact.jpg`.
- Responsive browser captures: `../analysis/mobile-390.jpg`, `mobile-320-final.jpg`, `tablet-1024.jpg`, `desktop-1440.jpg`. Real iframe body widths and scroll widths were read as equal at 320, 390, 1024 and 1440. Mobile has no supplied reference; judged for readability, hierarchy and operation rather than pixel equality.
- Menu: open/closed states, Escape and return focus verified. Navigation to contact closes the menu.
- Main service CTA opens the conditions disclosure. Native details/summary remain keyboard operable.
- Synthetic standard page and its label opened; both complete articles and their return links opened. Title-link hit areas now include the entire multiline title rectangle.
- K and R links set contact topics to `decyzja` and `oferta` respectively. Short visible option labels fit small screens.
- Contact: blank submission shows both errors; valid synthetic input produces a local preview explicitly saying nothing was sent. Keyboard Enter works. Copy reports “Skopiowano opis”. No actual email was sent.
- Skip link moves actual focus to `main`, tabindex -1.
- Browser console inspected: no application-origin error/warning messages observed; extension transport messages were identified separately and are not website errors.
- Final production build completed. Five prerendered HTML documents each have one H1, unique IDs, noindex and valid internal page paths. The contact fieldset is disabled in HTML until the local script is ready. Static copy is present without requiring client rendering.
- Existing project tests: 4 passed, 0 failed. No new implementation-mirroring unit tests were added.

## Residual limits and follow-up polish

No actionable P0/P1/P2 issue remains in the prototype scope. Small differences in raster glyph rendering, generated-paper noise and a few-pixel section alignment are P3 and are accepted; no extra decorative artwork was introduced to simulate the image-generation artifact.

This is not a full WCAG audit, physical-device test, screen-reader session or field Core Web Vitals measurement. Contact delivery, public identity and a production privacy workflow are intentionally not configured. They are launch tasks, not falsely simulated capabilities.

Browser captures are session review evidence, not included as separate source-package deliverables. The selected reference and the code needed to reproduce the rendering are included.

## Implementation checklist

1. Completed: selected reference implemented, all earlier P2 findings fixed and recaptured.
2. Completed: core paths, responsive widths, menu, keyboard, error/draft/copy states and article navigation verified.
3. Completed: build, prerender and required project tests.
4. Before publication: complete founder data, service terms, real enquiry workflow and accessibility verification as listed in docs/launch-readiness.md.

final result: passed
