import fs from "node:fs";
import csv from "csv-parser";
import Product from "../models/product.model.js";
import Purchase from "../models/purchase.model.js";

export const searchProduct = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(404).json({ error: "Nothing to search" });
    }

    const products = await Product.find({
      name: { $regex: query, $options: "i" },
    });

    const totalPages = Math.ceil(products.length / 10) || 1;

    if (!products) res.status(404).json({ error: "No product found" });
    return res.status(200).json({ products, totalPages });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const fetchProductWithLimit = async (req, res) => {
  const { page } = req.query;
  try {
    const totalProduct = await Product.countDocuments();
    const totalPages = Math.ceil(totalProduct / 10) || 1;

    const products = await Product.find()
      .skip((page - 1) * 10)
      .limit(10);

    if (!products) {
      return res.status(404).json({ error: "No products are found" });
    }

    return res.status(200).json({
      message: "Product fethed success",
      products,
      totalPages,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Something went wrong",
    });
  }
};

export const addSingleProduct = async (req, res) => {
  const {
    productId,
    productName,
    category,
    marketPrice,
    cost,
    quantity,
    unit,
    expiryDate,
    threshold,
  } = JSON.parse(req.body.product);

  if (!req.file) {
    return res.status(400).json({ error: "Image is required" });
  }

  if (
    !productId ||
    !productName ||
    !category ||
    !marketPrice ||
    !cost ||
    !quantity ||
    !unit ||
    !expiryDate ||
    !threshold
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const imageUrl = `/uploads/${req.file.filename}`;
    const product = await Product.create({
      _id: productId,
      name: productName,
      imageUrl,
      category,
      price: Number(marketPrice),
      quantity: Number(quantity),
      unit,
      expiryDate: new Date(expiryDate),
      threshold: Number(threshold),
    });

    if (!product)
      res.status(400).json({ error: "Error while creating product" });

    const purchase = await Purchase.create({
      productId: product._id,
      cost: Number(cost),
      quantity: Number(quantity),
      total: Number(cost) * Number(quantity),
    });

    if (!purchase)
      res.status(400).json({
        error: "Error while creating purchase report removing product",
      });

    await Product.findByIdAndDelete(product._id);

    return res.status(201).json({
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Something went wrong",
    });
  }
};

export const addMultipleProducts = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "CSV file is required" });
  }
  try {
    const products = [];
    const purchase = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (row) => {
        products.push({
          _id: row.productId,
          name: row.name,
          category: row.category,
          price: Number(row.marketPrice),
          quantity: Number(row.quantity),
          unit: row.unit,
          threshold: Number(row.threshold),
          expiryDate: new Date(row.expiryDate),
          createdAt: new Date(row.createdAt),
          updatedAt: new Date(row.updatedAt),
        });

        purchase.push({
          productId: row.productId,
          cost: Number(row.cost),
          quantity: Number(row.quantity),
          total: Number(row.cost) * Number(row.quantity),
          createdAt: new Date(row.createdAt),
          updatedAt: new Date(row.updatedAt),
        });
      })
      .on("end", async () => {
        try {
          const finalProducts = await Product.insertMany(products);
          await Purchase.insertMany(purchase);
          await Product.refreshProducts();
          await fs.promises.unlink(req.file.path);
          return res.status(201).json({
            message: "Products added successfully",
            products: finalProducts,
          });
        } catch (error) {
          await fs.promises.unlink(req.file.path);
          console.log(error.message);
          return res.status(500).json({
            error: "Failed to insert products",
          });
        }
      });
  } catch (error) {
    await fs.promises.unlink(req.file.path);
    return res.status(500).json({
      error: "Something went wrong",
    });
  }
};

export const updateProduct = async (req, res) => {
  const { marketPrice, quantity, cost, threshold, expiryDate } = req.body;
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (!marketPrice && !cost && !quantity && !threshold && !expiryDate) {
      return res.status(400).json({ error: "At least one field is required" });
    }

    if (marketPrice) product.price = Number(marketPrice);
    if (threshold) product.threshold = Number(threshold);
    if (expiryDate) product.expiryDate = new Date(expiryDate);

    if (quantity) {
      const qty = Number(quantity);
      const purchaseCost = cost ? Number(cost) : undefined;

      if (!purchaseCost) {
        const lastPurchase = await Purchase.findOne({
          productId: product._id,
        }).sort({
          createdAt: -1,
        });

        purchaseCost = lastPurchase.cost;
      }
      product.quantity += qty;

      await Purchase.create({
        productId: product._id,
        cost: purchaseCost,
        quantity: qty,
        total: purchaseCost * qty,
      });
    }

    await product.save();

    return res.status(200).json({ message: "Product Updated", product });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};
