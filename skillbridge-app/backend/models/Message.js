import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.ObjectId,
      ref: 'Booking',
      required: true,
    },
    sender: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: [true, 'Message content cannot be empty'],
    },
    readAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index to quickly fetch messages for a specific booking
MessageSchema.index({ booking: 1, createdAt: 1 });

export default mongoose.model('Message', MessageSchema);
