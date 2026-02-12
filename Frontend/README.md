# SiteCraft4u (Frontend + Backend Split).

This repo is now structured so frontend and backend can be deployed separately.

- Frontend: Next.js app in repo root
- Backend: Node.js/Express API in `backend/`

## 1) Frontend setup

Create `.env.local` in repo root:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

Run frontend:

```bash
npm install
npm run dev:frontend
```

## 2) Backend setup

Create `backend/.env`:

```env
PORT=4000
FRONTEND_ORIGIN=http://localhost:3000
JWT_SECRET=change_this_jwt_secret
ADMIN_EMAIL=admin@sitecraft4u.com
ADMIN_PASSWORD=Admin@123
COOKIE_SAME_SITE=lax
```

Run backend:

```bash
cd backend
npm install
npm run dev
```

## Deploy separately

- Deploy frontend as a Next.js app.
- Deploy backend as a Node.js service exposing `/api/*`.
- Set frontend env `NEXT_PUBLIC_API_BASE_URL` to your backend URL (example: `https://api.yourdomain.com`).
- Set backend `FRONTEND_ORIGIN` to your frontend URL (example: `https://www.yourdomain.com`).

## API routes served by backend

- `POST /api/admin/login`
- `POST /api/admin/logout`
- `GET /api/admin/session`
- `GET /api/quotes` (admin)
- `POST /api/quotes`
- `GET /api/visitors` (admin)
- `POST /api/visitors`
- `PATCH /api/visitors`
- `GET /api/visitors/status`
- `GET /api/contact` (admin)
- `POST /api/contact`
