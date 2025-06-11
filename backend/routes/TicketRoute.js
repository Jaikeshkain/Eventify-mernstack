const express = require("express");
const router = express.Router();
const { getTicketsForOrganizer, getTicketsForAttendee } = require("../controllers/TicketController");
const { protect, isOrganizer, isAttendee } = require("../middlewares/auth");


router.get("/get-tickets-by-organizer",protect,isOrganizer, getTicketsForOrganizer);
router.get("/get-tickets-by-attendee",protect,isAttendee, getTicketsForAttendee);
// router.patch("/:id/verify",protect,isOrganizer, verifyPayment);

module.exports = router;