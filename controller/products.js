import productModel from "../models/products.js";
import fs from "fs";
import path from "path";

class Product {
  // Delete Image from uploads -> products folder
  static deleteImages(images, mode) {
    const basePath = path.resolve() + "/public/uploads/products/";
    for (let i = 0; i < images.length; i++) {
      let filePath =
        mode === "file"
          ? basePath + `${images[i].filename}`
          : basePath + `${images[i]}`;
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.log(err);
          }
        });
      }
    }
  }

  async getAllProduct(req, res) {
    try {
      let products = await productModel
        .find({})
        .populate("pCategory", "_id cName")
        .sort({ _id: -1 });

      // Tính toán avgReview cho từng sản phẩm
      products = products.map((product) => {
        const reviews = product.pRatingsReviews;
        const totalRating = reviews.reduce(
          (acc, review) => acc + parseFloat(review.rating),
          0
        );
        const avgReview =
          reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;

        return {
          ...product.toObject(), // Chuyển đổi Mongoose document thành object
          avgReview, // Thêm trường avgReview vào sản phẩm
        };
      });

      return res.json({ products });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async searchProduct(req, res) {
    try {
      const { query } = req.query;
      if (!query) {
        return res.status(400).json({ error: "query is required" });
      }
      let products = await productModel.find({ $text: { $search: query } });
      return res.status(200).json(products);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async postAddProduct(req, res) {
    let { pName, pDescription, pPrice, pQuantity, pCategory, pOffer, pStatus } =
      req.body;
    let images = req.files;

    if (
      !pName ||
      !pDescription ||
      !pPrice ||
      !pQuantity ||
      !pCategory ||
      !pOffer ||
      !pStatus
    ) {
      Product.deleteImages(images, "file");
      return res.status(400).json({ error: "All fields must be filled" });
    } else if (pName.length > 255 || pDescription.length > 3000) {
      Product.deleteImages(images, "file");
      return res.status(400).json({
        error:
          "Name must be 255 characters & Description must not exceed 3000 characters",
      });
    } else if (images.length !== 2) {
      Product.deleteImages(images, "file");
      return res.status(400).json({ error: "Must provide 2 images" });
    } else {
      try {
        let existingProduct = await productModel.findOne({ pName: pName });
        if (existingProduct) {
          Product.deleteImages(images, "file");
          return res.status(409).json({ error: "Product name already exists" });
        }

        let allImages = images.map((img) => img.filename);
        let newProduct = new productModel({
          pImages: allImages,
          pName,
          pDescription,
          pPrice,
          pQuantity,
          pCategory,
          pOffer,
          pStatus,
        });
        await newProduct.save();
        return res
          .status(201)
          .json({ success: "Product created successfully" });
      } catch (err) {
        console.log(err);
        res.status(500).json({ err });
      }
    }
  }

  async putEditProduct(req, res) {
    let { id } = req.params;
    let {
      pName,
      pDescription,
      pPrice,
      pQuantity,
      pCategory,
      pOffer,
      pStatus,
      pImages,
    } = req.body;
    let editImages = req.files;

    if (
      !pName ||
      !pDescription ||
      !pPrice ||
      !pQuantity ||
      !pCategory ||
      !pOffer ||
      !pStatus
    ) {
      return res.status(400).json({ error: "All fields must be filled" });
    } else if (pName.length > 255 || pDescription.length > 3000) {
      return res.status(400).json({
        error:
          "Name must be 255 characters & Description must not exceed 3000 characters",
      });
    } else if (editImages && editImages.length === 1) {
      Product.deleteImages(editImages, "file");
      return res.status(400).json({ error: "Must provide 2 images" });
    } else {
      let editData = {
        pName,
        pDescription,
        pPrice,
        pQuantity,
        pCategory,
        pOffer,
        pStatus,
      };
      if (editImages.length === 2) {
        let allEditImages = editImages.map((img) => img.filename);
        editData = { ...editData, pImages: allEditImages };
        Product.deleteImages(pImages.split(","), "string");
      }
      try {
        let editProduct = await productModel.findByIdAndUpdate(id, editData, {
          new: true,
        });
        if (!editProduct) {
          return res.status(404).json({ error: "Product not found" });
        }
        return res.json({
          success: "Product edited successfully",
          product: editProduct,
        });
      } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  async deleteProduct(req, res) {
    let { id } = req.params;
    try {
      let deleteProductObj = await productModel.findById(id);
      if (!deleteProductObj) {
        return res.status(404).json({ error: "Product not found" });
      }
      await productModel.findByIdAndDelete(id);
      Product.deleteImages(deleteProductObj.pImages, "string");
      return res.json({ success: "Product deleted successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getSingleProduct(req, res) {
    let { id } = req.params;
    try {
      let singleProduct = await productModel
        .findById(id)
        .populate("pCategory", "cName")
        .populate("pRatingsReviews.user", "name email userImage");
      if (!singleProduct) {
        return res.status(404).json({ error: "Product not found" });
      }
      return res.json({ product: singleProduct });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getProductByCategory(req, res) {
    let { categoryId } = req.params;
    try {
      let products = await productModel
        .find({ pCategory: categoryId })
        .populate("pCategory", "cName");
      return res.json({ products });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getProductByFilter(req, res) {
    // Mặc định chỉ lọc theo giá, nhỏ hơn và sort giảm dần
    let { price, filterType, sortType } = req.query;

    let filterCriteria = {};

    // Kiểm tra bộ lọc giá
    if (price) {
      if (filterType === "greater") {
        filterCriteria.pPrice = { $gt: price };
      } else {
        filterCriteria.pPrice = { $lt: price };
      }
    } else {
      filterCriteria.pPrice = { $lt: Infinity };
    }

    // Kiểm tra sort
    let sortCriteria = {};
    if (sortType === "asc") {
      sortCriteria.pPrice = 1;
    } else {
      sortCriteria.pPrice = -1;
    }

    try {
      let products = await productModel
        .find(filterCriteria)
        .populate("pCategory", "cName")
        .sort(sortCriteria);

      return res.json({ products });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getWishProduct(req, res) {
    let { productArray } = req.body;
    if (!productArray) {
      return res.status(400).json({ error: "All fields must be filled" });
    }
    try {
      let wishProducts = await productModel.find({
        _id: { $in: productArray },
      });
      return res.json({ products: wishProducts });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getCartProduct(req, res) {
    let { productArray } = req.body;
    if (!productArray) {
      return res.status(400).json({ error: "All fields must be filled" });
    }
    try {
      let cartProducts = await productModel.find({
        _id: { $in: productArray },
      });
      return res.json({ products: cartProducts });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getSingleReviewOfProduct(req, res) {
    let { productId, reviewId } = req.params;
    try {
      let product = await productModel.findById(productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      let review = product.pRatingsReviews.id(reviewId);
      if (!review) {
        return res.status(404).json({ error: "Review not found" });
      }
      return res.json({ review });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getAllReviewOfProduct(req, res) {
    let { productId } = req.params;
    try {
      let product = await productModel.findById(productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      return res.json({ reviews: product.pRatingsReviews });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async putEditReview(req, res) {
    let { productId, reviewId } = req.params;
    let { rating, review, uId } = req.body;

    if (!rating || !review || !uId) {
      return res.status(400).json({ error: "All fields must be filled" });
    }

    try {
      let product = await productModel.findById(productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      let reviewToEdit = product.pRatingsReviews.id(reviewId);
      if (!reviewToEdit) {
        return res.status(404).json({ error: "Review not found" });
      }

      if (reviewToEdit.user.toString() !== uId) {
        return res
          .status(403)
          .json({ error: "You are not authorized to edit this review" });
      }

      reviewToEdit.rating = rating;
      reviewToEdit.review = review;

      await product.save();

      return res.json({
        success: "Review updated successfully",
        review: reviewToEdit,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async postAddReview(req, res) {
    let { productId } = req.params;
    let { uId, rating, review } = req.body;
    if (!rating || !review || !uId) {
      return res.status(400).json({ error: "All fields must be filled" });
    }
    try {
      let product = await productModel.findById(productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      const existingReview = product.pRatingsReviews.find(
        (r) => r.user.toString() === uId
      );
      if (existingReview) {
        return res
          .status(409)
          .json({ error: "You have already reviewed the product" });
      }
      product.pRatingsReviews.push({ review, user: uId, rating });
      await product.save();
      return res.json({ success: "Thanks for your review" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async deleteReview(req, res) {
    let { productId, reviewId } = req.params;
    try {
      let product = await productModel.findById(productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      product.pRatingsReviews = product.pRatingsReviews.filter(
        (r) => r._id.toString() !== reviewId
      );
      await product.save();
      return res.json({ success: "Your review has been deleted" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

const productController = new Product();
export default productController;
