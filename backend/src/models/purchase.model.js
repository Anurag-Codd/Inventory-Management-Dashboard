import mongoose from "mongoose";

const Schema = mongoose.Schema;

const purchaseSchema = new Schema(
  {
    productId: {
      type: Schema.Types.String,
      ref: "Product",
    },
    cost: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Purchase = mongoose.model("Purchase", purchaseSchema);

export default Purchase;
