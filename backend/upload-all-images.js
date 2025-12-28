/**
 * Upload ALL images from local folder to Cloudinary
 * This uploads images first, then you can assign them to products
 */

require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload image to Cloudinary
const uploadToCloudinary = async (filePath, filename) => {
    try {
        console.log(`📤 Uploading ${filename}...`);

        const result = await cloudinary.uploader.upload(filePath, {
            folder: "ecommerce-products",
            public_id: filename.replace(/\.[^/.]+$/, ""), // Remove extension
            resource_type: "image",
        });

        console.log(`✅ Success: ${result.secure_url}\n`);
        return {
            filename,
            url: result.secure_url,
            public_id: result.public_id,
        };
    } catch (error) {
        console.error(`❌ Failed ${filename}:`, error.message, "\n");
        return null;
    }
};

// Main function
const uploadAllImages = async () => {
    try {
        console.log("╔════════════════════════════════════════════════╗");
        console.log("║  Upload All Images to Cloudinary              ║");
        console.log("╚════════════════════════════════════════════════╝\n");

        // Directory with local images
        const imagesDir = path.join(__dirname, "upload", "images");

        if (!fs.existsSync(imagesDir)) {
            console.error(`❌ Images directory not found: ${imagesDir}`);
            return;
        }

        const imageFiles = fs.readdirSync(imagesDir)
            .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));

        console.log(`📁 Found ${imageFiles.length} images in upload folder\n`);

        if (imageFiles.length === 0) {
            console.log("⚠️ No images to upload!");
            return;
        }

        const results = [];
        let successCount = 0;
        let failCount = 0;

        // Upload each image
        for (const filename of imageFiles) {
            const filePath = path.join(imagesDir, filename);
            const result = await uploadToCloudinary(filePath, filename);

            if (result) {
                results.push(result);
                successCount++;
            } else {
                failCount++;
            }
        }

        // Summary
        console.log("\n" + "=".repeat(70));
        console.log("📊 UPLOAD SUMMARY");
        console.log("=".repeat(70));
        console.log(`✅ Successfully uploaded: ${successCount}`);
        console.log(`❌ Failed: ${failCount}`);
        console.log(`📦 Total files: ${imageFiles.length}`);
        console.log("=".repeat(70));

        if (successCount > 0) {
            console.log("\n📋 UPLOADED IMAGES:\n");
            results.forEach((r, i) => {
                console.log(`${i + 1}. ${r.filename}`);
                console.log(`   URL: ${r.url}\n`);
            });

            // Save URLs to file for reference
            const outputFile = "cloudinary-urls.json";
            fs.writeFileSync(
                outputFile,
                JSON.stringify(results, null, 2)
            );
            console.log(`\n💾 URLs saved to: ${outputFile}`);
            console.log("\n✨ All images are now on Cloudinary!");
            console.log("\n📝 Next step: Update your products manually in admin panel");
            console.log("   or run the database update script.\n");
        }

    } catch (error) {
        console.error("\n❌ Upload failed:", error.message);
        console.error(error.stack);
    }
};

// Run upload
uploadAllImages()
    .then(() => {
        console.log("✅ Upload script completed!\n");
        process.exit(0);
    })
    .catch((error) => {
        console.error("❌ Script failed:", error);
        process.exit(1);
    });
