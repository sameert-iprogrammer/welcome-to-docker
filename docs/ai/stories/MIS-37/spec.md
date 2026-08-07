# Story: MIS-37 — Integration Login API

## Summary

Replace the current `localStorage`-based mock login in `src/Login.js` with a real integration to the dummyjson.com authentication endpoint. On successful authentication, the application should receive and store an `accessToken` and `refreshToken`, and update the auth state accordingly. The existing dashboard and protected routes will rely on token presence rather than `localStorage.getItem("isAuthenticated")`.

## Requirements

### Functional
- Login form (email/password) submits to `https://dummyjson.com/auth/login` via `POST` with `Content-Type: application/json`.
- On success:
  - Extract `accessToken`, `refreshToken`, `username`, and profile fields (`firstName`, `lastName`, `email`, `image`) from the response.
  - Persist `accessToken` and `refreshToken` (localStorage recommended for consistency with existing patterns).
  - Set the app's authentication state so that `/dashboard` and protected routes become accessible.
  - Display a success toast and navigate to `/dashboard`.
- On failure (non-2xx response, network error, or validation error from the API):
  - Display an error message in-line on the login form.
  - Keep the user on the login page.
- The existing "Register" and "Privacy Policy" links on the login page remain functional.

### Non-functional
- Keep the UI structure of `Login.js` unchanged — only modify `handleSubmit` and add any new state/props required for token handling.
- Preserve the existing `react-toastify` integration for success/error toasts.
- Maintain accessibility attributes (`aria-label`, `role`, `onKeyDown`) as currently present.
- No new external libraries or CSS files.

## UI Notes

- **Login form** (`src/Login.js`):
  - Keep the existing two-field layout (email + password).
  - The API uses `username` + `password` in the body — map the "email" input to `username` in the payload.
  - Add an inline error banner (`className: "login-error"`) above the submit button, rendered when an error occurs.
  - Show a spinner or disable the submit button while the request is in flight.
- **Dashboard** (`src/Dashboard.js`): On mount, display the logged-in user's name and/or email from the token payload. If the token is missing/invalid, redirect to `/login`.

## Implementation Notes

### File changes

1. **`src/Login.js`**
   - Add state: `error` (string or null), `loading` (boolean), `user` (object or null).
   - Replace the localStorage auth block in `handleSubmit` with:
     ```js
     const handleSubmit = async (e) => {
       e.preventDefault();
       setLoading(true);
       setError(null);
       try {
         const res = await fetch("https://dummyjson.com/auth/login", {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({ username: email, password }),
         });
         const data = await res.json();
         if (!res.ok) throw new Error(data.message || "Login failed");
         localStorage.setItem("accessToken", data.accessToken);
         localStorage.setItem("refreshToken", data.refreshToken);
         setUser({
           name: `${data.firstName} ${data.lastName}`,
           email: data.email,
         });
         toast.success(`Welcome, ${data.firstName}!`);
         navigate("/dashboard");
       } catch (err) {
         setError(err.message || "An error occurred during login.");
       } finally {
         setLoading(false);
       }
     };
     ```
   - Render `<div className="login-error">{error}</div>` above the submit button.
   - Disable the submit button when `loading` is true; show text "Signing in..." instead.

2. **`src/App.js`**
   - Replace `localStorage.getItem("isAuthenticated") === "true"` in the auth guard with a check for `localStorage.getItem("accessToken")`.
   - (Optionally) add a helper `isAuthenticated()` that also validates token expiry if needed.

3. **`src/Dashboard.js`**
   - On mount, read `accessToken` from localStorage and parse its payload (or use `user` state passed from `App.js` via props/context) to display the user's name.

4. **`src/App.css`**
   - Add styles for `.login-error` (e.g., red text, small margin).

### Token handling

- Store tokens in `localStorage` under keys `accessToken` and `refreshToken`.
- The auth guard (`App.js`) checks `localStorage.getItem("accessToken")` to decide redirect.
- For this story, token refresh is out of scope. If the token expires, the user is logged out and redirected to `/login`.

## Assumptions

| # | Assumption | Rationale |
|---|------------|-----------|
| A1 | The "email" input field is mapped to the `username` parameter in the API body. | The dummyjson.com API expects `username`; the existing form only has an email field. |
| A2 | Tokens are stored in `localStorage`, not in HttpOnly cookies. | The current app already uses `localStorage` for auth state; cookies require server-side `credentials: "include"` handling which this SPA cannot control for subsequent API calls. |
| A3 | The registration flow (`/register`) is preserved and unaffected by this story. | The story title and description only mention login API integration. |
| A4 | Existing localStorage data (`registeredUsers`) is preserved and not migrated. | No migration plan is described; the new flow replaces only the login mechanism. |
| A5 | Token expiry is not implemented in this story — expired tokens are treated as missing. | Adding refresh logic expands scope beyond "integration login API." |
| A6 | The API base URL is always `https://dummyjson.com`; no environment variable for it. | The story provides a hardcoded URL; no config mechanism is described. |

## Open Questions

```json
{"clarification": {"needed": true, "questions": [{"id": "q1", "question": "Should the registration flow be replaced with an API-based registration endpoint, or kept as the existing localStorage mock?", "whyItMatters": "Determines whether src/Register.js needs modifications in this story.", "impactIfWrong": "If changes are expected but not made, registration will fail when users try it after login is API-based; if changes are not expected but made, work is wasted.", "options": [{"key": "keep_mock", "label": "Keep localStorage registration (current behavior)", "consequence": "No changes to Register.js; registration continues to work with mock data."}, {"key": "replace_with_api", "label": "Replace with dummyjson registration API", "consequence": "Register.js needs a new POST to a registration endpoint; adds scope."}], "default": "keep_mock", "allowFreeText": true, "blocking": true}, {"id": "q2", "question": "Should token refresh logic be included in this story or deferred to a follow-up?", "whyItMatters": "Without refresh, users will be logged out when the access token expires (~60 min).", "impactIfWrong": "Users lose sessions unexpectedly without refresh; or unnecessary complexity is added now.", "options": [{"key": "defer", "label": "Defer to a future story", "consequence": "Simpler first story; users may need to re-login after ~60 min."}, {"key": "include", "label": "Include refresh logic now", "consequence": "More complex implementation; better UX; larger story."}], "default": "defer", "allowFreeText": true, "blocking": false}, {"id": "q3", "question": "Should the dashboard display user profile data fetched from the token (decoded) or from a separate API call?", "whyItMatters": "Decoding the JWT adds no dependencies but may not include all profile fields; a separate call adds a dependency.", "impactIfWrong": "If we expect more fields (avatar, bio), decoding the JWT alone is insufficient; if we only need name/email, decoding is fine.", "options": [{"key": "decode_jwt", "label": "Decode accessToken payload for name/email", "consequence": "No extra calls; limited to JWT claims."}, {"key": "separate_call", "label": "Call /auth/me or similar for full profile", "consequence": "Extra API call; more complete profile display."}], "default": "decode_jwt", "allowFreeText": true, "blocking": false}], "assumptions": [{"statement": "The 'email' input on the login form maps to the 'username' parameter in the dummyjson.com login API body.", "risk": "low"}, {"statement": "Tokens are stored in localStorage rather than HttpOnly cookies.", "risk": "low"}, {"statement": "The registration flow and all other features remain unchanged.", "risk": "low"}]}}
```
