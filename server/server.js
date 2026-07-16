require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');
const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const statsRoutes = require('./routes/statsRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');

const app = express();
const allowedOrigins = [process.env.CLIENT_URL || 'http://localhost:3000', 'http://localhost:5173'];

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const seedDefaultAdmin = async () => {
  const adminEmail = (process.env.DEFAULT_ADMIN_EMAIL || 'admin@example.com').toLowerCase();
  const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';

  try {
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await User.create({
        name: 'Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        isActive: true
      });
      console.log(`Seeded default admin user in database: ${adminEmail}`);
    }
  } catch (error) {
    console.error('Failed to seed default admin user:', error.message);
  }
};

const connectDatabase = async () => {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is not defined in environment variables');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
    console.log('MongoDB connection established successfully');
    await seedDefaultAdmin();
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
  }
};

connectDatabase();

// Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'HealTrack Server is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/invoices', invoiceRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
