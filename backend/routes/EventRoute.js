const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const upload = require('../configs/multer');
const EventController = require('../controllers/EventController');
const { protect, isOrganizer } = require('../middlewares/auth');


router.post('/create-event',protect,isOrganizer,upload.array('images',5),EventController.createEvent);
router.get('/', EventController.getEvents);
router.get('/organizer/:organizerId',protect,isOrganizer,EventController.getEventsByOrganizer);
router.get('/:id',EventController.getEventById);
router.delete('/delete-event/:id',protect,isOrganizer,EventController.deleteEvent);
router.put('/edit-event-images/:id', protect, isOrganizer, upload.array('newImages',5), EventController.editEventImages);
router.put('/edit-event/:id', protect, isOrganizer, EventController.editEvent);

module.exports = router;
