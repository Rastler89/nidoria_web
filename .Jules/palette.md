# Palette's Journal

## 2024-05-23 - Form Field Accessibility Pattern
**Learning:** The `FormField` component was missing ID association, a critical accessibility gap. relying on implicit association or missing it entirely breaks screen reader support.
**Action:** Ensure all future form components use `useId` to link labels and inputs, and `aria-describedby` for errors.
