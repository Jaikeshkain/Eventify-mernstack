const Event = require('../models/EventModel');
const cloudinary = require("cloudinary").v2;

//End Event Logic
function getEventStatusIST(date, time, duration = 2) {
  if (!date || !time) {
    console.error("Invalid date or time input", date, time);
    return "invalid";
  }

  const [year, month, day] = date.split("-").map(Number);
  const [hours, minutes] = time.split(":").map(Number);

  if (
    isNaN(year) ||
    isNaN(month) ||
    isNaN(day) ||
    isNaN(hours) ||
    isNaN(minutes)
  ) {
    console.error("Invalid date/time format");
    return "invalid";
  }

  // IST offset in minutes
  const IST_OFFSET_MINUTES = 5 * 60 + 30; // 330

  // Create a Date object in IST (treat input as IST time)
  // Construct a Date object assuming IST local time
  // We will create a UTC date equivalent by subtracting IST offset

  // Calculate the UTC timestamp corresponding to the given IST datetime:
  // Date.UTC(year, monthIndex, day, hour, minute) returns timestamp in UTC.
  // So subtract IST offset to get UTC time.

  // Step 1: create UTC timestamp without offset (assuming input as UTC)
  const utcTimestamp = Date.UTC(year, month - 1, day, hours, minutes);

  // Step 2: subtract IST offset in milliseconds to convert from IST to UTC
  const startUTC = new Date(utcTimestamp - IST_OFFSET_MINUTES * 60 * 1000);

  if (isNaN(startUTC)) {
    console.error("startUTC is invalid date");
    return "invalid";
  }

  // Calculate end time based on duration
  const endUTC = new Date(startUTC.getTime() + duration * 60 * 60 * 1000);

  const nowUTC = new Date();


  if (nowUTC < startUTC) return "upcoming";
  if (nowUTC >= startUTC && nowUTC <= endUTC) return "live";
  return "ended";
}



// Create a new event
exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      tags,
      category,
      venue,
      address,
      link,
      date,
      time,
      duration,
      type,
      price,
      capacity,
      status,
    } = req.body;


    //status logic
    let eventStatus = status;
    if (status !== "draft") {
      eventStatus = getEventStatusIST(date, time,duration);
    }


    // Attach organizer from authenticated user if available
    const organizer = req.user ? req.user._id : undefined;
    if (!organizer) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Organizer not found." });
    }

    const uploadedImages = req.files.map((file) => ({
      url: file.path,
      publicId: file.filename,
    }));

    const event = await Event.create({
      organizer,
      title,
      description,
      tags,
      category,
      images: uploadedImages,
      location: {
        venue,
        address,
        link,
      },
      date,
      time,
      type,
      price,
      capacity,
      status: eventStatus,
    });

    if (!event) {
      return res.status(400).json({ message: "Event not created" });
    }
    res.status(201).json({ message: "Event created successfully", event });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Get all events except draft with filters
// Get all events except draft and ended, with filters
exports.getEvents = async (req, res) => {
  try {
    // 1. Update statuses of all non-draft and non-ended events if changed
    const eventsToUpdate = await Event.find({
      status: { $nin: ["draft", "ended"] },
    });

    const bulkOps = [];

    for (const event of eventsToUpdate) {
      const eventDateStr =
        event.date instanceof Date
          ? event.date.toISOString().split("T")[0]
          : event.date; // in case it's already a string

      const eventTimeStr = event.time; // this should already be a string like "16:45"
      const newStatus = getEventStatusIST(eventDateStr, eventTimeStr);
      if (event.status !== newStatus) {
        bulkOps.push({
          updateOne: {
            filter: { _id: event._id },
            update: { status: newStatus },
          },
        });
      }
    }

    if (bulkOps.length > 0) {
      await Event.bulkWrite(bulkOps);
    }

    // 2. Fetch events after update
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const { search, category, type, minPrice, maxPrice, sortBy, order } =
      req.query;

    const query = {
      status: { $nin: ["draft", "ended"] },
    };

    if (category) query.category = category;
    if (type) query.type = type;
    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { "location.venue": searchRegex },
        { "location.address": searchRegex },
      ];
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const sortField = sortBy || "createdAt";
    const sortOrder = order === "asc" ? 1 : -1;

    const events = await Event.find(query)
      .sort({ [sortField]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit)
      .select("-__v")
      .lean();

    const totalEvents = await Event.countDocuments(query);
    const totalPages = Math.ceil(totalEvents / limit);

    res.status(200).json({
      events,
      pagination: { totalPages, totalEvents, currentPage: page },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};



// Get events by organizer
exports.getEventsByOrganizer = async (req, res) => {
  try {
    const {organizerId} = req.params;
    const {page,limit} = req.query;
    const {search,status} = req.query;


    const query = {};

    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { location: searchRegex },
      ];
    }

    if(status){
      query.status=status;
    }

    const events = await Event.find({organizer:organizerId, ...query})
    .skip((page - 1) * limit)
    .limit(limit)
    .select("-__v")
    .lean();

    const totalEvents = await Event.countDocuments({organizer:organizerId, ...query});
    const totalPages = Math.ceil(totalEvents / limit);

    res.status(200).json({ events, pagination: { totalPages, totalEvents } });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message || "Server error" });
  }
}

