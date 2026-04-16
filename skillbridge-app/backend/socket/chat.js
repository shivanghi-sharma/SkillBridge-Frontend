import jwt from 'jsonwebtoken';
import Message from '../models/Message.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';

export default function configureSocket(io) {
  // Middleware to authenticate socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      
      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected to chat: ${socket.user.name} (${socket.id})`);

    // Join a booking-specific chat room
    socket.on('join-booking', async ({ bookingId }) => {
      try {
        const booking = await Booking.findById(bookingId);
        
        if (!booking) {
          return socket.emit('error', { message: 'Booking not found' });
        }

        // Verify authorization
        if (
          booking.buyer.toString() !== socket.user.id &&
          booking.seller.toString() !== socket.user.id
        ) {
          return socket.emit('error', { message: 'Not authorized to join this chat' });
        }

        socket.join(bookingId);
        console.log(`User ${socket.user.name} joined room ${bookingId}`);
      } catch (err) {
        socket.emit('error', { message: 'Failed to join chat room' });
      }
    });

    // Handle incoming messages
    socket.on('send-message', async (data) => {
      try {
        const { bookingId, receiverId, content } = data;

        // Save message to DB
        const message = await Message.create({
          booking: bookingId,
          sender: socket.user.id,
          receiver: receiverId,
          content,
        });

        const populatedMessage = await message.populate('sender', 'name avatar');

        // Broadcast to the room
        io.to(bookingId).emit('new-message', populatedMessage);
      } catch (err) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Typing indicators
    socket.on('typing', ({ bookingId }) => {
      socket.to(bookingId).emit('user-typing', { userId: socket.user.id });
    });

    socket.on('stop-typing', ({ bookingId }) => {
      socket.to(bookingId).emit('user-stopped-typing', { userId: socket.user.id });
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected from chat: ${socket.user.name} (${socket.id})`);
    });
  });
}
