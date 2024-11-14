import { toTitleCase } from "../config/function.js";
import categoryModel from "../models/categories.js";
import fs from "fs";

class Category {
  async getAllCategory(req, res) {
    try {
      let categories = await categoryModel.find({}).sort({ _id: -1 });
      return res.json({ categories });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async postAddCategory(req, res) {
    let { cName, cDescription, cStatus } = req.body;
    let cImage = req.file.filename;
    const filePath = `../server/public/uploads/categories/${cImage}`;

    if (!cName || !cDescription || !cStatus || !cImage) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(err);
        }
        return res.status(400).json({ error: "All fields must be filled" });
      });
    } else {
      cName = toTitleCase(cName);
      try {
        let checkCategoryExists = await categoryModel.findOne({ cName: cName });
        if (checkCategoryExists) {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.log(err);
            }
            return res.status(409).json({ error: "Category already exists" });
          });
        } else {
          let newCategory = new categoryModel({
            cName,
            cDescription,
            cStatus,
            cImage,
          });
          await newCategory.save();
          return res
            .status(201)
            .json({ success: "Category created successfully" });
        }
      } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  async putEditCategory(req, res) {
    let { id } = req.params;
    let { cDescription, cStatus } = req.body;
    if (!cDescription || !cStatus) {
      return res.status(400).json({ error: "All fields must be filled" });
    }
    try {
      let category = await categoryModel.findByIdAndUpdate(
        id,
        {
          cDescription,
          cStatus,
          updatedAt: Date.now(),
        },
        { new: true }
      );
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      return res.json({ success: "Category updated successfully", category });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async deleteCategory(req, res) {
    let { id } = req.params;
    try {
      let category = await categoryModel.findById(id);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      const filePath = `../server/public/uploads/categories/${category.cImage}`;
      await categoryModel.findByIdAndDelete(id);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(err);
        }
        return res.json({ success: "Category deleted successfully" });
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

const categoryController = new Category();
export default categoryController;
