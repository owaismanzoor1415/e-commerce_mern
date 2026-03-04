require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDatabase = require("./config/database");
const errorHandler = require("./middleware/errorHandler");

// Import routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const orderRoutes = require("./routes/orderRoutes");

// Initialize express app
const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Connect to database
connectDatabase();

// Root route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 E-Commerce API is running!",
    version: "2.0.0",
    endpoints: {
      auth: "/api/auth",
      products: "/api/products",
      cart: "/api/cart",
      upload: "/api/upload",
      order: "/api/order",
    },
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/order", orderRoutes);

// Legacy routes for backward compatibility
app.post("/signup", require("./controllers/authController").signup);
app.post("/login", require("./controllers/authController").login);
app.get("/allproducts", require("./controllers/productController").getAllProducts);
app.get("/newcollections", require("./controllers/productController").getNewCollections);
app.get("/popularinwomen", require("./controllers/productController").getPopularInWomen);
app.post("/relatedproducts", require("./controllers/productController").getRelatedProducts);
app.post("/addproduct", require("./controllers/productController").addProduct);
app.post("/removeproduct", require("./controllers/productController").removeProduct);

const authenticateUser = require("./middleware/auth");
app.post("/addtocart", authenticateUser, require("./controllers/cartController").addToCart);
app.post("/removefromcart", authenticateUser, require("./controllers/cartController").removeFromCart);
app.post("/getcart", authenticateUser, require("./controllers/cartController").getCart);

const { upload } = require("./config/cloudinary");
app.post("/upload", upload.single("product"), require("./controllers/uploadController").uploadImage);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    errors: "Route not found",
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`🌐 API: http://localhost:${PORT}`);
});

module.exports = app;
