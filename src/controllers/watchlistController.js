import Watchlist, { WATCHLIST_STATUSES } from "../models/Watchlist.js";

/* -------------------------------------------------------------------------- */
/*                               UPSERT ITEM                                  */
/* -------------------------------------------------------------------------- */
/**
 * Adds item if not exists, otherwise updates status
 * POST /api/watchlist
 */
export const upsertWatchlistItem = async (req, res) => {
  try {
    const userId = req.user.id;
    let { mediaType, mediaId, status } = req.body;

    if (!mediaType || mediaId === undefined) {
      return res.status(400).json({
        message: "mediaType and mediaId are required",
      });
    }

    mediaId = Number(mediaId);
    if (Number.isNaN(mediaId)) {
      return res.status(400).json({ message: "Invalid mediaId" });
    }

    if (status && !WATCHLIST_STATUSES.includes(status)) {
      return res.status(400).json({ message: "Invalid watchlist status" });
    }

    const update = {};
    if (status) update.status = status;

    const item = await Watchlist.findOneAndUpdate(
      { user: userId, mediaType, mediaId },
      update,
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    res.status(200).json(item);
  } catch (error) {
    console.error("Watchlist upsert error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* -------------------------------------------------------------------------- */
/*                               GET WATCHLIST                                */
/* -------------------------------------------------------------------------- */
/**
 * GET /api/watchlist?status=&mediaType=
 */
export const getWatchlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, mediaType } = req.query;

    const filter = { user: userId };

    if (status) filter.status = status;
    if (mediaType) filter.mediaType = mediaType;

    const list = await Watchlist.find(filter).sort({ updatedAt: -1 });

    res.status(200).json(list);
  } catch (error) {
    console.error("Get Watchlist error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* -------------------------------------------------------------------------- */
/*                          UPDATE WATCHLIST STATUS                            */
/* -------------------------------------------------------------------------- */
/**
 * PUT /api/watchlist/:id
 */
export const updateWatchlistStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { status } = req.body;

    if (!WATCHLIST_STATUSES.includes(status)) {
      return res.status(400).json({ message: "Invalid watchlist status" });
    }

    const item = await Watchlist.findOneAndUpdate(
      { _id: id, user: userId },
      { status },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ message: "Watchlist item not found" });
    }

    res.status(200).json(item);
  } catch (error) {
    console.error("Update Watchlist Status error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* -------------------------------------------------------------------------- */
/*                              REMOVE ITEM                                   */
/* -------------------------------------------------------------------------- */
/**
 * DELETE /api/watchlist/:id
 */
export const removeWatchlistItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const deleted = await Watchlist.findOneAndDelete({
      _id: id,
      user: userId,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Watchlist item not found" });
    }

    res.status(200).json({ message: "Removed from watchlist" });
  } catch (error) {
    console.error("Remove Watchlist error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
