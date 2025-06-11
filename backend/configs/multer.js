const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

//configure cloudinary
cloudinary.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
});

//configure multer storage cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "event-images", //folder that displays in our dashboard
    format: async (req, file) => "png", //specific format image
    public_id: (req, file) => file.fieldname + "_" + Date.now(), //filename to dlete
  },
});

//configure multer
const upload = multer({
  storage: storage,
  limits: 1024 * 1024 * 5,
  fileFilter: function (req, file, callbck) {
    if (file.mimetype.startsWith("image/")) {
      callbck(null, true);
    } else {
      callbck(new Error("Not an image! Please Upload an image", false));
    }
  },
});

module.exports = upload;
