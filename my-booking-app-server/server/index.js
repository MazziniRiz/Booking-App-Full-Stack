// server/index.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Permits React app running on http://localhost:5173 to talk to this server
app.use(express.json()); // Parses incoming JSON request bodies

// Mock database (in-memory array)
const bookings = [];

// API Endpoint 1: Fetch existing bookings
app.get('/api/bookings', (req, res) => {
  res.json({ success: true, data: bookings });
});

// API Endpoint 2: Create a new booking
app.post('/api/bookings', (req, res) => {
  const { date, time, name, email, notes } = req.body;

  // Simple validation
  if (!date || !time || !name || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Double-booking check
  const alreadyBooked = bookings.some(
    (b) => b.date === date && b.time === time
  );

  if (alreadyBooked) {
    return res.status(409).json({ error: 'This time slot is already taken!' });
  }

  const newBooking = {
    id: Date.now(),
    date,
    time,
    name,
    email,
    notes: notes || '',
    createdAt: new Date()
  };

  bookings.push(newBooking);
  console.log('New booking saved:', newBooking);

  res.status(201).json({ success: true, booking: newBooking });
});

// Start listening for requests
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});