exports.getEventById=async(req,res,next)=>{
  try {
    const {id}=req.params
    const event=await Event.findById(id)
    if(!event){
      return res.status(404).json({message:"Event not found"})
    }
    res.status(200).json({event})
  } catch (error) {
    console.log(error);
    res.status(500).json({message:error.message || "Server error"});
  }
}

//delete an event
exports.deleteEvent=async(req,res,next)=>{
  try {
    const {id}=req.params
    const event= await Event.findByIdAndDelete(id)
    if(!event){
    return res.status(404).json({message:"Event not found"})
  }
  res.status(200).json({message:"Event deleted successfully"})
  } catch (error) {
    console.log(error);
    res.status(500).json({message:error.message || "Server error"});
  }
}

//edit event images

exports.editEventImages = async (req, res) => {
  try {
    const { id } = req.params;
    // keepImages received as array of publicIds in req.body.keepImages
    // If sent as JSON string, parse it
    let keepImages = req.body.keepImages;
    if (typeof keepImages === "string") {
      keepImages = JSON.parse(keepImages);
    }

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Delete images that are NOT in keepImages
    const imagesToDelete = event.images.filter(
      (img) => !keepImages.includes(img.publicId)
    );

    for (let img of imagesToDelete) {
      await cloudinary.uploader.destroy(img.publicId);
    }

    // req.files already contains new images uploaded to Cloudinary
    // multer-storage-cloudinary stores info about uploaded files inside req.files with .path and .filename
    // Map uploaded files to your images format: { url, publicId }
    const newUploadedImages = req.files.map((file) => ({
      url: file.path, // Cloudinary URL
      publicId: file.filename, // Cloudinary public id
    }));

    // Combine kept images + new uploaded images
    const updatedImages = [
      ...event.images.filter((img) => keepImages.includes(img.publicId)),
      ...newUploadedImages,
    ];

    // Save updated images array in event
    event.images = updatedImages;
    await event.save();

    res.status(200).json({
      message: "Event images updated successfully",
      images: event.images,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update event images" });
  }
};

//edit event
exports.editEvent = async (req, res, next) => {
  try{
    const {id}=req.params
    const {status}=req.body
    if(status!=="draft"){
      req.body.status=getEventStatusIST(req.body.date,req.body.time)
    }
    const event=await Event.findByIdAndUpdate(id,req.body,{new:true})
    if(!event){
      return res.status(404).json({message:"Event not found"})
    }
    res.status(200).json({message:"Event updated successfully",event})
  }catch(error){
    console.log(error);
    res.status(500).json({message:error.message || "Server error"});
  }
}

//get upcoming events
exports.getUpcomingEvents=async(req,res,next)=>{
  try {
    const events=await Event.find({status:"upcoming"})
    if(!events){
      return res.status(404).json({message:"No upcoming events found"})
    }
    res.status(200).json({events})
  } catch (error) {
    console.log(error);
    res.status(500).json({message:error.message || "Server error"});
  }
}