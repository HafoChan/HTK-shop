import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const productSchema = new mongoose.Schema(
  {
    pName: {
      type: String,
      required: true,
    },
    pDescription: {
      type: String,
      required: true,
    },
    pPrice: {
      type: Number,
      required: true,
    },
    pSold: {
      type: Number,
      default: 0,
    },
    pQuantity: {
      type: Number,
      default: 0,
    },
    pCategory: {
      type: ObjectId,
      ref: "categories",
    },
    pImages: {
      type: Array,
      required: true,
    },
    pOffer: {
      type: String,
      default: null,
    },
    pRatingsReviews: [
      {
        review: String,
        user: { type: ObjectId, ref: "users" },
        rating: String,
        createdAt: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
    pStatus: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
productSchema.index({pName: 'text'})
const productModel = mongoose.model("products", productSchema);
export default productModel;
