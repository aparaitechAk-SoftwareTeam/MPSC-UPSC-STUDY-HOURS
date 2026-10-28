const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    paper: {
      type: String,
      default: 'GS Paper II',
      trim: true
    },
    topics: {
      type: Number,
      default: 0
    },
    completed: {
      type: Number,
      default: 0
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

module.exports = mongoose.models.Subject || mongoose.model('Subject', subjectSchema);
