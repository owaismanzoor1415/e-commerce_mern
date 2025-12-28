/**
 * Clear All Products from Database
 * WARNING: This will delete ALL products!
 * Use this to start fresh with Cloudinary images
 */

require("dotenv").config();
const mongoose = require("mongoose");
const readline = require("readline");

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

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (query) => {
    return new Promise(resolve => rl.question(query, resolve));
};

const clearProducts = async () => {
    try {
        console.log("\n⚠️  WARNING: This will DELETE ALL products from database!\n");

        // Connect to MongoDB
        console.log("🔌 Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected\n");

        // Count products
        const count = await Product.countDocuments();
        console.log(`📦 Found ${count} products in database\n`);

        if (count === 0) {
            console.log("✅ Database is already empty!");
            await mongoose.connection.close();
            rl.close();
            return;
        }

        // Confirm
        const answer = await askQuestion(`Are you sure you want to DELETE all ${count} products? (yes/no): `);

        if (answer.toLowerCase() !== 'yes') {
            console.log("\n❌ Operation cancelled");
            await mongoose.connection.close();
            rl.close();
            return;
        }

        // Delete all
        console.log("\n🗑️  Deleting all products...");
        const result = await Product.deleteMany({});
        console.log(`✅ Deleted ${result.deletedCount} products`);

        console.log("\n✨ Database cleared successfully!");
        console.log("\n📝 Next steps:");
        console.log("1. Go to Admin Panel");
        console.log("2. Add new products");
        console.log("3. Upload images - they'll go to Cloudinary automatically!\n");

        await mongoose.connection.close();
        rl.close();

    } catch (error) {
        console.error("\n❌ Error:", error.message);
        rl.close();
        process.exit(1);
    }
};

console.log("╔════════════════════════════════════════════════╗");
console.log("║  Clear All Products from Database             ║");
console.log("╚════════════════════════════════════════════════╝");

clearProducts();
