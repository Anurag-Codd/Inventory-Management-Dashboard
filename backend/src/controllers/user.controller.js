import Invoice from "../models/invoice.model.js";
import Product from "../models/product.model.js";

export const createNewInvoice = async (req, res) => {
  const { products } = req.body;

  const productIds = products.map((p) => p.productId);
  try {
    const storedProducts = await Product.find({ _id: { $in: productIds } });

    const availability = products.every((requestedProduct) => {
      const storedProduct = storedProducts.find(
        (stored) => stored._id === requestedProduct.productId
      );
      return storedProduct && storedProduct.quantity >= requestedProduct.quantity;
    });

    if (!availability) {
      return res.status(400).json({ error: "Not enough quantity" });
    }

    const invoiceItems = products.map((p) => {
      const invoiceProduct = storedProducts.find(
        (item) => item._id === p.productId
      );

      const itemTotal = invoiceProduct.price * p.quantity;

      return {
        productId: invoiceProduct._id,
        name: invoiceProduct.name,
        quantity: p.quantity,
        currentPrice: invoiceProduct.price,
        productTotal: itemTotal,
      };
    });

    const subtotal = invoiceItems.reduce((acc, i) => acc + i.productTotal, 0);
    const taxRate = 0.18;
    const taxAmount = parseFloat((subtotal * taxRate).toFixed(2));
    const total = parseFloat((subtotal + taxAmount).toFixed(2));

    const count = await Invoice.countDocuments();
    const invoiceId = `INV-${String(count + 1).padStart(2, "0")}`;

    const invoice = await Invoice.create({
      invoiceId,
      products: invoiceItems,
      subtotal,
      total,
    });

    for (const product of products) {
      await Product.findByIdAndUpdate(
        product.productId,
        { $inc: { quantity: -product.quantity } }
      );
    }

    res.status(201).json({
      message: "Invoice created",
      data: invoice,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};