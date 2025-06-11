const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const upload = require("../configs/multer");
const { protect, isOrganizer } = require("../middlewares/auth");
const QRPaymentController = require("../controllers/QRPaymentController");

router.post("/payment",protect,upload.single("proofImageUrl"),QRPaymentController.uploadPaymentProof);
router.patch("/verify/:qrId",protect,isOrganizer,QRPaymentController.verifyQR);
router.patch("/reject/:qrId",protect,isOrganizer,QRPaymentController.rejectQR);

module.exports = router;