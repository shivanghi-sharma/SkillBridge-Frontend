import mongoose from 'mongoose';
import User from './User.js';

const ReviewSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.ObjectId,
      ref: 'Booking',
      required: true,
    },
    reviewer: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    reviewee: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Please add a rating between 1 and 5'],
    },
    comment: {
      type: String,
      required: [true, 'Please add a comment'],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent user from submitting more than one review per booking
ReviewSchema.index({ booking: 1, reviewer: 1 }, { unique: true });
ReviewSchema.index({ reviewee: 1 });

// Static method to get average rating and save it to the User model
ReviewSchema.statics.getAverageRating = async function (revieweeId) {
  const obj = await this.aggregate([
    {
      $match: { reviewee: revieweeId },
    },
    {
      $group: {
        _id: '$reviewee',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  try {
    if (obj[0]) {
      await User.findByIdAndUpdate(revieweeId, {
        rating: Math.round(obj[0].averageRating * 10) / 10,
        totalReviews: obj[0].totalReviews,
      });
    } else {
      await User.findByIdAndUpdate(revieweeId, {
        rating: 0,
        totalReviews: 0,
      });
    }
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageRating after saving a review
ReviewSchema.post('save', async function () {
  await this.constructor.getAverageRating(this.reviewee);
});

// Call getAverageRating after deleting a review
ReviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await doc.constructor.getAverageRating(doc.reviewee);
  }
});

export default mongoose.model('Review', ReviewSchema);
