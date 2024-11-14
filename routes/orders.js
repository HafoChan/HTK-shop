import express from "express";
const router = express.Router();
import ordersController from "../controller/orders.js";

router.get("/", ordersController.getAllOrders);
router.get("/user/:userId", ordersController.getOrderByUser);
router.post("/", ordersController.postCreateOrder);
router.put("/:id", ordersController.putUpdateOrder);
router.delete("/:id", ordersController.deleteOrder);

export default router;
