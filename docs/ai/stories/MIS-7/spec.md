# Specification for Story MIS-7: Implement FAQ Modal

## Overview
Implement an FAQ modal that appears on the login and registration pages when users click a "FAQ" link. The modal should display mock FAQs with accordion functionality and not involve any backend API calls.

## Requirements

### Functional Requirements
1. **FAQ Link Placement**
   - Add a "FAQ" link in the footer section of both Login and Register pages
   - The link should appear below existing links like Privacy Policy and Terms & Conditions
   - The link should be styled consistently with other footer links

2. **Modal Implementation**
   - Clicking the FAQ link should open a modal dialog
   - The modal should contain a list of mock FAQ items with accordion functionality
   - Each FAQ item should have a question and answer section
   - Only one FAQ item can be open at a time
   - Clicking a question should toggle its corresponding answer

3. **Content**
   - Use existing mock FAQ data from the FAQ component
   - Display questions and answers in an accordion format
   - Maintain the existing styling approach using Font Awesome icons for chevrons

### Technical Requirements
1. **Frontend Only**
   - No backend API calls
   - All data should be client-side only
   - Reuse existing component patterns from the codebase

2. **Component Structure**
   - Create a reusable FAQModal component
   - The modal should be displayed conditionally based on state
   - Use existing CSS classes and styling conventions
   - Follow BEM naming convention for CSS classes

3. **Navigation**
   - The modal should be accessible via the FAQ link on both Login and Register pages
   - Modal should close when clicking outside or pressing Escape key

## Acceptance Criteria
1. FAQ link is visible on both Login and Register pages
2. Clicking the FAQ link opens a modal dialog
3. Modal displays the mock FAQ items with accordion functionality
4. Only one FAQ item is open at a time
5. Modal can be closed by clicking the close button or pressing Escape
6. No backend API calls are made
7. All existing functionality remains intact

## UI Notes
- The FAQ link should be styled as a "register-link-action" similar to Privacy Policy and Terms & Conditions links
- The modal should be centered on screen with appropriate spacing
- Accordion should use Font Awesome chevron-down icon that rotates when expanded
- Modal should have a close button in top-right corner
- Use existing color scheme and styling conventions

## Implementation Notes
- Reuse existing FAQ data from the FAQ component
- Create a new FAQModal component that can be shared between Login and Register
- Utilize existing state management patterns (useState)
- Follow existing CSS structure and class naming conventions
- Modal should be implemented using standard HTML elements with CSS for styling

## Open Questions
1. Should the modal be dismissed by clicking outside the modal content?
2. What keyboard accessibility features are required beyond Escape key?
3. Is there a preferred animation or transition effect for modal opening?

## Assumptions
1. The existing FAQ component contains the necessary mock data
2. The project uses Font Awesome icons for UI elements
3. The existing CSS framework supports the required styling patterns
4. Modal dismissal can be handled through state management
5. Users will primarily interact with the FAQ modal through clicks