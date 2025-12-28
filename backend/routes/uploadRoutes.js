const express = require("express");
const router = express.Router();
const { upload } = require("../config/cloudinary");
const { uploadImage, deleteImage } = require("../controllers/uploadController");

// Upload single image
router.post("/", upload.single("product"), uploadImage);

// Delete image
router.delete("/:publicId", deleteImage);

module.exports = router;
