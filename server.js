const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const Patient = require('./models/Patient');
const Doctor = require('./models/Doctor');
const Appointment = require('./models/Appointment');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hospital_db';

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// In-memory fallback dataset in case MongoDB is not accessible
let memoryDoctors = [
  {
    _id: 'doc1',
    name: 'Dr. Sarah Jenkins',
    email: 'sarah.jenkins@medcare.com',
    specialisation: 'Cardiology',
    available: true,
  },
  {
    _id: 'doc2',
    name: 'Dr. Rajesh Patel',
    email: 'rajesh.patel@medcare.com',
    specialisation: 'Neurology',
    available: true,
  },
  {
    _id: 'doc3',
    name: 'Dr. Emily Chen',
    email: 'emily.chen@medcare.com',
    specialisation: 'Pediatrics',
    available: false,
  },
  {
    _id: 'doc4',
    name: 'Dr. Michael Vance',
    email: 'michael.vance@medcare.com',
    specialisation: 'Orthopedics',
    available: true,
  },
];

let memoryAppointments = [
  {
    _id: 'app1',
    patientName: 'John Doe',
    doctorName: 'Dr. Sarah Jenkins',
    date: '2026-08-25',
    timeSlot: '10:00 AM',
    status: 'confirmed',
    reason: 'Routine cardiac checkup',
  },
  {
    _id: 'app2',
    patientName: 'Alice Smith',
    doctorName: 'Dr. Rajesh Patel',
    date: '2026-08-26',
    timeSlot: '02:30 PM',
    status: 'pending',
    reason: 'Migraine consult',
  },
  {
    _id: 'app3',
    patientName: 'Robert Brown',
    doctorName: 'Dr. Emily Chen',
    date: '2026-08-27',
    timeSlot: '11:15 AM',
    status: 'cancelled',
    reason: 'Patient rescheduled',
  },
];

let isMongoConnected = false;

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(async () => {
    isMongoConnected = true;
    console.log(`[MongoDB] Connected successfully to ${MONGO_URI}`);
    await seedDatabaseIfEmpty();
  })
  .catch((err) => {
    console.warn(`[MongoDB Warning] Database connection failed: ${err.message}`);
    console.warn(`[MongoDB Warning] Operating in in-memory mode for API endpoints.`);
  });

// Database seeder helper
async function seedDatabaseIfEmpty() {
  try {
    const doctorCount = await Doctor.countDocuments();
    if (doctorCount === 0) {
      await Doctor.insertMany(memoryDoctors.map(({ _id, ...doc }) => doc));
      console.log('[Seeder] Default doctors seeded to MongoDB');
    }

    const appointmentCount = await Appointment.countDocuments();
    if (appointmentCount === 0) {
      await Appointment.insertMany(memoryAppointments.map(({ _id, ...app }) => app));
      console.log('[Seeder] Default appointments seeded to MongoDB');
    }
  } catch (error) {
    console.error('[Seeder Error]', error.message);
  }
}

