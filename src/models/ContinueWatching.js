import mongoose from "mongoose";

const continueWatchingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    mediaType: {
      type: String,
      enum: ["movie", "tv"],
      required: true,
      index: true,
    },

    mediaId: {
      type: Number,
      required: true,
    },

    seasonNumber: {
      type: Number,
      default: null,
    },

    episodeNumber: {
      type: Number,
      default: null,
    },

    /** 🔥 REAL PROGRESS */
    currentTime: {
      type: Number, // seconds
      default: 0,
      min: 0,
    },

    duration: {
      type: Number, // seconds
      default: null,
    },

    progress: {
      type: Number, // percentage (0–100)
      default: 0,
      min: 0,
      max: 100,
    },

    status: {
      type: String,
      enum: ["watching", "completed"],
      default: "watching",
    },

    lastSavedAt: {
      type: Date,
      default: Date.now,
    },

    lastWatchedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

continueWatchingSchema.index(
  {
    user: 1,
    mediaType: 1,
    mediaId: 1,
    seasonNumber: 1,
    episodeNumber: 1,
  },
  { unique: true }
);


const ContinueWatching = mongoose.model('ContinueWatching', continueWatchingSchema);

export default ContinueWatching;
