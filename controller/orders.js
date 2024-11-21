import orderModel from "../models/orders.js";
import userModel from "../models/users.js";
import { v4 as uuidv4 } from "uuid";

class Order {
  async getAllOrders(req, res) {
    try {
      let orders = await orderModel
        .find({})
        .populate("allProduct.id", "pName pImages pPrice")
        .populate("user", "name email")
        .sort({ _id: -1 });
      return res.json({ orders });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getOrderByUser(req, res) {
    let { userId } = req.params;
    try {
      let orders = await orderModel
        .find({ user: userId })
        .populate("allProduct.id", "pName pImages pPrice")
        .populate("user", "name email")
        .sort({ _id: -1 });
      return res.json({ orders });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async postCreateOrder(req, res) {
    let { allProduct, user, amount, address, phone } = req.body;
    if (!allProduct || !user || !amount || !address || !phone) {
      return res.status(400).json({ message: "All fields must be filled" });
    }

    try {
      const existingUser = await userModel.findById(user);
      if (!existingUser) {
        return res.status(404).json({ error: "User not found" });
      }

      const transactionId = uuidv4();

      let newOrder = new orderModel({
        allProduct,
        user: user,
        amount,
        transactionId,
        address,
        phone,
      });
      await newOrder.save();
      return res.status(201).json({ success: "Order created successfully" });
    } catch (err) {
      if (err.name === "ValidationError") {
        return res.status(400).json({ error: err.message });
      }
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async putUpdateOrder(req, res) {
    let { id } = req.params;
    let { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: "Status must be provided" });
    }
    try {
      let order = await orderModel.findByIdAndUpdate(
        id,
        { status: status, updatedAt: Date.now() },
        { new: true }
      );
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      if (
        ![
          "Not processed",
          "Processing",
          "Shipped",
          "Delivered",
          "Cancelled",
        ].includes(status)
      ) {
        return res.status(400).json({ error: "Unsupported status" });
      }
      return res.json({ success: "Order updated successfully", order });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async deleteOrder(req, res) {
    let { id } = req.params;
    try {
      let order = await orderModel.findByIdAndDelete(id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      return res.json({ success: "Order deleted successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

const ordersController = new Order();
export default ordersController;
