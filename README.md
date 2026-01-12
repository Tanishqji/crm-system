# CRM Lead Management System

A simple full-stack CRM application to manage leads and personal information, targeted for tracking interns and freshers.

## Features
- **Admin Dashboard**: Summary cards, lead status distribution, and revenue charts.
- **Person Management**: Full CRUD for managing personal/contact details.
- **Lead Management**: Full CRUD for managing leads linked to persons.
- **Modern UI**: Premium dark-mode design with glassmorphism and responsive layout.

## Tech Stack
- **Frontend**: React.js (Vite), Recharts, Lucide-React, Axios.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB running locally (or a connection string)

### 1. Backend Setup
1. Open a terminal in the `server` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. (Optional) Seed the database with sample data:
   ```bash
   node seed.js
   ```
4. Start the server:
   ```bash
   npm start
   ```
   *The server runs on http://localhost:5000*

### 2. Frontend Setup
1. Open a terminal in the `client` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The frontend runs on http://localhost:5173*

## Directory Structure
- `server/`: Express backend with Mongoose models and routes.
- `client/`: React frontend with components and pages.
