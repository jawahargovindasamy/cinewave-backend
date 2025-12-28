import ContinueWatching from "../models/ContinueWatching.js";

// Add or update continue watching entry
export const upsertContinueWatching = async (req, res) => {
  try {
    const userId = req.user.id;
    const { mediaType, mediaId, seasonNumber = null, episodeNumber = null } = req.body;

    if (!mediaType || !mediaId) {
      return res.status(400).json({
        message: "mediaType and mediaId are required",
      });
    }

    const entry = await ContinueWatching.findOneAndUpdate(
      {
        user: userId,
        mediaType,
        mediaId,
        seasonNumber,
        episodeNumber,
      },
      {
        lastWatchedAt: new Date(),
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    res.status(200).json(entry);
  } catch (error) {
    console.error("ContinueWatching upsert error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user's continue watching list
export const getContinueWatching = async (req, res) => {
  try {
    const userId = req.user.id;

    const list = await ContinueWatching.find({ user: userId })
      .sort({ lastWatchedAt: -1 })
      .limit(20);

    res.status(200).json(list);
  } catch (error) {
    console.error("Get ContinueWatching error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Remove a continue watching entry
export const removeContinueWatching = async (req, res) => {
  try {
    const userId = req.user.id;
    const { mediaType, mediaId, seasonNumber = null, episodeNumber = null } = req.body;

    await ContinueWatching.findOneAndDelete({
      user: userId,
      mediaType,
      mediaId,
      seasonNumber,
      episodeNumber,
    });

    res.status(200).json({ message: "Removed from continue watching" });
  } catch (error) {
    console.error("Remove ContinueWatching error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
