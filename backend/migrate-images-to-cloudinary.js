/**
 * Migration Script: Upload Local Images to Cloudinary
 * 
 * This script:
 * 1. Reads all images from upload/images folder
 * 2. Uploads them to Cloudinary
 * 3. Updates database product records with new Cloudinary URLs
 * 
 * Run: node migrate-images-to-cloudinary.js
 */

require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Product Model (same as in models/Product.js)
const Product = mongoose.model("Product", {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    new_price: { type: Number },
    old_price: { type: Number },
    date: { type: Date, default: Date.now },
    available: { type: Boolean, default: true },
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

        console.log(`✅ Uploaded: ${result.secure_url}`);
        return result.secure_url;
    } catch (error) {
        console.error(`❌ Failed to upload ${filename}:`, error.message);
        return null;
    }
};

// Main migration function
const migrateImages = async () => {
    try {
        console.log("🚀 Starting Image Migration to Cloudinary...\n");

        // Check Cloudinary credentials
        if (!process.env.CLOUDINARY_CLOUD_NAME ||
            !process.env.CLOUDINARY_API_KEY ||
            !process.env.CLOUDINARY_API_SECRET) {
            console.error("❌ ERROR: Cloudinary credentials not found in .env file!");
            console.log("\nPlease add these to your .env file:");
            console.log("CLOUDINARY_CLOUD_NAME=your_cloud_name");
            console.log("CLOUDINARY_API_KEY=your_api_key");
            console.log("CLOUDINARY_API_SECRET=your_api_secret\n");
            process.exit(1);
        }

        // Connect to MongoDB
        console.log("🔌 Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected\n");

        // Get all products from database
        const products = await Product.find({});
        console.log(`📦 Found ${products.length} products in database\n`);

        if (products.length === 0) {
            console.log("⚠️  No products found in database. Nothing to migrate.");
            await mongoose.connection.close();
            return;
        }

        // Directory with local images
        const imagesDir = path.join(__dirname, "upload", "images");

        if (!fs.existsSync(imagesDir)) {
            console.error(`❌ Images directory not found: ${imagesDir}`);
            await mongoose.connection.close();
            return;
        }

        const imageFiles = fs.readdirSync(imagesDir);
        console.log(`📁 Found ${imageFiles.length} images in upload folder\n`);

        let migratedCount = 0;
        let skippedCount = 0;
        let failedCount = 0;

        // Process each product
        for (const product of products) {
            console.log(`\n--- Processing Product ID: ${product.id} ---`);
            console.log(`Name: ${product.name}`);
            console.log(`Current Image: ${product.image}`);

            // Check if already a Cloudinary URL
            if (product.image.includes("cloudinary.com") || product.image.includes("res.cloudinary")) {
                console.log("⏭️  Already using Cloudinary URL, skipping...");
                skippedCount++;
                continue;
            }

            // Extract filename from path like "/images/product_123.png"
            const imageFilename = product.image.replace("/images/", "");
            const localImagePath = path.join(imagesDir, imageFilename);

            // Check if local file exists
            if (!fs.existsSync(localImagePath)) {
                console.log(`⚠️  Local file not found: ${imageFilename}, skipping...`);
                failedCount++;
                continue;
            }

            // Upload to Cloudinary
            const cloudinaryUrl = await uploadToCloudinary(localImagePath, imageFilename);

            if (cloudinaryUrl) {
                // Update product in database
                await Product.updateOne(
                    { _id: product._id },
                    { $set: { image: cloudinaryUrl } }
                );
                console.log(`✅ Updated database with new URL`);
                migratedCount++;
            } else {
                console.log(`❌ Failed to migrate ${imageFilename}`);
                failedCount++;
            }
        }

        // Summary
        console.log("\n" + "=".repeat(50));
        console.log("📊 MIGRATION SUMMARY");
        console.log("=".repeat(50));
        console.log(`✅ Successfully migrated: ${migratedCount}`);
        console.log(`⏭️  Already on Cloudinary: ${skippedCount}`);
        console.log(`❌ Failed: ${failedCount}`);
        console.log(`📦 Total products: ${products.length}`);
        console.log("=".repeat(50));

        if (migratedCount > 0) {
            console.log("\n🎉 Migration completed successfully!");
            console.log("\n💡 Next steps:");
            console.log("1. Restart your backend server");
            console.log("2. Test the frontend - images should now load from Cloudinary");
            console.log("3. You can safely delete the local upload/images folder (optional)");
        }

        // Close MongoDB connection
        await mongoose.connection.close();
        console.log("\n✅ MongoDB connection closed");

    } catch (error) {
        console.error("\n❌ Migration failed:", error.message);
        console.error(error.stack);
        process.exit(1);
    }
};

// Run migration
console.log("╔════════════════════════════════════════════════╗");
console.log("║  Cloudinary Image Migration Script            ║");
console.log("║  E-Commerce Backend                            ║");
console.log("╚════════════════════════════════════════════════╝\n");

migrateImages()
    .then(() => {
        console.log("\n✅ Script completed!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("\n❌ Script failed:", error);
        process.exit(1);
    });
