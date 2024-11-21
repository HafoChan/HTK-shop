import fs from "fs";
import path from "path";
import categoryModel from "../models/categories.js";
import productModel from "../models/products.js";
import orderModel from "../models/orders.js";
import userModel from "../models/users.js";
import customizeModel from "../models/customize.js";

class Customize {
  async getImages(req, res) {
    try {
      let images = await customizeModel.find({});
      return res.json({ images });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getSingleImage(req, res) {
    let { id } = req.params;
    try {
      let image = await customizeModel.findById(id);
      if (!image) {
        return res.status(404).json({ error: "Image not found" });
      }
      return res.json({ image });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async updateSlideImage(req, res) {
    let { id } = req.params;
    let { firstShow } = req.body;

    try {
      let existingImage = await customizeModel.findById(id);
      if (!existingImage) {
        return res.status(404).json({ error: "Image not found" });
      }

      if (req.file) {
        const oldFilePath = path.join(
          __dirname,
          "../public/uploads/customize",
          existingImage.slideImage
        );

        // Xóa hình ảnh cũ
        fs.unlink(oldFilePath, (err) => {
          if (err) {
            console.log(err);
          }
        });
        existingImage.slideImage = req.file.filename;
      }

      existingImage.firstShow = firstShow || existingImage.firstShow;

      let updatedImage = await existingImage.save();

      return res.json({ success: "Image updated successfully", updatedImage });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async uploadSlideImage(req, res) {
    let image = req.file.filename;
    let { firstShow } = req.body;

    if (!image) {
      return res.status(400).json({ error: "Image is required" });
    }

    try {
      let newCustomize = new customizeModel({
        slideImage: image,
        firstShow: firstShow || 0,
      });
      await newCustomize.save();
      return res.status(201).json({ success: "Image uploaded successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async deleteSlideImage(req, res) {
    let { id } = req.params;
    try {
      let deletedSlideImage = await customizeModel.findById(id);
      if (!deletedSlideImage) {
        return res.status(404).json({ error: "Image not found" });
      }
      await customizeModel.findByIdAndDelete(id);
      return res.json({ success: "Image deleted successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getAllData(req, res) {
    try {
      let categoriesCount = await categoryModel.countDocuments();
      let productsCount = await productModel.countDocuments();
      let ordersCount = await orderModel.countDocuments();
      let usersCount = await userModel.countDocuments();
      return res.json({
        categories: categoriesCount,
        products: productsCount,
        orders: ordersCount,
        users: usersCount,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

const customizeController = new Customize();
export default customizeController;
