const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
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
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      trim: true,
      default: ''
    },
    examTarget: {
      type: String,
      trim: true,
      default: 'MPSC / UPSC'
    },
    preferredSubjects: {
      type: String,
      trim: true,
      default: 'Polity, History'
    },
    role: {
      type: String,
      required: true,
      enum: ['student', 'admin'],
      default: 'student'
    },
    passwordHash: {
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

userSchema.methods.toPublicJSON = function () {
  const obj = this.toJSON();
  delete obj.passwordHash;
  return obj;
};

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
