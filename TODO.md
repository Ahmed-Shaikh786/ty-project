# TODO — What to Do Next

This file lists concrete, actionable improvements for the TY Board Exam Project.
Work through them in order — higher items have more impact on demo quality.

---

## 🔴 High Priority (fix before the demo)

### 1. Show the logged-in user's name on the User Panel
**File:** `frontend/app/user-panel.jsx`  
**Problem:** The screen always displays "Welcome, User" instead of the real name.  
**Fix (Option A — modify the backend):** Update the login route in
`backend/routes/auth.js` to return `{ token, name }` alongside the JWT, then save the
name in `AsyncStorage` at login time.

```js
// backend/routes/auth.js — change the login response to include name:
res.json({ token, name: users[0].name });

// frontend/app/user-login.jsx — after saving the token, also save the name:
const { token, name } = await response.json();
await AsyncStorage.setItem("token", token);
await AsyncStorage.setItem("userName", name);

// frontend/app/user-panel.jsx:
const [userName, setUserName] = useState("");
useEffect(() => {
  AsyncStorage.getItem("userName").then(setUserName);
}, []);
// Then render:  <Text>Welcome, {userName || "User"}</Text>
```

**Fix (Option B — decode the JWT on the client):** The JWT payload already contains
`id` and `role`. You can add `name` to it or call a new `GET /api/auth/me` endpoint
(see item 11) after login to fetch the user's profile without changing the login
response shape.

---

### 2. Add "My Complaints" and "My Service Requests" buttons to the User Panel
**File:** `frontend/app/user-panel.jsx`  
**Problem:** Users can submit complaints/requests but cannot view them.  
**Fix:** Add two more buttons that navigate to list screens showing only the current
user's submissions. The backend routes already exist (`GET /api/complaints` and
`GET /api/service-requests`).

---

### 3. Replace `axios` with `fetch` in user-login.jsx (consistency)
**File:** `frontend/app/user-login.jsx`  
**Problem:** Every other screen uses the native `fetch` API; only the login screen
imports `axios`. This adds an unnecessary dependency.  
**Fix:** Replace the `axios.post(...)` call with `fetch(...)` matching the pattern used
in `user-register.jsx` and `complaint-screen.jsx`.

---

### 4. Add loading indicators to all screens
**Files:** `frontend/app/complaint-screen.jsx`, `service-request.jsx`, `user-login.jsx`,
`user-register.jsx`, `admin-complaints.jsx`, `admin-service-requests.jsx`,
`admin-notice-board.jsx`  
**Problem:** There is no visual feedback while an API call is in progress. On a slow
connection the user may tap the button multiple times.  
**Fix:** Add an `isLoading` state, disable the button while loading, and show an
`ActivityIndicator`.

```js
const [isLoading, setIsLoading] = useState(false);
// Wrap the API call:
setIsLoading(true);
try { /* ... */ } finally { setIsLoading(false); }
// In JSX:
{isLoading ? <ActivityIndicator /> : <Button title="Submit" onPress={submit} />}
```

---

### 5. Handle expired / missing JWT token gracefully
**Files:** `frontend/app/complaint-screen.jsx`, `service-request.jsx`,
`admin-complaints.jsx`, `admin-service-requests.jsx`  
**Problem:** If the JWT expires (1-hour lifetime) or the token is missing from
`AsyncStorage`, the API returns 401. The screens show a generic error or silently fail.  
**Fix:** In each API call, check `response.status === 401` and redirect the user to the
login screen.

```js
if (response.status === 401) {
  await AsyncStorage.multiRemove(["token", "role", "userName"]);
  router.replace("/user-login");
  return;
}
```

---

## 🟡 Medium Priority (polish for the demo)

### 6. Add StyleSheet to user-login.jsx and user-register.jsx
**Files:** `frontend/app/user-login.jsx`, `frontend/app/user-register.jsx`  
**Problem:** Both screens use inline style objects, while every other screen uses
`StyleSheet.create(...)`. Inline styles re-create objects on every render.  
**Fix:** Extract styles into a `StyleSheet` at the bottom of each file, matching the
pattern in `complaint-screen.jsx`.

