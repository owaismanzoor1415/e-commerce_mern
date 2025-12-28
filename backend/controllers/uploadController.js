const { cloudinary } = require("../config/cloudinary");

// @desc    Upload image to Cloudinary
// @route   POST /api/upload
// @access  Admin (should add admin middleware)
exports.uploadImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                errors: "No image file provided",
            });
        }

        // The file is already uploaded to Cloudinary by multer
        // req.file.path contains the Cloudinary URL
        res.json({
            success: true,
            message: "Image uploaded successfully",
            image_url: req.file.path,
            public_id: req.file.filename,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete image from Cloudinary
// @route   DELETE /api/upload/:publicId
// @access  Admin
exports.deleteImage = async (req, res, next) => {
    try {
        const { publicId } = req.params;

        if (!publicId) {
            return res.status(400).json({
                success: false,
                errors: "Public ID is required",
            });
        }

        const result = await cloudinary.uploader.destroy(publicId);

        if (result.result === "ok") {
            res.json({
                success: true,
                message: "Image deleted successfully",
            });
        } else {
            res.status(400).json({
                success: false,
                errors: "Failed to delete image",
            });
        }
    } catch (error) {
        next(error);
    }
};
