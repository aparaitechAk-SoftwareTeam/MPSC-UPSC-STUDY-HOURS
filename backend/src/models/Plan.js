const mongoose = require('mongoose');

const planSchema = new mongoose.Schema(
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
    title: {
      type: String,
      required: true,
      trim: true
    },
    minutes: {
      type: Number,
      required: true,
      min: 1
    },
    date: {
      type: String,
      required: true
    },
    subjectId: {
      type: String,
      default: null
    },
    done: {
      type: Boolean,
      default: false
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

planSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.models.Plan || mongoose.model('Plan', planSchema);
