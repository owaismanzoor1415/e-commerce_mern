const express = require("express");
const router = express.Router();
const {
    getAllProducts,
    getNewCollections,
    getPopularInWomen,
    getRelatedProducts,
    addProduct,
    removeProduct,
} = require("../controllers/productController");

// Public routes
router.get("/allproducts", getAllProducts);
router.get("/newcollections", getNewCollections);
router.get("/popularinwomen", getPopularInWomen);
router.post("/relatedproducts", getRelatedProducts);

// Admin routes (should add admin middleware)
router.post("/addproduct", addProduct);
router.post("/removeproduct", removeProduct);

module.exports = router;
