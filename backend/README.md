# E-Commerce Backend API

A professional, well-structured backend API for an e-commerce application with Cloudinary image storage integration.

## 🚀 Features

- ✅ Clean MVC architecture
- ✅ Cloudinary image storage (no local uploads)
- ✅ JWT authentication
- ✅ MongoDB database
- ✅ RESTful API design
- ✅ Error handling middleware
- ✅ Organized folder structure

## 📁 Project Structure

```
backend/
├── config/
│   ├── cloudinary.js      # Cloudinary configuration
│   └── database.js         # MongoDB connection
├── controllers/
│   ├── authController.js   # Authentication logic
│   ├── cartController.js   # Cart operations
│   ├── productController.js # Product CRUD
│   └── uploadController.js  # Image upload handling
├── middleware/
│   ├── auth.js             # JWT authentication
│   └── errorHandler.js     # Global error handler
├── models/
│   ├── Product.js          # Product schema
│   └── User.js             # User schema
├── routes/
│   ├── authRoutes.js       # Auth endpoints
│   ├── cartRoutes.js       # Cart endpoints
│   ├── productRoutes.js    # Product endpoints
│   └── uploadRoutes.js     # Upload endpoints
├── .env                    # Environment variables
├── .gitignore
├── index.js                # Main server file
└── package.json
```

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Edit the `.env` file and add your Cloudinary credentials:

```env
# Get these from https://cloudinary.com/console
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Run the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server will run on `http://localhost:4000`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products/allproducts` - Get all products
- `GET /api/products/newcollections` - Get latest 8 products
- `GET /api/products/popularinwomen` - Get popular women's products
- `POST /api/products/relatedproducts` - Get related products by category
- `POST /api/products/addproduct` - Add new product (Admin)
- `POST /api/products/removeproduct` - Remove product (Admin)

### Cart (Requires Authentication)
- `POST /api/cart/addtocart` - Add item to cart
- `POST /api/cart/removefromcart` - Remove item from cart
- `POST /api/cart/getcart` - Get user's cart

### Image Upload
- `POST /api/upload` - Upload image to Cloudinary
- `DELETE /api/upload/:publicId` - Delete image from Cloudinary

### Legacy Routes (Backward Compatibility)
All old routes (`/login`, `/signup`, `/allproducts`, etc.) still work!

## 🔐 Authentication

Include JWT token in request headers:
```
auth-token: your_jwt_token_here
```

## 📦 Key Changes from Old Version

### ✅ What's New:
1. **Cloudinary Integration** - Images now stored in cloud, not locally
2. **Organized Structure** - Separated models, routes, controllers, middleware
3. **Better Error Handling** - Consistent error responses
4. **Improved Code Quality** - Better validation and error messages
5. **API Versioning** - New `/api/*` endpoints
6. **Backward Compatible** - Old routes still work!

### ❌ What's Removed:
- Local file storage (`upload/images` folder no longer used)
- Static file serving for images

## 🌟 How to Get Cloudinary Credentials

1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. Go to Dashboard
4. Copy:
   - Cloud Name
   - API Key
   - API Secret
5. Paste them in `.env` file

## 🎯 Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Add Cloudinary credentials to `.env`
3. ✅ Run the server: `npm run dev`
4. ✅ Test the API endpoints
5. 🔜 Update frontend to use new upload endpoint
6. 🔜 Add password hashing (bcrypt)
7. 🔜 Add admin middleware for protected routes

## 📝 Notes

- The old `index.js` has been refactored but all functionality remains
- Legacy routes are maintained for backward compatibility
- Images are now stored on Cloudinary, not locally
- Don't forget to add `.env` to `.gitignore`

---

**Author:** OWAIS MANZOOR  
**Version:** 2.0.0
