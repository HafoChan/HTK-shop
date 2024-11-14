import express from "express";
const router = express.Router();
import paymentsController from "../controller/payment.js";

router.post("/momo", paymentsController.momoPayment);

export default router;
