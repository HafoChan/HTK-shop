import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const orderSchema = new mongoose.Schema(
  {
    allProduct: [
      {
        id: { type: ObjectId, ref: "products" },
        quantitiy: Number,
      },
    ],
    user: {
      type: ObjectId,
      ref: "users",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          // Regex kiểm tra số điện thoại Việt Nam
          return /^(0[3|5|7|8|9]\d{8}|0[2]\d{9,10})$/.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid Vietnamese phone number!`,
      },
    },
    status: {
      type: String,
      default: "Not processed",
      enum: [
        "Not processed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
    },
  },
  { timestamps: true }
);

const orderModel = mongoose.model("orders", orderSchema);
export default orderModel;
