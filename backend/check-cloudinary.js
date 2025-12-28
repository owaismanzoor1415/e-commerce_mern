// Quick test to check if Cloudinary credentials are configured
require("dotenv").config();

console.log("\n🔍 Checking Cloudinary Configuration...\n");

const hasCloudName = !!process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_CLOUD_NAME !== "your_cloud_name_here";
const hasApiKey = !!process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_KEY !== "your_api_key_here";
const hasApiSecret = !!process.env.CLOUDINARY_API_SECRET &&
    process.env.CLOUDINARY_API_SECRET !== "your_api_secret_here";

console.log(`Cloud Name:  ${hasCloudName ? '✅ Configured' : '❌ Missing or using placeholder'}`);
console.log(`API Key:     ${hasApiKey ? '✅ Configured' : '❌ Missing or using placeholder'}`);
console.log(`API Secret:  ${hasApiSecret ? '✅ Configured' : '❌ Missing or using placeholder'}`);

console.log("\n" + "=".repeat(50));

if (hasCloudName && hasApiKey && hasApiSecret) {
    console.log("✅ Cloudinary is properly configured!");
    console.log("\n🚀 You can now run the migration:");
    console.log("   node migrate-images-to-cloudinary.js\n");
} else {
    console.log("❌ Cloudinary credentials are NOT configured!");
    console.log("\n📝 Please update your .env file with:");
    console.log("\n   1. Go to: https://cloudinary.com/console");
    console.log("   2. Copy your credentials");
    console.log("   3. Update .env file:\n");
    console.log("   CLOUDINARY_CLOUD_NAME=your_actual_cloud_name");
    console.log("   CLOUDINARY_API_KEY=your_actual_api_key");
    console.log("   CLOUDINARY_API_SECRET=your_actual_api_secret\n");
}

console.log("=".repeat(50) + "\n");
