# Job Scheduler & Automation System

A mini full-stack job scheduling system exploring React, Node.js, and MySQL.

## Features
- Create Jobs with JSON payloads and priority.
- View Job List with status filtering.
- Run Jobs (simulates 3s delay).
- Webhook trigger on job completion.

## Setup

### Prerequisites
- Node.js
- MySQL Server running locally (User: root, No password by default)
  - *Note: Update `backend/.env` if your credentials differ.*

### Installation

1. **Backend**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   Server starts on `http://localhost:5000`.

2. **Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   App runs on `http://localhost:5173`.

## Verify
1. Open http://localhost:5173
2. Create a job.
3. Click "Run" on the dashboard.
4. Watch status change from Pending -> Running -> Completed.
