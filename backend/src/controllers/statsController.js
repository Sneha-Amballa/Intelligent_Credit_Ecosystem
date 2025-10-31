require("mongoose");
const path = require("path");
const { readFileSync } = require("fs");
const Stats = require("../models/stats");

const initialProgress = new Array(5).fill({
  lessonId: 0,
  minilessonId: 0,
  blockId: 0,
});

const initializeStats = async (username) => {
  try {
    const newStats = new Stats({
      username,
      completionPercentages: new Array(5).fill(0),
      points: new Array(5).fill(0),
      correctAnswers: 0,
      incorrectAnswers: 0,
      progress: initialProgress,
    });

    const updatedStats = await newStats.save();
    return updatedStats;
  } catch (err) {
    console.error("Error initializing stats:", err);
    throw err;
  }
};

const deleteStats = async (username) => {
  try {
    await Stats.deleteOne({ username: username });
    console.log(`Stats for user ${username} deleted successfully.`);
  } catch (err) {
    console.error("Error deleting stats:", err);
    throw err;
  }
};

const getStats = async (req, res) => {
  try {
    const { username } = req.params;
    const stats = await Stats.findOne({ username: username });

    if (!stats) {
      return res
        .status(404)
        .json({ success: false, message: "Stats not found" });
    }

    const statsResponse = createStatsResponse(stats);

    res.status(200).json({ success: true, statsResponse });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error retrieving stats",
      error: err.message,
    });
  }
};

const updateStats = async (req, res) => {
  try {
    const { username } = req.params;
    const updateData = req.body;

    const updateDataProgress = updateData.progress;
    const userOldStats = await Stats.findOne({ username });

    if (updateDataProgress != null) {
      let progress = userOldStats.progress;
      if (progress.length == 0) progress = initialProgress;
      progress[updateDataProgress.locationId] = {
        lessonId: updateDataProgress.lessonId,
        minilessonId: updateDataProgress.minilessonId,
        blockId: updateDataProgress.blockId,
      };
      updateData.progress = progress;
      updateData.completionPercentages = userOldStats.completionPercentages;
      updateData.completionPercentages[updateDataProgress.locationId] =
        updateCompletionPercentage(
          updateDataProgress,
          updateDataProgress.locationName
        );
    }

    if (updateData.correctAnswers) {
      updateData.correctAnswers += userOldStats.correctAnswers;
    }

    if (updateData.incorrectAnswers) {
      updateData.incorrectAnswers += userOldStats.incorrectAnswers;
    }

    if (updateData.locationId >= 0 && updateData.newPoints > 0) {
      updateData.points = userOldStats.points;
      updateData.points[updateData.locationId] += updateData.newPoints;
    }

    const updatedStats = await Stats.findOneAndUpdate(
      { username: username },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedStats) {
      return res.status(404).json({
        success: false,
        message: "Stats not found for the given username",
      });
    }

    const statsResponse = createStatsResponse(updatedStats);

    res.status(200).json({
      success: true,
      message: "Stats updated successfully",
      data: statsResponse,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error updating stats",
      error: err.message,
    });
  }
};

const resetStats = async (req, res) => {
  try {
    const { username } = req.params;

    const oldStats = await Stats.findOneAndDelete({ username });
    if (!oldStats) {
      return res
        .status(404)
        .json({ success: false, message: "Stats not found" });
    }

    const resetedStats = await initializeStats(username);

    res.status(200).json({
      success: true,
      message: "Stats reseted successfully",
      data: resetedStats,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error reseting stats",
      error: err.message,
    });
  }
};

function createStatsResponse(stats) {
  const totalCompletion =
    stats.completionPercentages.length > 0
      ? stats.completionPercentages.reduce((a, b) => a + b, 0) /
        stats.completionPercentages.length
      : 0;

  const totalPoints = stats.points.reduce((a, b) => a + b, 0);

  const totalAnswers = stats.correctAnswers + stats.incorrectAnswers;
  const correctAnswersPercentage =
    totalAnswers > 0 ? (stats.correctAnswers / totalAnswers) * 100 : 0;

  return {
    username: stats.username,
    completionPercentages: stats.completionPercentages,
    points: stats.points,
    correctAnswers: stats.correctAnswers,
    incorrectAnswers: stats.incorrectAnswers,
    totalCompletion: totalCompletion,
    totalPoints: totalPoints,
    correctAnswersPercentage: correctAnswersPercentage,
    progress: stats.progress,
  };
}

function updateCompletionPercentage(updateDataProgress, locationName) {
  const locationDataPath = path.join(
    __dirname,
    "..",
    "langchain",
    "docs",
    locationName + ".json"
  );

  const locationData = readFileSync(locationDataPath);
  const locationJsonObject = JSON.parse(locationData);

  return calculateProgress(
    locationJsonObject,
    updateDataProgress.lessonId,
    updateDataProgress.minilessonId,
    updateDataProgress.blockId
  );
}

function calculateProgress(
  lessons,
  lastLessonId,
  lastMinilessonId,
  lastBlockId
) {
  let totalBlocks = 0;
  let completedBlocks = 0;

  lessons.forEach((lesson, index) => {
    totalBlocks += lesson.mini_lessons.length * 3;

    if (index < lastLessonId) {
      completedBlocks += lesson.mini_lessons.length * 3;
    } else if (index === lastLessonId) {
      completedBlocks += lastMinilessonId * 3 + lastBlockId + 1;
    }
  });

  if (completedBlocks === 1) completedBlocks = 0;

  if (completedBlocks > totalBlocks) completedBlocks = totalBlocks;

  return (completedBlocks / totalBlocks) * 100;
}

module.exports = {
  initializeStats,
  deleteStats,
  getStats,
  updateStats,
  resetStats,
};
