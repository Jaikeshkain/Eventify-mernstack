const QRGeneration=require("../models/ORGenrationModel")
const Ticket = require("../models/TicketModel");
const User = require("../models/UserModel");

//upload payment proof
exports.uploadPaymentProof = async (req, res) => {
    try {
      const userId=req.user._id
      const {
        qrLink,
        eventId,
        amount,
        quantity,
        eventName,
        upiId,
        status,
        userTxnId,
        verifiedAt,
      } = req.body;
      const proofImageUrl = {
        url: req.file.path,
        publicId: req.file.filename,
      };
      const qrGeneration = await QRGeneration.create({
        qrLink,
        userId,
        eventId,
        amount,
        quantity,
        upiId,
        status,
        userTxnId,
        verifiedAt,
        proofImageUrl,
      });
      if (!qrGeneration) {
        return res
          .status(400)
          .json({ message: "Failed to upload payment proof" });
      }
      // Check if a ticket already exists for this QR
      let ticket = await Ticket.findOne({ qrGeneration: qrGeneration._id });
      if (!ticket) {
        ticket = await Ticket.create({
          event: qrGeneration.eventId,
          user: qrGeneration.userId,
          qrCode: qrGeneration.qrLink,
          status: "pending",
          qrGeneration: qrGeneration._id,
        });
      }
      const user=await User.findById(userId)
      if(!user){
        return res.status(404).json({message:"User not found"})
      }
      user.tickets.push(ticket._id)
      await user.save()
      res
        .status(200)
        .json({
          message: "Payment is being processed, please wait for verification",
        });
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

//verify QR
exports.verifyQR=async(req,res)=>{
  try {
    const {qrId}=req.params
    const qr = await QRGeneration.findByIdAndUpdate(qrId,{status:"verified",verifiedAt:new Date()},{new:true})
    if(!qr){
      return res.status(404).json({message:"QR not found"})
    }
    if(qr.status==="verified"){
      const ticket=await Ticket.findOne({qrGeneration:qrId})
      if(!ticket){
        return res.status(404).json({message:"Ticket not found"})
      }
      await Ticket.findByIdAndUpdate(ticket._id,{status:"Booked"})
    }
    res.status(200).json({message:"QR verified successfully"})
  } catch (error) {
    console.log(error)
    res.status(500).json({message:error.message})
  }
}

//reject QR
exports.rejectQR = async (req, res) => {
  try {
    const { qrId } = req.params;
    const qr = await QRGeneration.findByIdAndUpdate(
      qrId,
      { status: "rejected", verifiedAt: new Date() },
      { new: true }
    );
    if (!qr) {
      return res.status(404).json({ message: "QR not found" });
    }
    if (qr.status === "rejected") {
      const ticket = await Ticket.findOne({ qrGeneration: qrId });
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }
      await Ticket.findByIdAndUpdate(ticket._id, { status: "Cancelled" });
    }
    res.status(200).json({ message: "QR rejected successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
