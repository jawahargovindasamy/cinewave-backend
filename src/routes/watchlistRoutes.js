import express from "express";
import {
  upsertWatchlistItem,
  getWatchlist,
  updateWatchlistStatus,
  removeWatchlistItem,
} from "../controllers/watchlistController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * GET    /api/watchlist
 * POST   /api/watchlist
 */
router.route("/").get(protect, getWatchlist).post(protect, upsertWatchlistItem);

/**
 * PUT    /api/watchlist/:id
 * DELETE /api/watchlist/:id
 */
router
  .route("/:id")
  .put(protect, updateWatchlistStatus)
  .delete(protect, removeWatchlistItem);

export default router;
