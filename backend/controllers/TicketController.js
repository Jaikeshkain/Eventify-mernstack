const QRGeneration = require("../models/ORGenrationModel");
const Ticket = require("../models/TicketModel");
const Event = require("../models/EventModel");


//get tickets for organizer
exports.getTicketsForOrganizer = async (req, res) => {
  try {
    const organizerId = req.user._id;
    const { status, eventId, search, page = 1, limit = 10 } = req.query;

    // Step 1: Get event IDs belonging to this organizer
    const events = await Event.find({ organizer: organizerId }).select("_id");
    const eventIds = events.map((event) => event._id);

    if (!eventIds.length) {
      return res.status(200).json({ tickets: [], total: 0 });
    }

    // Step 2: Build filter query
    const query = { event: { $in: eventIds } };

    if (status) query.status = status; // e.g., 'pending'
    if (eventId) query.event = eventId;

    // Step 3: Query tickets with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let ticketsQuery = Ticket.aggregate([
      { $match: query },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userData'
        }
      },
      {
        $lookup: {
          from: 'events',
          localField: 'event',
          foreignField: '_id',
          as: 'eventData'
        }
      },
      {
        $lookup: {
          from: 'qrgenerations',
          localField: 'qrGeneration',
          foreignField: '_id',
          as: 'qrData'
        }
      },
      {
        $addFields: {
          user: { $arrayElemAt: ['$userData', 0] },
          event: { $arrayElemAt: ['$eventData', 0] },
          qrGeneration: { $arrayElemAt: ['$qrData', 0] }
        }
      },
      {
        $project: {
          userData: 0,
          eventData: 0,
          qrData: 0
        }
      }
    ]);

    if (search) {
      const searchRegex = new RegExp(search, "i");
      ticketsQuery = ticketsQuery.match({
        $or: [
          { "user.username": searchRegex },
          { "user.email": searchRegex },
          { "event.title": searchRegex }
        ]
      });
    }

    const tickets = await ticketsQuery
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));


    const total = await Ticket.countDocuments(query);

    // Step 4: Send response
    res.status(200).json({
      tickets,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (error) {
    console.error("Error fetching organizer tickets:", error);
    res.status(500).json({ message: "Server error while fetching tickets" });
  }
};

//get tickets for attendee
exports.getTicketsForAttendee = async (req, res) => {
  try {
    const attendeeId = req.user._id;
    const tickets = await Ticket.find({ user: attendeeId }).populate("event").populate("qrGeneration");
    if(!tickets){
      return res.status(404).json({message:"No tickets found"})
    }
    res.status(200).json({ tickets });
  } catch (error) {
    console.error("Error fetching attendee tickets:", error);
    res.status(500).json({ message: "Server error while fetching tickets" });
  }
};


// GET /api/tickets/:id
exports.getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate("event");
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};





