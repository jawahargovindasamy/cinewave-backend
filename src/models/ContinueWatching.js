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
    progress: {
      type: Number, // seconds watched
      required: true,
      default: 0,
      min: 0,
    },

    duration: {
      type: Number, // total duration in seconds
      default: null,
    },

    lastWatchedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
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
