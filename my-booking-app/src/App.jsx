import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { getMinBookingDate } from './utils/date'

function App() {
  // State variables to keep track of user choices
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState(null);

  // Example available time slots
  const timeSlots = ['09:00 AM', '10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM'];
  const minDate = getMinBookingDate();
  
  const handleBooking = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: selectedDate,
          time: selectedTime,
          name: e.target[2].value,  // or use state variables for form inputs
          email: e.target[3].value,
          notes: e.target[4].value,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(`Error: ${data.error}`);
        return;
      }

      alert(`Booking successful for ${data.booking.name} on ${data.booking.date} at ${data.booking.time}!`);
    } catch (error) {
      console.error('Failed to submit booking:', error);
      alert('Failed to connect to the server.');
    }
  };

  return (
    <div className="booking-container">
      {/* HEADER */}
      <header className="header">
        <h1>Book a Meeting</h1>
        <p>Pick a time that works best for you.</p>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="main-content">
        
        {/* LEFT COLUMN: Meeting Details Sidebar */}
        <aside className="meeting-info">
          <h2>15-Min Discovery Call</h2>
          <p>⏱️ <strong>Duration:</strong> 15 mins</p>
          <p>💻 <strong>Location:</strong> Google Meet / Zoom</p>
          <p className="description">
            A quick chat to discuss your project requirements and how we can work together.
          </p>
        </aside>

        {/* RIGHT COLUMN: Interactive Booking Form */}
        <section className="booking-form-section">
          <form onSubmit={handleBooking}>
            
            {/* Step 1: Select Date */}
            <div className="form-group">
              <label htmlFor="booking-date">1. Select a Date</label>
              <input 
                type="date" 
                id="booking-date"
                min = {minDate}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                required 
              />
            </div>

            {/* Step 2: Select Time Slot */}
            {selectedDate && (
              <div className="form-group">
                <label>2. Select a Time Slot</label>
                <div className="time-slots-grid">
                  {timeSlots.map((time) => (
                    <button
                      type="button"
                      key={time}
                      className={`time-btn ${selectedTime === time ? 'active' : ''}`}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Contact Info (Shows up once date and time are picked) */}
            {selectedDate && selectedTime && (
              <div className="form-group contact-details">
                <label>3. Your Details</label>
                <input type="text" placeholder="Your Name" required />
                <input type="email" placeholder="Your Email Address" required />
                <textarea placeholder="Anything specific you'd like to discuss?" rows="3" />
                
                <button type="submit" className="confirm-btn">
                  Confirm Booking ({selectedTime})
                </button>
              </div>
            )}

          </form>
        </section>

      </main>
    </div>
  );
}

export default App
