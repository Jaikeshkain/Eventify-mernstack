require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const connectDB = require('./configs/db');


// Connect to MongoDB
connectDB();


// Import routes
const EventRoute = require('./routes/EventRoute');
const AuthRoute=require("./routes/AuthRoute");
const UserRoute=require("./routes/UserRoute");
const QRPaymentRoute=require("./routes/QRPaymentRoute");
const TicketRoute=require("./routes/TicketRoute");
// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api/events',EventRoute);
app.use('/api/auth',AuthRoute);
app.use('/api/users',UserRoute);
app.use('/api/qr',QRPaymentRoute);
app.use('/api/tickets',TicketRoute);
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Set port and start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
