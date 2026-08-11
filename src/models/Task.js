const mongoose = require('mongoose');

const STATUS_VALUES = ['pending', 'in-progress', 'completed'];
const PRIORITY_VALUES = ['low', 'medium', 'high'];

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    status: {
      type: String,
      enum: {
        values: STATUS_VALUES,
        message: 'Status must be one of: pending, in-progress, completed',
      },
      default: 'pending',
    },
    priority: {
      type: String,
      enum: {
        values: PRIORITY_VALUES,
        message: 'Priority must be one of: low, medium, high',
      },
      default: 'medium',
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
