// server/index.js
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg')
const { Pool } = require('pg')


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 10,                     // Set a reasonable pool size
  idleTimeoutMillis: 30000,    // Close idle clients after 30s
  connectionTimeoutMillis: 5000,
  family: 4,
});
const adapter = new PrismaPg(pool);
const globalForPrisma = global;
const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Permits React app running on http://localhost:5173 to talk to this server
app.use(express.json()); // Parses incoming JSON request bodies



// API Endpoint 1: Fetch existing bookings
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await prisma.Booking.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
})

// API Endpoint 2: Create a new booking
app.post('/api/bookings', async (req, res) => {
  const { date, time, name, email, notes } = req.body;
  console.log('Received body from frontend', req.body);

  if (!date || !time || !name || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Check if slot is taken
  const existingBooking = await prisma.booking.findFirst({
      where: {
        date: String(date),
        time: String(time),
      },
    });

    if (existingBooking) {
      return res.status(400).json({ error: "This time slot is already booked!" });
    }

    // Insert into PostgreSQL
    const newBooking = await prisma.booking.create({
      data: {
        date,
        time,
        name,
        email,
        notes: notes || ''
      }
    });

    res.status(201).json({ success: true, booking: newBooking });
  } catch (error) {
    console.error("FULL PRISMA ERROR:", error);
    return res.status(500).json({ error: error.message || "Database transaction failed" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});