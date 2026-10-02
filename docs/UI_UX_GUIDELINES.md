# UI/UX Guidelines

## Product audience and tone

Design for pharmacy owners and counter staff in Nigeria, including people who are not highly technical. Make routine tasks fast, plain, and recoverable. Use familiar pharmacy/payment language, clear NGN formatting, explicit dates/times, and concise action labels. The interface should feel like a dependable commercial operations tool, not a promotional landing page.

## Core priorities

- Keep the main workflows focused: sign in, find/select products, review sale, start checkout, confirm outcome, view receipt, and check stock.
- Use responsive layouts that work at a shop counter on desktop/tablet and remain usable on a narrow phone screen.
- Establish clear hierarchy, readable type, comfortable touch targets, visible focus, strong contrast, and consistent spacing. Do not rely on color alone to communicate status.
- Prefer compact, scannable tables/lists for inventory and transaction history with sensible search, filters, and empty states. On small screens, reflow into readable rows/details rather than clipping critical information.
- Keep dashboards limited to decisions: confirmed sales, payment state, low stock, and recent activity. Label date range, currency, and pending versus confirmed totals.
- Show immediate feedback for actions, preserve context after validation errors, and provide a clear recovery route for network/provider failures.

## Payment and inventory states

Use distinct text/icon treatments for pending, confirmed, failed, expired, and reconciliation-required states. A customer return from Kora must remain pending until the API says verified. Explain what the user should do next without implying a failed or unknown payment is paid. Distinguish on-hand, reserved, and available stock; confirm manual adjustments and capture a reason. Prevent duplicate checkout submissions while preserving a retry path.

## Accessibility and trust

Target WCAG 2.2 AA contrast and keyboard operation for primary workflows. Use semantic forms/labels, announce async status changes to assistive technology, give validation errors beside fields, and avoid color-only indicators. Make totals and receipt details easy to inspect before confirmation. Display privacy-conscious receipt details; collect only data the shop actually needs.

## Visual direction

Use a restrained, warm-neutral foundation with a clear brand accent and accessible semantic status colors, applied consistently rather than as decoration. Use typography with legible numerals for prices and quantities. Reserve motion for small state transitions and loading feedback; honor reduced-motion preferences. Avoid clutter, excessive gradients, decorative animation, dense unexplained charts, and generic marketing-style hero sections.

## Phase 2 design system

The first frontend foundation uses a small token set in `apps/web/src/styles.css`:

- **Brand**: forest green (`#176545`) for primary actions, active navigation, and key chart values; the deeper green (`#104d35`) is reserved for hover and emphasis.
- **Neutrals**: warm green-tinted canvas (`#f4f6f2`), white surfaces, dark ink (`#1b2921`), muted supporting text, and low-contrast borders. Panels use a 10px radius and restrained shadow.
- **Semantic states**: success green, warning amber, danger muted red, and information blue. Pair each color with visible text; never make color the only status cue.
- **Typography**: Manrope for brand/display and compact numeric emphasis; DM Sans for interface text and data labels. Use tabular numerals for money and quantities.
- **Spacing**: use a consistent 4/8/12/16/24/32px rhythm. Keep page sections unframed; reserve surfaces for repeated operational panels and grouped data.

Buttons, labelled fields, cards, badges, stat summaries, tables, page headings, empty/error states, and loading feedback are shared primitives. Keep domain calculations and demo records outside presentation components. Add a component only when it makes a repeated interaction or visual rule more consistent; do not split simple markup into many tiny components.

The dashboard uses a persistent sidebar and compact top bar on desktop. On narrow screens, the sidebar becomes an explicit dismissible navigation drawer, summary figures use a two-column grid, content panels stack, and transaction rows reflow while retaining table semantics. Controls should retain stable touch targets and content must not require horizontal scrolling at phone widths.

Keyboard focus is visible, controls have accessible names, form labels are associated with inputs, status feedback uses live regions where appropriate, and reduced-motion preferences are respected. Use semantic landmarks and heading order. Check responsive behavior at phone, tablet, and desktop widths before expanding workflow functionality.

The landing page preview and dashboard are illustrative only. Demo labels must remain visible wherever sample business figures appear; never imply that sample payments or pharmacy records belong to real customers.

## UX validation

Before polishing, test the sale-to-receipt workflow with shop users or representative task walkthroughs. Verify that users can distinguish pending from paid, identify available stock, recover from a failed checkout, and find a receipt without technical assistance. Revisit labels and hierarchy based on observed confusion rather than adding explanatory paragraphs to every screen.
