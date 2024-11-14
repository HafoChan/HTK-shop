import express from "express";
const router = express.Router();
import brainTreeController from "../controller/braintree.js";

router.post("/braintree/get-token", brainTreeController.generateToken);
router.post("/braintree/payment", brainTreeController.paymentProcess);

export default router;
