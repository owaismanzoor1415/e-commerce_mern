/**
 * Update All Products to Use Any Available Cloudinary Image
 * This assigns Cloudinary images to existing products
 */

require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");

// Product Model
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

const updateProducts = async () => {
    try {
        console.log("╔════════════════════════════════════════════════╗");
        console.log("║  Update Products with Cloudinary Images       ║");
        console.log("╚════════════════════════════════════════════════╝\n");

        // Connect to MongoDB
        console.log("🔌 Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected\n");

        // Load Cloudinary URLs
        const cloudinaryData = JSON.parse(
            fs.readFileSync("cloudinary-urls.json", "utf8")
        );

        console.log(`📦 Found ${cloudinaryData.length} Cloudinary images\n`);

        // Get all products
        const products = await Product.find({}).sort({ id: 1 });
        console.log(`🛍️  Found ${products.length} products in database\n`);

        if (products.length === 0) {
            console.log("⚠️  No products to update!");
            await mongoose.connection.close();
            return;
        }

        let updatedCount = 0;

        // Assign Cloudinary images to products (round-robin)
        for (let i = 0; i < products.length; i++) {
            const product = products[i];

            // Use modulo to cycle through available images
            const imageIndex = i % cloudinaryData.length;
            const cloudinaryImage = cloudinaryData[imageIndex];

            console.log(`\n--- Product ID: ${product.id} ---`);
            console.log(`Name: ${product.name}`);
            console.log(`Category: ${product.category}`);
            console.log(`Old Image: ${product.image}`);
            console.log(`New Image: ${cloudinaryImage.url}`);

            // Update product
            await Product.updateOne(
                { _id: product._id },
                { $set: { image: cloudinaryImage.url } }
            );

            console.log("✅ Updated!");
            updatedCount++;
        }

        console.log("\n" + "=".repeat(50));
        console.log("📊 UPDATE SUMMARY");
        console.log("=".repeat(50));
        console.log(`✅ Updated: ${updatedCount} products`);
        console.log(`📦 Total: ${products.length} products`);
        console.log("=".repeat(50));

        console.log("\n🎉 All products updated with Cloudinary images!");
        console.log("\n📝 Next steps:");
        console.log("1. Restart your backend (if needed)");
        console.log("2. Refresh your frontend");
        console.log("3. Check that images are loading!\n");

        await mongoose.connection.close();
        console.log("✅ MongoDB connection closed\n");

    } catch (error) {
        console.error("\n❌ Update failed:", error.message);
        console.error(error.stack);
        process.exit(1);
    }
};

// Run update
updateProducts()
    .then(() => {
        console.log("✅ Update completed!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("❌ Update failed:", error);
        process.exit(1);
    });
