# MediDesk

**Smart & Secure Healthcare Management Platform**

MediDesk is a responsive React + Vite healthcare workspace with patient, doctor, and admin-ready role-aware UI plus an Express/Mongoose API foundation. The interface includes a public marketing site, authentication, dashboard, appointment management, profile and security surfaces.

## Run locally

```bash
npm install
cp .env.example .env
npm run dev
```

The Vite client runs on `http://localhost:3000` and the API on `http://localhost:4000`.

The client remains useful in demo mode without MongoDB: use any email on the sign-in page. Emails containing `doctor` or `admin` preview those roles.

## Environment

Set `MONGODB_URI` to a MongoDB Atlas connection string for persistence. Set a long random `JWT_SECRET` for production. `CLIENT_ORIGIN` should match the deployed frontend origin.

## API surface

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password/:token`
- `POST /api/auth/request-otp`
- `POST /api/auth/verify-otp`
- `GET /api/appointments`
- `POST /api/appointments`
- `PATCH /api/appointments/:id/status`
- `PATCH /api/profile`
- `GET /api/admin/users`
- `GET /api/health`

Protected routes use `Authorization: Bearer <token>`. Roles are `Patient`, `Doctor`, and `Admin`.

The frontend sign-in screen now includes separate **Patient**, **Doctor**, and **Admin** workspace selectors. Preview mode pre-fills `alex@medidesk.health`, `doctor@medidesk.health`, or `admin@medidesk.health`; when MongoDB is connected, replace these with real role accounts.

## AI care assistant

The frontend includes a floating **Clara** care assistant with quick actions for booking an appointment and finding a clinic, plus guided responses for doctors, specialties, dashboards, and role navigation. It uses fictional demo clinic data and requires no external AI key for the hackathon preview. A production version can replace the guided intent handler with a server-side LLM integration without exposing provider credentials in the browser.

The assistant also recognizes common symptom-oriented questions and responds with a safety disclaimer rather than diagnosing. Booking captures symptoms or concerns alongside the visit reason. Appointment history details show status, symptoms, care-team notes, and follow-up information for the fictional demo records.

The protected **Medical records** page includes fictional wellness and lab reports plus demo prescriptions. Each card downloads a clearly labeled demo text file in the browser; the records are not valid medical documents or prescriptions.

## Hackathon authentication hardening

Patient, Doctor, and Admin demo logins are now verified by the Express server. The frontend no longer creates a session when the API fails; it stores only the server-issued JWT and `/api/auth/me` revalidates the session on reload. Protected API routes validate the JWT and enforce roles server-side. Demo accounts are fictional and use the password `password` for the local hackathon preview only. Set a strong `JWT_SECRET`, `NODE_ENV=production`, and exact `CLIENT_ORIGIN` before any public deployment.

Admins can also see the **Security monitor → Login activity** panel on the dashboard. It reads the protected `/api/admin/login-activity` endpoint and shows account email, role, timestamp, IP label, and success/failure status. Patient and Doctor tokens receive `403` for this endpoint.

## Password recovery

The login screen includes a **Forgot?** link. Users submit their email, receive a six-digit OTP, verify it, and choose a new password. OTPs are hashed, expire after 10 minutes, and allow five attempts. Reset tokens are hashed, expire after 15 minutes, and are single-use. In preview mode, the OTP is displayed as a demo code and an in-memory fallback keeps the complete flow usable without MongoDB or an email provider. Production deployments should connect the OTP to an email or SMS delivery service before enabling public delivery.

## Security controls

Helmet headers, CORS allow-listing, rate limiting, Joi input validation, MongoDB operator sanitization, XSS sanitization, bcrypt password hashing, JWT expiry, role checks, audit logging, failed-login tracking, and environment-based secrets are included in the backend.

## Deployment

1. Provision MongoDB Atlas and add the deployment IP/network access rule.
2. Configure `MONGODB_URI`, `JWT_SECRET`, `CLIENT_ORIGIN`, and `PORT` in your host.
3. Build the client with `npm run build`.
4. Run the Express server with `npm start`; it serves the built Vite output when `dist/` exists.
5. Put HTTPS in front of the server and set a strict CORS origin.

## Secure QR check-in

When a patient books an appointment, MediDesk creates a time-limited QR arrival pass. The patient opens the appointment details and shows the QR at the clinic. Doctors and administrators verify the scanned payload from the dashboard; a valid pass is signed with HMAC, expires after 24 hours, is restricted to the assigned doctor/admin, and is invalidated after one check-in. Set `QR_SECRET` to a unique random value in production. The static hackathon demo uses a cryptographically random one-time local fallback when MongoDB/API services are unavailable.

## AI navigation

The Clara navigator provides safe deterministic navigation for appointments, records, profile, dashboard, clinic discovery, symptoms guidance, and QR check-in. It does not diagnose or expose private data to an external model.
