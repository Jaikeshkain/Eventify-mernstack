const Event = require("../models/EventModel");
const mongoose = require("mongoose");

const updateEventStatuses = async () => {
  try {
    const currentDate = new Date();

    // Update past events to "ended"
    await Event.updateMany(
      { date: { $lt: currentDate }, status: { $ne: "ended" } },
      { $set: { status: "ended" } }
    );

    // Update future events to "live" if not draft or ended
    await Event.updateMany(
      { date: { $gte: currentDate }, status: { $nin: ["draft", "ended"] } },
      { $set: { status: "live" } }
    );

    console.log("Event statuses updated based on date.");
  } catch (err) {
    console.error("Failed to update event statuses:", err);
  }
};

module.exports = updateEventStatuses;