# MIS-37 Implementation Plan: Integration Login API

## Resolved decisions
- **Registration flow**: Keep localStorage registration (current behavior). No changes to `src/Register.js`.
- **Token refresh**: Defer to a future story. No refresh logic will be implemented now.
- **Dashboard profile data**: Decode `accessToken` payload for name/email. No separate `/auth/me` call will be made.

## Context Budget
Implementation is strictly scoped to four files: `src/Login.js`, `src/App.js`, `src/Dashboard.js`, and `src/App.css`. The implementer should not perform full repository reads. All modifications are localized to the target files, and the spec's provided code snippets and UI notes are sufficient to complete the task.

## Files to Touch
- `src/Login.js` (Modify)
- `src/App.js` (Modify)
- `src/Dashboard.js` (Modify)
- `src/App.css` (Modify)

## Implementation Steps

### Step 1: Modify Login Form (`src/Login.js`)
1. **Add loading and error state**:
   Initialize state variables to track request in-flight and display API errors:
   ```js
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);
   ```
2. **Replace `handleSubmit` with API integration**:
   Overwrite the existing `handleSubmit` function with the async fetch logic. Ensure the "email" input field state is mapped to the `username` key in the JSON payload as specified:
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

       toast.success(`Welcome, ${data.firstName}!`);
       navigate("/dashboard");
     } catch (err) {
       setError(err.message || "An error occurred during login.");
     } finally {
       setLoading(false);
     }
   };
   ```
3. **Update submit button UI**:
   - Disable the submit button when `loading` is `true`.
   - Render button text as `"Signing in..."` when loading, otherwise preserve the existing label (e.g., `"Sign In"`).
4. **Add inline error banner**:
   Insert the following JSX block immediately above the submit button:
   ```jsx
   {error && (
     <div className="login-error" role="alert">
       {error}
     </div>
   )}
   ```

### Step 2: Update Auth Guard (`src/App.js`)
1. **Swap authentication check**:
   Locate the `isAuthenticated` variable declaration:
   ```js
   const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
   ```
   Replace it with:
   ```js
   const isAuthenticated = !!localStorage.getItem("accessToken");
   ```
   *(Assumption: Token expiration is not enforced in this story. A simple existence check satisfies the routing guard requirements.)*

### Step 3: Update Dashboard (`src/Dashboard.js`)
1. **Read and decode token on mount**:
   Use `useEffect` to read `accessToken` from `localStorage` and decode the JWT payload manually to extract `firstName`, `lastName`, and `email`. Implement a safe base64url decoder to avoid adding external libraries:
   ```js
   const decodeJwtPayload = (token) => {
     try {
       const base64Url = token.split(".")[1];
       const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
       const jsonPayload = decodeURIComponent(
         window
           .atob(base64)
           .split("")
           .map((c) => {
             return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
           })
           .join("")
       );
       return JSON.parse(jsonPayload);
     } catch {
       return null;
     }
   };
   ```
2. **Display user identity**:
   Render the decoded `firstName` and `lastName` (or `email`) in the dashboard view.
3. **Handle missing/invalid tokens**:
   If the token is missing or decoding fails, use `useNavigate()` to redirect the user back to `/login`.

### Step 4: Add Error Styles (`src/App.css`)
1. **Append CSS rule**:
   Add the following style block to `src/App.css` to match the project's existing plain-CSS BEM-ish naming convention:
   ```css
   .login-error {
     color: #a94442;
     background-color: #f2dede;
     border: 1px solid #ebccd1;
     border-radius: 4px;
     padding: 10px 15px;
     margin-bottom: 15px;
     text-align: center;
   }
   ```

## Risks
- **JWT Decoding**: Manually decoding base64url requires correct padding and character replacement (`-` to `+`, `_` to `/`). The provided helper handles this, but malformed tokens will throw safely into the catch block and trigger a redirect.
- **Toast Container Scope**: `ToastContainer` in `App.js` wraps the `Routes`, ensuring toasts remain mounted across navigations. No structural changes to the toast setup are required.
- **State Drift**: Because `isAuthenticated` was previously used, any existing browser localStorage entries will automatically migrate upon successful login since only `accessToken` presence is required moving forward.

## Open Questions
{"clarification": {"needed": false, "questions": [], "assumptions": [{"statement": "JWT decoding will be handled natively in the browser using base64url decoding logic, avoiding external dependencies.", "risk": "low"}, {"statement": "The 'email' input field on the login form will be mapped directly to the 'username' parameter in the dummyjson.com API request body.", "risk": "low"}, {"statement": "User profile data for the dashboard will be extracted by decoding the accessToken payload rather than making an additional /auth/me API call.", "risk": "low"}, {"statement": "Token expiration is not explicitly checked; the presence of an accessToken in localStorage is treated as valid auth for this story.", "risk": "low"}]}}
