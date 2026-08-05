# MIS-30: Implement Sessions Page

## 1. Story Overview

**JIRA Key**: MIS-30
**Title**: Implement Sessions Page
**Priority**: To be assigned
**Assignee**: To be assigned

## 2. Description

Add a Sessions page accessible after login. This page will display user session information in a table format, following the established patterns used by other management pages in the application (Customers, Orders, Masters).

## 3. Acceptance Criteria

### 3.1. Page Access & Routing
- [ ] A `/sessions` route exists in the application
- [ ] The route is protected and only accessible when the user is authenticated (localStorage `isAuthenticated` === `"true"`)
- [ ] Accessing `/sessions` without authentication redirects to `/login`
- [ ] A navigation link to Sessions exists in the sidebar or navbar (consistent with existing pages)

### 3.2. Page Layout & Structure
- [ ] The Sessions page follows the same layout pattern as Customers, Orders, and Masters pages
- [ ] The page includes a header with title "Sessions"
- [ ] The page includes a search input with placeholder text "Search sessions..."
- [ ] The page includes a table displaying session data
- [ ] The page includes pagination controls
- [ ] The page uses the standard layout wrapper (`App App--sidebar` structure with Sidebar component)

### 3.3. Data Display
- [ ] The table displays the following columns at minimum:
  - Session ID
  - User (username or email)
  - Login Time
  - Logout Time (or "Active" if still logged in)
  - Device/Platform (optional)
- [ ] Data is initially populated from a mock data file (`sessionsMock.js`)
- [ ] The default page size is 5 items per page (consistent with existing pages)
- [ ] Pagination shows "Page X of Y" text

### 3.4. Search & Filtering
- [ ] The search input filters sessions by any text content (case-insensitive)
- [ ] Search filters across all displayed columns
- [ ] Searching resets to page 1
- [ ] When no results match, display a "No sessions found" message

### 3.5. Pagination
- [ ] Pagination controls allow moving between pages
- [ ] "Previous" button is disabled on page 1
- [ ] "Next" button is disabled on the last page
- [ ] Clicking "Next" advances one page
- [ ] Clicking "Previous" moves back one page

### 3.6. Styling
- [ ] All styles are added to `src/App.css` (no new CSS files)
- [ ] Class names follow BEM-ish convention (e.g., `.sessions-container`, `.sessions-table`, `.sessions-header`)
- [ ] The page uses the same styling patterns as Customers, Orders, and Masters pages

## 4. UI Notes

### 4.1. Visual Design
- Follow the existing visual language of management pages
- Use the same table styling as `Orders` and `Customers` pages
- Use Font Awesome icons via CDN where appropriate (consistent with existing usage)
- Maintain consistent spacing and typography with other pages

### 4.2. Mock Data Structure
The sessions mock data should follow this structure:
```javascript
{
  id: number,
  user: string,
  loginTime: string (ISO format or similar),
  logoutTime: string | null,
  device: string (optional)
}
```

### 4.3. Navigation Integration
- Add a "Sessions" link to the sidebar alongside existing items (Dashboard, Orders, Customers, Masters)
- Use consistent icon styling with Font Awesome

## 5. Implementation Notes

### 5.1. Files to Create/Modify
1. **New files:**
   - `src/Sessions.js` - Main component
   - `src/Sessions.test.js` - Test file
   - `src/sessionsMock.js` - Mock data (following pattern of `productsMock.js`, `mastersMock.js`)

2. **Modified files:**
   - `src/App.js` - Add `/sessions` route
   - `src/Sidebar.js` - Add Sessions navigation link
   - `src/App.css` - Add Sessions-specific styles

### 5.2. Component Pattern
Follow the established pattern from `src/Customers.js` or `src/Masters.js`:
- Functional component with default export
- Uses `useState` for local state (search term, current page, data array, modal state)
- Uses `useMemo` for filtered data calculation
- Uses `useEffect` to reset page on search change
- Includes `handleOpenModal`, `handleCloseModal`, `handleFormChange`, `handleSave` methods (if modal CRUD is required)

### 5.3. Routing
Add to `src/App.js` Routes:
```jsx
<Route path="/sessions" element={<Sessions />} />
```

### 5.4. Testing
- Create `src/Sessions.test.js` alongside `src/Sessions.js`
- Follow the test pattern from `src/Masters.test.js`:
  - Smoke test (renders without crashing)
  - Renders table rows
  - Filters by search term
  - Shows no results message
  - Tests pagination controls

## 6. Open Questions

None identified at this time. All requirements can be implemented using existing patterns.

## 7. Assumptions

1. **Session Data Model**: Sessions will store user login/logout information with at minimum: ID, user identifier, login time, logout time (or null for active), and optionally device/platform. This is inferred from the concept of "sessions" in a web application context.

2. **Mock Data Only**: Following the project's existing pattern (localStorage mock auth, no backend), the Sessions page will use mock data from a `sessionsMock.js` file, similar to `productsMock.js` and `mastersMock.js`.

3. **No CRUD Operations**: Unlike Customers and Orders pages which have full CRUD (add/edit/delete), the Sessions page will be read-only display, as sessions are typically viewed rather than manually created. This is an assumption based on the nature of session data. If edit/delete is required, this assumption needs revision.

4. **Default Page Size**: Using 5 items per page, consistent with the existing `PAGE_SIZE` constant used in `Customers.js` and `Masters.js`.

5. **Authentication State**: The page will check the same `isAuthenticated` localStorage key that other pages use for authentication.

6. **Sidebar Integration**: A "Sessions" link will be added to the existing Sidebar component, following the same structure as other menu items.

7. **No Real-Time Updates**: Since the project uses localStorage and has no backend, sessions will not be real-time. The mock data will represent a static snapshot.

## 8. References

- **Existing Management Pages**: `src/Customers.js`, `src/Orders.js`, `src/Masters.js` - reference implementations for table/list pages
- **Project Context**: `IFLOW.md` - architecture rules, styling conventions, routing patterns
- **Context Map**: `docs/ai/context-map.json` - known routing paths and project structure
- **Governance**: `.opencode/agents/governance-agent.md` - full project constraints
