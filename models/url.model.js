import mongoose from "mongoose";

const URLSchema = new mongoose.Schema(
  {
    shortID: {
      type: String,
      required: true,
      unique: true,
    },
    redirectURL: {
      type: String,
      required: true,
      unique: true,
    },
    visitHistory: [{ timestamp: { type: Date, default: Date.now } }],

    ownerEmail: {
      type: String,
      required: true,
    },
    milestone: {
      type: Number,
      default: 10,
    },
    milestoneNotified: {
      type: Boolean,
      default: false,
    },
    clickCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const URL = mongoose.model("url", URLSchema);

export { URL };
