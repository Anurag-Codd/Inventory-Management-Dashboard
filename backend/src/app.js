import express from "express";
import cron from "node-cron";
import cors from "cors";
import cookieParser from "cookie-parser";
// import { fileURLToPath } from "node:url";
// import { dirname, join, resolve } from "node:path";
import Product from "./models/product.model.js";
import { dbConnect } from "./utils/DB.js";

export const app = express();
dbConnect();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

import userRoute from "./routes/user.route.js";
import adminRoute from "./routes/admin.route.js";
import authRoute from "./routes/auth.route.js";
import productRoute from "./routes/product.route.js";
import invoiceRoute from "./routes/invoice.route.js";
import statsRoute from "./routes/stats.route.js";
import widgetRoute from "./routes/widget.route.js";

app.use("/api/v1/user", userRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/invoices", invoiceRoute);
app.use("/api/v1/stats", statsRoute);
app.use("/api/v1/widgets", widgetRoute);

cron.schedule("0 0 * * *", async () => {
  try {
    console.log("running cron job midnight");
    await Product.refreshProducts();
    console.log("Products refreshed successfully at midnight");
  } catch (error) {
    console.error("Error refreshing products:", error);
  }
});

// const __dirname = dirname(fileURLToPath(import.meta.url));

// if (process.env.NODE_ENV === "Production") {
//   app.use(express.static(join(__dirname, "../../frontend/dist")));

//   app.get("*", (_, res) => {
//     res.sendFile(resolve(__dirname, "../../frontend/dist/index.html"));
//   });
// }
