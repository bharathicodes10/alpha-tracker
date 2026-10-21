# Contact Table & Board Prototype

A responsive Notion/Linear-inspired contact workspace prototype built with **React**, **TypeScript**, and **Tailwind CSS**. It provides dual synchronized views (Table and Kanban Board) powered by a single centralized source of truth.

- **Live Demo:** will be updated soon
- **Repository:** https://github.com/bharathicodes10/alpha-contact-tracker

---

## Architecture & Implementation Overview

1. **Single Source of Truth:**
   Both Table and Board views derive directly from a single local `contacts` state array. Updating a contact's stage or notes from either view immediately synchronizes across both interfaces without stale states or duplicated records.

2. **Shared Details Drawer:**
   Clicking any row in the Table or card on the Board opens a non-destructive slide-over panel. Changes to pipeline stage or interaction notes are staged in a local draft state with dirty tracking (`hasUnsavedChanges`), allowing users to explicitly **Save Changes** or **Cancel/Discard**.

3. **Defensive Edge Case Handling:**
   - **Empty Group:** The *Customer* stage starts empty to demonstrate empty-state UX with clear contextual guidance.
   - **Missing Data:** Seamlessly handles contacts with missing notes (italic placeholder fallbacks) or empty label arrays without breaking visual rhythm or layout height.
   - **Accessibility & Keyboard:** The drawer can be dismissed immediately via the `Escape` key, and closing with unsaved changes prompts for user confirmation.

---

## Design Choices & Information Hierarchy

- **Table View:** Prioritized horizontal scanning density. High-signal columns (Name, Company, Stage, Owner) are anchored upfront, with lighter metadata (labels and notes preview) truncated to maintain uniform row height.
- **Board View:** Emphasized stage distribution. Cards display essential context (Name, Role, Company, Owner badge) and an excerpt of interaction notes so operators can quickly gauge account sentiment without opening the record.
- **Details Drawer:** Kept identity fields (Company, Role, Owner, Labels) in a read-only metadata grid to prevent accidental edits, while keeping high-frequency operational fields (Stage dropdown, Notes textarea) prominent and editable.

---

## Trade-offs

- **Local State vs. State Management Library:** To keep the prototype lightweight and within the recommended 3–4 hour scope, native React `useState` and derived state were used rather than introducing external libraries like Zustand or Redux.
- **Click-to-Move vs. Drag-and-Drop:** Implemented stage progression via the details panel and dropdown rather than adding heavy drag-and-drop primitives (e.g., `@dnd-kit`), ensuring rock-solid keyboard navigation, mobile touch safety, and deterministic state transitions.

---

## What I Would Improve Next

1. **Fluid Drag-and-Drop:** Implement pointer-friendly card dragging across board columns with optimistic UI updates.
2. **Keyboard Navigation Shortcuts:** Add Linear-style `j`/`k` keyboard shortcuts to navigate up/down rows and open records instantly with `Enter`.
3. **Filtering & Full-Text Search:** Introduce a global search bar to instantly query contacts by name, company, or label across both views.
