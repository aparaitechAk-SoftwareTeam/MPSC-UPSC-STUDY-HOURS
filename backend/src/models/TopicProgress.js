const mongoose = require('mongoose');

const topicProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true
    },
    topicId: {
      type: String,
      required: true,
      trim: true
    },
    subjectId: {
      type: String,
      default: null
    },
    status: {
      type: String,
      enum: ['Not Started', 'In Progress', 'Completed', 'To Revise'],
      default: 'Not Started',
      required: true
    }
  },
  {
    timestamps: false,
    versionKey: false
  }
);

topicProgressSchema.index(
  { userId: 1, topicId: 1 },
  { unique: true }
);

module.exports =
  mongoose.models.TopicProgress ||
  mongoose.model('TopicProgress', topicProgressSchema);
