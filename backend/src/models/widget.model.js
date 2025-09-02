import mongoose from "mongoose";

const Schema = mongoose.Schema;

const widgetSchema = new Schema(
  {
    home: {
      leftOrder: [],
      rightOrder: [],
    },
    statics: {
      revenue: {
        type: Number,
        default: 1,
        min: 1,
        max: 3,
      },
      sold: {
        type: Number,
        default: 2,
        min: 1,
        max: 3,
      },
      inStock: {
        type: Number,
        default: 3,
        min: 1,
        max: 3,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Widget = mongoose.model("Widget", widgetSchema);

export default Widget;
