import mongoose from "mongoose";

const WATCHLIST_STATUSES = [
  "plan_to_watch",
  "watching",
  "on_hold",
  "dropped",
  "completed",
];

const watchlistSchema = new mongoose.Schema(
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
    status: {
      type: String,
      enum: WATCHLIST_STATUSES,
      default: "plan_to_watch",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

watchlistSchema.index({ user: 1, mediaType: 1, mediaId: 1 }, { unique: true });

const Watchlist = mongoose.model('Watchlist', watchlistSchema);

export default Watchlist;

export { WATCHLIST_STATUSES };