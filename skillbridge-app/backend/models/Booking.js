import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    seller: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    skill: {
      type: mongoose.Schema.ObjectId,
      ref: 'Skill',
      required: true,
    },
    date: {
      type: Date,
      required: [true, 'Please add a booking date'],
    },
    timeSlot: {
      type: String,
      required: [true, 'Please add a time slot'],
    },
    duration: {
      type: Number,
      default: 60,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending',
    },
    notes: {
      type: String,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
BookingSchema.index({ buyer: 1 });
BookingSchema.index({ seller: 1 });

export default mongoose.model('Booking', BookingSchema);
