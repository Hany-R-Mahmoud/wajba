# Wajba Design System

## 1. Atmosphere & Identity

Wajba is a warm, practical kitchen companion: calm enough for planning, rich enough to make food feel inviting. Its signature is the contrast between dark charcoal navigation surfaces and amber/coral actions over soft paper-like backgrounds.

## 2. Color

| Role | Token | Light | Dark | Usage |
|------|------|------|------|------|
| Surface/primary | `--surface-primary` | `#f8f7f4` | `#0c1220` | App background |
| Surface/secondary | `--surface-secondary` | `#ffffff` | `#162032` | Cards and panels |
| Surface/muted | `--surface-muted` | `#eeece7` | `#1c2637` | Inputs and inactive controls |
| Text/primary | `--text-primary` | `#17171c` | `#f8fafc` | Main content |
| Text/secondary | `--text-secondary` | `#616161` | `#d6d3d1` | Supporting copy |
| Border/default | `--border-default` | `#d9d9dd` | `#2b3a54` | Card and control borders |
| Accent/primary | `--accent-primary` | `#ff7759` | `#ff7759` | Interactive emphasis |
| Accent/warm | `--accent-warm` | `#b45309` | `#f59e0b` | Planning and food actions |
| Status/success | `--status-success` | `#059669` | `#34d399` | Saved and covered states |
| Status/warning | `--status-warning` | `#d97706` | `#fbbf24` | Pantry and sync cautions |
| Status/error | `--status-error` | `#be123c` | `#fb7185` | Validation and destructive states |

Accent colors are reserved for actions, status, and meaningful food/planning emphasis.

## 3. Typography

The existing app uses the system sans stack for readable Arabic/English body copy and a monospace accent for compact metadata and controls.

| Level | Size | Weight | Usage |
|------|------|--------|------|
| Display | 36px | 700 | Landing and primary hero |
| H1 | 30px | 700 | View headings |
| H2 | 22px | 700 | Section headings |
| H3 | 18px | 700 | Card and modal headings |
| Body | 16px | 400 | Main copy and form values |
| Body/sm | 14px | 400 | Supporting copy |
| Caption | 12px | 500 | Metadata and compact controls |

Primary: `ui-sans-serif, system-ui, sans-serif`. Metadata: `ui-monospace, SFMono-Regular, monospace`.

## 4. Spacing & Layout

Spacing follows a 4px base unit. Existing Tailwind spacing values are preserved. The main content uses a 1280px maximum width with responsive 16px/24px/32px gutters. Breakpoints remain `sm 640px`, `md 768px`, `lg 1024px`, and `xl 1280px`.

## 5. Components

### Navigation

- Structure: sticky header, brand, desktop tab row, mobile fixed bottom navigation, utility controls, and a compact secondary-destination menu.
- States: default, active, hover, focus-visible.
- Accessibility: semantic `nav`, labelled controls, keyboard reachability, `aria-current` for the active destination, and safe-area padding on mobile.

### Modal

- Structure: backdrop, labelled dialog, header, scrollable content, footer actions.
- States: default, validation, loading, error.
- Accessibility: `role="dialog"`, `aria-modal`, Escape close, focus return.

### Status message

- Structure: compact alert region with icon, message, optional action.
- Variants: success, warning, error, info.
- Accessibility: `role="status"` for success/info and `role="alert"` for errors.

### Data card

- Structure: optional image/header, content, metadata, actions.
- States: default, hover, focus, empty.
- Layout: responsive grid or stacked list.

## 6. Motion & Interaction

Use existing short transitions for tabs, cards, and modals. Animate only transform and opacity. Respect `prefers-reduced-motion` by disabling non-essential transitions, pulse, bounce, and confetti.

## 7. Depth & Surface

Wajba uses mixed depth: thin borders for structure, tonal shifts for panels, and restrained shadows for modals and active planning controls. Avoid adding new decorative gradients or unrelated surface treatments.

## 8. Accessibility Constraints & Accepted Debt

- Target WCAG 2.2 AA.
- Maintain visible focus, readable contrast, labelled inputs, keyboard operation, RTL/LTR parity, and reduced-motion support.
- Accepted debt: remote Unsplash images and Google Fonts remain external because they are existing content boundaries; local fallback rendering must continue when unavailable.
