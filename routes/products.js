import express from "express";
const router = express.Router();
import productController from "../controller/products.js";
import multer from "multer";
import { isAdmin, isAuth, loginCheck } from "../middleware/auth.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/products");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Lấy tất cả sản phẩm của 1 category
router.get("/category/:categoryId", productController.getProductByCategory);
// CRUD product
router.get("/", productController.getAllProduct);
router.get("/:id", productController.getSingleProduct);
router.post(
  "/",
  upload.any(),
  loginCheck,
  isAuth,
  isAdmin,
  productController.postAddProduct
);
router.put(
  "/:id",
  upload.any(),
  loginCheck,
  isAuth,
  isAdmin,
  productController.putEditProduct
);
router.delete(
  "/:id",
  loginCheck,
  isAuth,
  isAdmin,
  productController.deleteProduct
);
// Tìm kiểm theo tên
router.get("/search", productController.searchProduct);

// Phần lọc sản phẩm theo tiêu chí
router.get("/price/:price", productController.getProductByPrice);
router.post("/wish", productController.getWishProduct);
router.post("/cart", productController.getCartProduct);

// Phần review của sản phẩm
router.get(
  "/:productId/review/:reviewId",
  productController.getSingleReviewOfProduct
);
router.get("/:productId/review", productController.getAllReviewOfProduct);
router.post(
  "/:productId/review",
  loginCheck,
  isAuth,
  productController.postAddReview
);
router.put(
  "/:productId/review/:reviewId",
  loginCheck,
  isAuth,
  productController.putEditReview
);
router.delete(
  "/:productId/review/:reviewId",
  loginCheck,
  isAuth,
  productController.deleteReview
);

export default router;
