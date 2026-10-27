const mongoose = require('mongoose');

const ticketReplySchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true
    },
    sender: {
      type: String,
      default: 'admin'
    },
    adminId: {
      type: String,
      required: true
    },
    adminName: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    createdAt: {
      type: String,
      required: true
    }
  },
  { _id: false }
);

const ticketSchema = new mongoose.Schema(
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
    type: {
      type: String,
      required: true
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Resolved'],
      default: 'Open'
    },
    createdAt: {
      type: String,
      required: true
    },
    updatedAt: {
      type: String,
      required: true
    },
    replies: {
      type: [ticketReplySchema],
      default: []
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

ticketSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.models.Ticket || mongoose.model('Ticket', ticketSchema);
