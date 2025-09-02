import mongoose from "mongoose";
import { bcryptHash } from "../utils/bcrypt.js";

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    resetOTP: {
      type: String,
    },
    OTPExpiresIn: {
      type: Date,
    },
    dashboard: {
      type: Schema.Types.ObjectId,
      ref: "Widget",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      this.password = await bcryptHash(this.password, 14);
    } catch (error) {
      next(error);
    }
  }
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
