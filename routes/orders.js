import express from "express";
const router = express.Router();
import ordersController from "../controller/orders.js";
import { isAdmin, isAuth, loginCheck } from "../middleware/auth.js";

router.get("/", loginCheck, isAuth, isAdmin, ordersController.getAllOrders);

router.get("/:id", ordersController.getSingleOrderById);
router.get(
  "/user/:userId",
  loginCheck,
  isAuth,
  ordersController.getOrderByUser
);
router.get(
  "/transaction/:transactionId",
  ordersController.getSingleOrderByTransactionId
);
router.post("/", loginCheck, isAuth, ordersController.postCreateOrder);
router.put("/:id", loginCheck, isAuth, ordersController.putUpdateOrder);
router.delete(
  "/:id",
  loginCheck,
  isAuth,
  isAdmin,
  ordersController.deleteOrder
);

export default router;