---

### 7. Remove duplicate HTTP library (`bcrypt` vs `bcryptjs`)
**File:** `backend/package.json`  
**Problem:** Both `bcrypt` (native C++ binding) and `bcryptjs` (pure JS) are listed as
dependencies. The code only uses `bcryptjs` (`require("bcryptjs")`).  
**Fix:** Remove `bcrypt` from `backend/package.json` and run `npm install` in the
`backend/` folder.

```bash
cd backend
npm uninstall bcrypt
```

---

### 8. Validate complaint category against a fixed list (frontend + backend)
**Files:** `frontend/app/complaint-screen.jsx`, `backend/routes/complaints.js`  
**Problem:** The category field is a free-text input, so any string is accepted (e.g.
"asdf"). During the demo, a dropdown makes the submission look more professional and
prevents junk data.  
**Fix (frontend):** Replace the `TextInput` for category with a `Picker` (or a row of
`TouchableOpacity` buttons) showing options such as: Infrastructure, Sanitation,
Electrical, Internet, Other.  
**Fix (backend):** Optionally add a validation check in the POST `/api/complaints`
route.

---

### 9. Show empty-state messages in list screens
**Files:** `frontend/app/admin-complaints.jsx`, `admin-service-requests.jsx`  
**Problem:** When there are no records, `FlatList` renders nothing — the screen looks
broken.  
**Fix:** Pass a `ListEmptyComponent` to `FlatList`:

```jsx
<FlatList
  data={complaints}
  keyExtractor={(item) => item.id.toString()}
  renderItem={renderItem}
  ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 40 }}>No records found.</Text>}
/>
```

---

### 10. Add a "Refresh" pull-to-refresh gesture on list screens
**Files:** `frontend/app/admin-complaints.jsx`, `admin-service-requests.jsx`  
**Problem:** The only way to refresh the list is to navigate away and come back.  
**Fix:** Use `FlatList`'s `refreshing` and `onRefresh` props:

```jsx
const [refreshing, setRefreshing] = useState(false);
const onRefresh = async () => {
  setRefreshing(true);
  await loadComplaints();
  setRefreshing(false);
};
// In JSX:
<FlatList refreshing={refreshing} onRefresh={onRefresh} ... />
```

---

## 🟢 Nice to Have (extra credit)

### 11. Add a `GET /api/auth/me` endpoint to return the logged-in user's profile
**File:** `backend/routes/auth.js`  
**Use case:** Lets the frontend fetch the current user's name and role without
storing them separately in `AsyncStorage`. Useful for step 1 (show real user name).

### 12. Deploy the backend so the demo works without a laptop on the same network
**Suggested platform:** Railway (free tier, supports MySQL)  
**Steps:**
1. Push the `backend/` folder to a GitHub repo (or use this one).
2. Connect Railway to the repo and set the environment variables from `.env.example`.
3. Update `EXPO_PUBLIC_API_URL` in `frontend/.env` to the Railway URL.
4. Export the Expo web build (`npx expo export -p web`) and host it on Netlify.

### 13. Write at least one integration test for the backend
**File:** create `backend/tests/auth.test.js`  
**Suggested tool:** `jest` + `supertest`  
**What to test:** Register → Login → verify token is returned.

---

## ✅ Already Done

- Backend API with full CRUD for complaints, service requests, and notices ✔
- JWT authentication (register + login) ✔
- Role-based access control (user / admin) ✔
- Admin screens for managing complaints, service requests, and notices ✔
- Animated notice bar on the user panel ✔
- Database schema (`schema.sql`) ✔
- API collections reference (`auravybe-collections.txt`) ✔
- `README.md` with local setup and deployment instructions ✔
- `BOARD_DEMO.md` with 9-step demo script ✔
