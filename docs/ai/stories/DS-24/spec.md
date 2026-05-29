# DS-24: Logs Module

## Title
Logs Module

## Description
After login, show Logs link in the sidebar. Upon clicking logs link, open Logs page.
Show table with mock data and client side search and pagination.
Only frontend changes. No backend integrations.

## Requirements
1. Add "Logs" nav item to the sidebar (icon: `fa-solid fa-scroll` or appropriate log icon)
2. Create `Logs.js` component at `src/Logs.js` with:
   - Mock log entries (id, timestamp, level, source, message fields)
   - Client-side search across all fields
   - Client-side pagination (matching Customers.js pattern)
3. Add `/logs` route in `App.js` (authenticated route)
4. Add CSS styles in `App.css` with `logs-*` prefixed class names (matching existing pattern)
5. Create `Logs.test.js` with tests matching Orders.test.js patterns (render, search, no-results)

## Mock Data (at least 12 entries for meaningful pagination)
Fields: id (LOG-001 format), timestamp, level (INFO/WARN/ERROR/DEBUG), source, message

## Constraints
- Plain CSS only (no CSS frameworks)
- No react-router nav (pushState is used, but existing pattern uses react-router-dom)
- Follow existing page patterns (Orders.js or Customers.js)
- No backend calls