/**
 * Task 3 Requirement: Custom requestLogger Middleware
 * Logs format: [METHOD] [PATH] [TIMESTAMP]
 * Example: [GET] /api/v1/appointments [2026-08-20T10:15:20.000Z]
 * Applied globally.
 */
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${req.method}] ${req.path} [${timestamp}]`);
  next();
};

app.use(requestLogger);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to MedCare Plus Hospital Appointment API',
    endpoints: [
      'GET /api/v1/doctors',
      'GET /api/v1/appointments',
      'POST /api/v1/appointments',
      'POST /api/v1/test-validation',
    ],
    mongoConnected: isMongoConnected,
  });
});

/**
 * Task 3 Endpoint: GET /api/v1/doctors
 * Returns all doctors.
 */
app.get('/api/v1/doctors', async (req, res, next) => {
  try {
    if (isMongoConnected) {
      const doctors = await Doctor.find({});
      return res.status(200).json({ success: true, data: doctors });
    } else {
      return res.status(200).json({ success: true, data: memoryDoctors });
    }
  } catch (error) {
    next(error);
  }
});

/**
 * Task 3 Endpoint: GET /api/v1/appointments
 * Returns all appointments.
 */
app.get('/api/v1/appointments', async (req, res, next) => {
  try {
    if (isMongoConnected) {
      const appointments = await Appointment.find({});
      return res.status(200).json({ success: true, data: appointments });
    } else {
      return res.status(200).json({ success: true, data: memoryAppointments });
    }
  } catch (error) {
    next(error);
  }
});

/**
 * Task 3 Endpoint: POST /api/v1/appointments
 * Creates a new appointment.
 */
app.post('/api/v1/appointments', async (req, res, next) => {
  try {
    const { patientName, doctorName, date, timeSlot, status, reason } = req.body;

    if (!patientName || !doctorName || !date || !timeSlot) {
      return res.status(400).json({
        success: false,
        error: 'Missing Required Fields',
        details: 'patientName, doctorName, date, and timeSlot are required.',
      });
    }

    if (reason && reason.length > 300) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: 'Reason cannot exceed 300 characters.',
      });
    }

    if (status && !['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: 'Status must be one of: pending, confirmed, cancelled',
      });
    }

    if (isMongoConnected) {
      const newAppointment = new Appointment({
        patientName,
        doctorName,
        date,
        timeSlot,
        status: status || 'pending',
        reason: reason || '',
      });

      const saved = await newAppointment.save();
      return res.status(201).json({
        success: true,
        message: 'Appointment created successfully',
        data: saved,
      });
    } else {
      const newAppointment = {
        _id: 'app_' + Date.now(),
        patientName,
        doctorName,
        date,
        timeSlot,
        status: status || 'pending',
        reason: reason || '',
      };
      memoryAppointments.push(newAppointment);
      return res.status(201).json({
        success: true,
        message: 'Appointment created successfully (in-memory mode)',
        data: newAppointment,
      });
    }
  } catch (error) {
    next(error);
  }
});

/**
 * Task 5 Demonstration Endpoint: POST /api/v1/test-validation
 * Explicitly tests Mongoose validations:
 * - missing required fields
 * - invalid blood group
 * - invalid appointment status
 * - reason exceeding 300 characters
 */
app.post('/api/v1/test-validation', async (req, res, next) => {
  try {
    const { type, payload } = req.body;

    if (type === 'patient') {
      const patient = new Patient(payload);
      await patient.validate(); // triggers Mongoose validation
      return res.status(200).json({ success: true, message: 'Patient validation passed!', data: patient });
    } else if (type === 'appointment') {
      const appointment = new Appointment(payload);
      await appointment.validate(); // triggers Mongoose validation
      return res.status(200).json({ success: true, message: 'Appointment validation passed!', data: appointment });
    } else {
      return res.status(400).json({
        success: false,
        error: 'Invalid test type',
        details: 'Type must be patient or appointment',
      });
    }
  } catch (error) {
    next(error);
  }
});

/**
 * Task 3 Requirement: Global Error-Handling Middleware
 * Must be the last middleware in the application.
 * Returns structured JSON response instead of exposing raw error stack.
 */
app.use((err, req, res, next) => {
  console.error('[Global Error Handler]', err);

  // Handle Mongoose Validation Errors gracefully (Task 5 requirement)
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      error: 'Mongoose Validation Error',
      details: messages,
    });
  }

  // Handle duplicate key errors (e.g. unique email in Patient schema)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue).join(', ');
    return res.status(400).json({
      success: false,
      error: 'Duplicate Key Error',
      details: `Value for field '${field}' already exists in the database.`,
    });
  }

  // Generic unhandled error response (500)
  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    success: false,
    error: err.name || 'Internal Server Error',
    message: err.message || 'An unexpected error occurred on the server.',
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` MedCare Plus Backend running at http://localhost:${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`=======================================================`);
});
