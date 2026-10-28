const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    userId: {
      type: String,
      required: true,
      index: true
    },
    subjectId: {
      type: String,
      default: null
    },
    minutes: {
      type: Number,
      required: true,
      min: 1,
      max: 1440
    },
    mode: {
      type: String,
      default: 'Pomodoro'
    },
    focusScore: {
      type: Number,
      default: 90,
      min: 0,
      max: 100
    },
    startedAt: {
      type: String,
      required: true
    }
  },
  {
    timestamps: false,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret.id || ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    },
    toObject: {
      transform: (doc, ret) => {
        ret.id = ret.id || ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

sessionSchema.index({ userId: 1, startedAt: -1 });

module.exports = mongoose.models.Session || mongoose.model('Session', sessionSchema);
