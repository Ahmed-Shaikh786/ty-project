# TY Board Exam Project — Complaint & Service Request Management System

This project has **two parts**:

- **frontend/**: Expo (React Native) app (User + Admin screens)
- **backend/**: Node.js/Express API + MySQL database

## 1) Run locally (fast demo)

### Backend
1. Create DB tables using: `database/schema.sql`
2. Copy `backend/.env.example` → `backend/.env` and fill DB details
3. Run:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

### Frontend (Android phone with Expo Go)
1. Copy `frontend/.env.example` → `frontend/.env`
2. Set `EXPO_PUBLIC_API_URL`:
   - Android Emulator: `http://10.0.2.2:5000`
   - Real phone: `http://<YOUR_LAPTOP_IP>:5000`
3. Run:
   ```bash
   cd frontend
   npm install
   npx expo start --lan
   ```

## 2) Show LIVE to external (recommended)

- Deploy **backend + MySQL** on Railway (or any hosting)
- Set `EXPO_PUBLIC_API_URL` in frontend to the deployed backend URL
- Export web build and host on Netlify:
  ```bash
  cd frontend
  npx expo export -p web
  ```
  Upload the `dist/` folder to Netlify.

## Admin
Register a normal user, then run in MySQL:
```sql
UPDATE users SET role='admin' WHERE email='youradminemail@example.com';
```
