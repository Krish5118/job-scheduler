# Job Scheduler & Automation Dashboard

## 1. Project Overview

The **Job Scheduler & Automation Dashboard** is a full-stack web application designed to demonstrate the lifecycle of background job processing. It allows users to create different types of jobs (with JSON payloads) and priority levels through a modern React dashboard.

The core functionality simulates a background processor: when a user "runs" a job, the system simulates a 3-second processing delay before marking it as complete. Upon completion, the backend automatically triggers a **Webhook notification** to an external system, making it an ideal demonstration of event-driven architecture.

## 2. Tech Stack

*   **Frontend**: React.js (Vite), Tailwind CSS (Styling), Lucide React (Icons)
*   **Backend**: Node.js, Express.js (REST API)
*   **Database**: MySQL (using `mysql2` driver)
*   **Tools**: Axios (HTTP requests), Dotenv (Config)

## 3. Setup Instructions

### Prerequisites
*   Node.js installed
*   MySQL Server running locally
*   Database `job_scheduler` created (or user permissions to create it)

### Step-by-Step Run Guide

1.  **Configure Environment**:
    *   Edit `backend/.env` with your MySQL credentials and Webhook URL.
    
2.  **Start Backend**:
    ```bash
    cd backend
    npm install
    npm run dev
    ```
    *Server runs on `http://localhost:5000`*

3.  **Start Frontend**:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
    *App runs on `http://localhost:5173`*

## 4. Database Schema

All data is stored in a single MySQL table named `jobs`.

| Column      | Type                                     | Description                        |
| :---------- | :--------------------------------------- | :--------------------------------- |
| `id`        | `INT PK AUTO_INCREMENT`                  | Unique Job ID                      |
| `taskName`  | `VARCHAR(255)`                           | Name of the job                    |
| `payload`   | `JSON`                                   | Job data (e.g., `{ "to": "..." }`) |
| `priority`  | `ENUM('Low', 'Medium', 'High')`          | Job urgency level                  |
| `status`    | `ENUM('pending', 'running', 'completed')`| Current state of the job           |
| `createdAt` | `DATETIME`                               | When the job was created           |
| `completedAt`| `DATETIME`                              | When the job finished execution    |

## 5. API Documentation

### Base URL: `http://localhost:5000`

| Method | Endpoint | Description | Request Body Example |
| :--- | :--- | :--- | :--- |
| **POST** | `/jobs` | Create a new job | `{ "taskName": "Email", "priority": "High", "payload": {} }` |
| **GET** | `/jobs` | List all jobs (supports filters) | Query Params: `?status=pending&priority=High` |
| **GET** | `/jobs/:id` | Get details of a specific job | N/A |
| **POST** | `/run-job/:id` | Start a job execution | N/A |

## 6. Webhook Explanation

**Trigger**: The webhook fires automatically **immediately after** a job status changes from `running` to `completed`.

**Destination**: Configured via `WEBHOOK_URL` in `backend/.env`.

**Payload Sent**:
```json
{
  "jobId": 12,
  "taskName": "Generate Report",
  "priority": "High",
  "payload": { "format": "pdf" },
  "completedAt": "2026-02-04T10:30:00.000Z"
}
```

## 7. Architecture Explanation

1.  **User Interaction**: User clicks "Create Job" on the **React Frontend**.
2.  **API Request**: Frontend sends POST request to **Express Backend**.
3.  **Storage**: Backend saves job to **MySQL Database** with status `pending`.
4.  **Execution**: User clicks "Run". Backend updates status to `running`, waits 3 seconds (simulating work).
5.  **Completion**: Backend updates status to `completed`.
6.  **Notification**: Backend sends a POST request with job details to the **Webhook URL**.

## 8. AI Usage Log 

**AI Tool**: Google Gemini
**Model**: Gemini 2.0 Flash
**Used for**:
*   **Understanding Requirements**: Breaking down the user's prompt into Frontend, Backend, and DB tasks.
*   **Writing Code**: Generating the initial `server.js` (Express) and `JobList.jsx` (React) components.
*   **Debugging**: Identifying PowerShell execution policy issues and creating the `check-db.js` verification script.
*   **Webhook Implementation**: ensuring the payload matched strict JSON requirements and debugging local connectivity using a custom Node.js receiver.
