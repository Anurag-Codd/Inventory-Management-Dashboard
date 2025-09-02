import mongoose from "mongoose";

const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    _id: {
      type: String,
      required: true,
      uppercase: true,
      alias: "productId",
    },
    name: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },

    category: {
      type: String,
      required: true,
    },
    price: {
      min: 0,
      type: Number,
      required: true,
    },
    quantity: {
      min: 0,
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      required: true,
      enum: ["kg", "g", "liter", "ml", "pc", "packet"],
    },
    threshold: {
      type: Number,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    availability: {
      type: String,
      enum: ["In Stock", "Low Stock", "Out of Stock", "Expired"],
    },

  },
  { timestamps: true }
);

productSchema.statics.refreshProducts = async function () {
  await this.updateMany(
    { expiryDate: { $lt: new Date() } },
    { $set: { availability: "Expired" } }
  );

  await this.updateMany(
    {
      expiryDate: { $gt: new Date() },
      $expr: { $gt: ["$quantity", "$threshold"] },
    },
    { $set: { availability: "In Stock" } }
  );

  await this.updateMany(
    {
      expiryDate: { $gt: new Date() },
      $expr: {
        $and: [
          { $gt: ["$quantity", 0] },
          { $lte: ["$quantity", "$threshold"] },
        ],
      },
    },
    { $set: { availability: "Low Stock" } }
  );

  await this.updateMany(
    { expiryDate: { $gt: new Date() }, quantity: { $lte: 0 } },
    { $set: { availability: "Out of Stock" } }
  );
};

productSchema.pre("save", function (next) {
  if (this.isModified("quantity") || this.isModified("expiryDate")) {
    if (this.expiryDate <= new Date()) {
      this.availability = "Expired";
    } else if (this.quantity > this.threshold) {
      this.availability = "In Stock";
    } else if (this.quantity > 0 && this.quantity <= this.threshold) {
      this.availability = "Low Stock";
    } else {
      this.availability = "Out of Stock";
    }
  }
  next();
});

const Product = mongoose.model("Product", productSchema);

export default Product;
