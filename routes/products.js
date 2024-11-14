import express from "express";
const router = express.Router();
import productController from "../controller/products.js";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/products");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/", productController.getAllProduct);

router.get("/category/:categoryId", productController.getProductByCategory);
router.get("/price/:price", productController.getProductByPrice);
router.post("/wish", productController.getWishProduct);
router.post("/cart", productController.getCartProduct);

router.post("/", upload.any(), productController.postAddProduct);
router.put("/:id", upload.any(), productController.putEditProduct);
router.delete("/:id", productController.deleteProduct);
router.get("/:id", productController.getSingleProduct);

router.post("/:id/review", productController.postAddReview);
router.delete("/:productId/review/:reviewId", productController.deleteReview);

export default router;
