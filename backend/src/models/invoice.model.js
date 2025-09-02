import mongoose from "mongoose";

const Schema = mongoose.Schema;

const invoiceSchema = new Schema(
  {
    user: {
      name: { type: String, default: "Anurag" },
      address: {
        type: String,
        default: "XX, Street No. XX, New Delhi - 1100XX",
      },
      contact: { type: String, default: "+91-87XXXXXXXX" },
    },
    invoiceId: {
      type: String,
      required: true,
    },
    referenceId: {
      type: String,
    },
    products: [
      {
        productId: {
          type: Schema.Types.String,
          ref: "Product",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        currentPrice: {
          type: Number,
          required: true,
        },
        productTotal: {
          type: Number,
          required: true,
        },
      },
    ],
    subtotal: {
      type: Number,
    },
    tax: {
      type: Number,
      default: 18,
    },
    total: { type: Number },
    status: {
      type: String,
      enum: ["Paid", "Unpaid"],
      default: "Unpaid",
    },
    dueDate: {
      type: Date,
    },
    processedCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

invoiceSchema.pre("save", function (next) {
  if (this.status === "Unpaid") {
    if (!this.dueDate) {
      const now = new Date();
      const dueDate = now.setDate(now.getDate() + 15);
      this.dueDate = dueDate;
    }
  } else if (this.status === "Paid") {
    this.dueDate = undefined;
  }
  next();
});

const Invoice = mongoose.model("Invoice", invoiceSchema);

export default Invoice;
