# Nutriwell Frontend

Local development only.

## Run locally

```powershell
cd ..\nutriwell_backend
npm install
npm run db:setup
npm run start:dev
```

Open a second terminal:

```powershell
cd ..\nutriwell_frotend
npm install
npm run dev
```

The frontend runs on Vite's local dev server and talks to the backend at `http://localhost:3001`.
