import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import http from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';

// Route files
import auth from './routes/auth.js';
import users from './routes/users.js';
import skills from './routes/skills.js';
import bookings from './routes/bookings.js';
import messages from './routes/messages.js';
import reviews from './routes/reviews.js';
import contact from './routes/contact.js';
import configureSocket from './socket/chat.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Pass io to request object if needed in controllers
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Basic Route
app.get('/', (req, res) => {
  res.send('SkillBridge API is running...');
});

// Mount routers
app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/skills', skills);
app.use('/api/bookings', bookings);
app.use('/api/messages', messages);
app.use('/api/reviews', reviews);
app.use('/api/contact', contact);

// Global Error Handler Middleware
app.use(errorHandler);

// Configure Socket.io logic
configureSocket(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
