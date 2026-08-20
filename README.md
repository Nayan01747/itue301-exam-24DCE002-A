# MedCare Plus - Hospital Appointment System

**Course:** ITUE301 - Advanced Web Development Frameworks  
**Practical Exam:** Set A — Hospital Appointment System  
**Roll Number:** 24DCE002 | **Batch:** A  
**Tech Stack:** React.js + Express.js + MongoDB (Mongoose)

---

## 📌 Project Overview
MedCare Plus is a comprehensive full-stack web application developed for managing hospital appointments, doctor availability directories, patient records, and database schema validation using Mongoose.

---

## 🛠️ Tasks Implementation Summary

### Task 1 — React Component Architecture (4 Marks)
- **`AppointmentCard` Component**: Accepts props (`patientName`, `doctorName`, `date`, `timeSlot`, `status`, `reason`) and dynamically styles status badges using custom CSS classes (`status-confirmed`, `status-pending`, `status-cancelled`).
- **`HomePage` Component**: Executive dashboard displaying hospital operational metrics and composing `AppointmentCard` components.

### Task 2 — React Routing and State Management (4 Marks)
- **React Router Navigation**: Seamless client-side navigation between `/`, `/doctors`, `/booking`, and `/validation-demo` without full-page reload using `<NavLink>`.
- **Interactive Booking Form**: State managed via React `useState` (`formData`, `selectedDoctor`), featuring a real-time **Live Form State Preview Card**.

### Task 3 — Express REST API + Middleware (4 Marks)
- **Endpoints**:
  - `GET /api/v1/doctors` — Returns doctor directory (Status `200 OK`).
  - `GET /api/v1/appointments` — Returns list of appointments (Status `200 OK`).
  - `POST /api/v1/appointments` — Creates a new appointment (Status `201 Created`).
- **Custom `requestLogger` Middleware**: Applied globally, logging format `[METHOD] [PATH] [TIMESTAMP]`.
- **Global Error Handling Middleware**: Formats all server and validation errors into structured JSON responses.

### Task 4 — REST API Consumption in React (4 Marks)
- **`DoctorsPage` Component**: Asynchronously fetches doctor directory from `GET /api/v1/doctors` using `useEffect()`.
- **State Management**: Handles 3 explicit states (`data`, `loading`, `error`), rendering loading spinners, error alerts, and doctor cards (Doctor Name, Specialisation, Availability).

### Task 5 — MongoDB + Mongoose Schema Design & Validation (4 Marks)
- **Patient Schema**: `name` (required), `email` (required, unique), `phone`, `bloodGroup` (enum), `age`.
- **Doctor Schema**: `name` (required), `email`, `specialisation` (required), `available` (default `true`).
- **Appointment Schema**: `patientId` (ref `Patient`), `doctorId` (ref `Doctor`), `date`, `timeSlot`, `status` (enum default `pending`), `reason` (max 300 chars).
- **Validation Sandbox**: Interactive test suite for validation constraints (missing fields, invalid enum, length limits).

---

## ⚙️ Environment Variables Setup
Create a `.env` file inside the `backend/` directory based on `.env.example`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/hospital_db
```

---

## 🚀 Backend Setup & Run Command

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Express server:
   ```bash
   npm start
   # (or) node server.js
   ```
The backend server runs at `http://localhost:5000`.

---

## 💻 Frontend Setup & Run Command

1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
The React frontend runs at `http://localhost:5173`.

---

## 🍃 MongoDB Setup

1. Ensure MongoDB Community Server is running locally on port `27017` (or configure a remote MongoDB Atlas URI in `.env`).
2. Database name: `hospital_db`.
3. Initial doctor and appointment documents are automatically seeded upon server startup.
