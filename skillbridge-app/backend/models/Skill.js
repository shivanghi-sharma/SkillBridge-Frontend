import mongoose from 'mongoose';

const SkillSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a skill title'],
      trim: true,
      maxlength: [50, 'Title can not be more than 50 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [1000, 'Description can not be more than 1000 characters'],
    },
    seller: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    price: {
      type: Number,
      required: [true, 'Please add a price or 0 for free exchange'],
    },
    duration: {
      type: Number, // duration in minutes
      default: 60,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    tags: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for search functionality
SkillSchema.index({ title: 'text', description: 'text', tags: 'text' });
SkillSchema.index({ seller: 1 });
SkillSchema.index({ category: 1 });

export default mongoose.model('Skill', SkillSchema);
