# Blood Bank MERN Stack Project

A complete MERN stack Blood Bank Management system with role-based dashboards for:

- Admin
- Organisation (blood bank)
- Donor
- Hospital

The application tracks blood inventory movement (`in` and `out`), validates stock during issue requests, and provides analytics by blood group.

## Table of Contents

- Overview
- Features
- Tech Stack
- Architecture
- Folder Structure
- API Overview
- Environment Variables
- Installation and Run
- Available Scripts
- Default Ports
- Troubleshooting

## Overview

This project is split into two applications:

- Backend API using Node.js + Express + MongoDB
- Frontend client using React + Redux Toolkit

The frontend authenticates users with JWT and consumes backend APIs under `/api/v1/*`.

## Features

- Role-based registration and login (`admin`, `organisation`, `donar`, `hospital`)
- JWT authentication with protected APIs
- Blood inventory create flow with stock validation
- Blood availability analytics by blood group
- Admin management views for donors, hospitals, and organisations
- React routing with public/protected routes
- Redux state for authentication

## Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (`jsonwebtoken`)
- `bcryptjs` for password hashing
- `cors`, `morgan`, `dotenv`

### Frontend

- React 18
- React Router DOM v6
- Redux Toolkit + React Redux
- Axios
- React Toastify

## Architecture

### High-Level Architecture

```text
React Client (client)
  -> Axios Service + JWT token in Authorization header
  -> Express API (server.js)
  -> Routes (routes/*.js)
  -> Controllers (controllers/*.js)
  -> Models (models/*.js)
  -> MongoDB
```

### Backend Request Flow

1. Client sends request to `/api/v1/...`.
2. Route file maps endpoint to controller.
3. `authMiddelware` verifies JWT for protected routes.
4. Optional `adminMiddleware` checks admin role.
5. Controller applies business logic and DB operations via Mongoose models.
6. JSON response is returned to client.

### Inventory Domain Logic

- Inventory document stores:
  - `inventoryType`: `in` or `out`
  - `bloodGroup`
  - `quantity`
  - `organisation`
  - `donar` (for `in`)
  - `hospital` (for `out`)
- For `out` transactions, the controller calculates:
  - total `in` units for requested group
  - total `out` units for requested group
  - available = `in - out`
- Request is rejected if available stock is insufficient.

## Folder Structure

```text
.
|-- client/
|   |-- src/
|   |   |-- components/
|   |   |-- pages/
|   |   |-- redux/
|   |   `-- services/
|   `-- package.json
|-- config/
|   `-- db.js
|-- controllers/
|-- middlewares/
|-- models/
|-- routes/
|-- server.js
`-- package.json
```

## API Overview

Base URL: `http://localhost:5000/api/v1`

### Auth

- `POST /auth/register` - Register user
- `POST /auth/login` - Login user
- `GET /auth/current-user` - Current user (protected)

### Inventory

- `POST /inventory/create-inventory` - Add inventory record (protected)
- `GET /inventory/get-inventory` - Organisation inventory list (protected)
- `GET /inventory/get-recent-inventory` - Recent inventory records (protected)
- `POST /inventory/get-inventory-hospital` - Hospital/consumer inventory list (protected)
- `GET /inventory/get-donars` - Donor list for organisation (protected)
- `GET /inventory/get-hospitals` - Hospital list for organisation (protected)
- `GET /inventory/get-orgnaisation` - Organisations connected to donor (protected)
- `GET /inventory/get-orgnaisation-for-hospital` - Organisations connected to hospital (protected)

### Analytics

- `GET /analytics/bloodGroups-data` - Blood group totals (`in`, `out`, available) (protected)

### Admin

- `GET /admin/donar-list` - Donor list (admin only)
- `GET /admin/hospital-list` - Hospital list (admin only)
- `GET /admin/org-list` - Organisation list (admin only)
- `DELETE /admin/delete-donar/:id` - Delete donor (admin only)

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
REACT_APP_BASEURL=http://localhost:5000/api/v1
```

Notes:

- `PORT` is used by backend server.
- `REACT_APP_BASEURL` is used by frontend Axios instance.

## Installation and Run

### 1. Clone repository

```bash
git clone <your-repo-url>
cd Blood-Bank-Mern-Stack-Project-main
```

### 2. Install backend dependencies

```bash
npm install
```

### 3. Install frontend dependencies

```bash
cd client
npm install
cd ..
```

### 4. Start development servers (backend + frontend)

```bash
npm run dev
```

This runs:

- Backend: `npm run server`
- Frontend: `npm run client`

## Available Scripts

In root:

- `npm run server` - Start backend with nodemon
- `npm run client` - Start React app from `client`
- `npm run dev` - Run backend and frontend concurrently

In `client`:

- `npm start` - Start React dev server
- `npm run build` - Create production build
- `npm test` - Run frontend tests

## Default Ports

- Backend: `5000` (from `.env`)
- Frontend: `3000` (CRA default)

## Troubleshooting

- If MongoDB connection fails, verify `MONGO_URL` in `.env`.
- If auth APIs fail, verify `JWT_SECRET` and token storage in browser localStorage.
- If frontend cannot call backend, check `REACT_APP_BASEURL` and CORS.
