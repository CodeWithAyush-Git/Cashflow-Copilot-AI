# Cashflow Copilot Starter

This is a clean full-stack starter project that you can open in VS Code and explain easily in interviews.

## What the app does

- Tracks clients and invoices
- Shows dashboard stats for pending and overdue payments
- Generates an AI-style payment reminder draft
- Keeps frontend and backend separated so the architecture is easy to understand

## Folder structure

```text
.
|-- backend
|   |-- src
|   |   |-- app.js
|   |   |-- server.js
|   |   |-- controllers
|   |   |-- routes
|   |   |-- services
|   |   `-- data
|-- frontend
|   |-- src
|   |   |-- App.jsx
|   |   |-- components
|   |   `-- services
|-- package.json
`-- README.md
```

## How to explain the backend

1. `backend/src/server.js`
   Starts the Node server.
2. `backend/src/app.js`
   Configures Express, CORS, JSON parsing, and mounts routes.
3. `backend/src/routes/*.js`
   Matches the URL with the correct controller.
4. `backend/src/controllers/*.js`
   Receives request data and sends a response.
5. `backend/src/services/*.js`
   Contains the business logic such as dashboard calculations and reminder generation.
6. `backend/src/data/mockStore.js`
   Holds sample data. In a real SaaS app, this would be replaced with a database.

## How to explain the frontend

1. `frontend/src/main.jsx`
   Mounts React into the browser.
2. `frontend/src/App.jsx`
   Main screen logic, API calls, state, and page switching.
3. `frontend/src/components/*.jsx`
   Small reusable UI pieces such as the sidebar, invoice table, and reminder panel.
4. `frontend/src/services/api.js`
   Keeps all fetch calls in one file, so components stay clean.
5. `frontend/src/components/Footer.jsx`
   Adds a simple footer for product context and branding.

## End-to-end request flow

Example: user clicks `Generate reminder`

1. Button click happens in `frontend/src/components/ReminderStudio.jsx`
2. `frontend/src/App.jsx` calls `generateReminder()`
3. `frontend/src/services/api.js` sends `POST /api/reminders/preview`
4. `backend/src/routes/reminderRoutes.js` forwards the request
5. `backend/src/controllers/reminderController.js` handles request/response
6. `backend/src/services/reminderService.js` creates the reminder text
7. Response goes back to the frontend and is rendered in the UI

## AI integration

- Right now the project works with a local fallback reminder generator.
- If you add `OPENAI_API_KEY` and `OPENAI_MODEL` in `backend/.env`, the backend will try to call the OpenAI Responses API first.
- If that fails, the project automatically falls back to the local rule-based draft so the demo still works.

## Run in VS Code

Open two terminals in VS Code.

### Terminal 1

```bash
cd backend
npm install
npm run dev
```

### Terminal 2

```bash
cd frontend
npm install
npm run dev
```

Then open the frontend URL shown by Vite, usually `http://localhost:5173`.

## Good interview lines

- "I separated routes, controllers, and services so the backend stays scalable."
- "The frontend has a dedicated API layer, so UI components do not contain networking logic."
- "The reminder feature is my AI integration point. I kept a fallback path so the app still works even without an external model."
- "Right now I am using mock data, but the data layer is isolated, so I can replace it with PostgreSQL later."

## Good next steps

- Replace mock data with PostgreSQL + Prisma
- Add login/signup
- Add email or WhatsApp sending
- Add analytics for repeat late payers
- Deploy frontend and backend separately
