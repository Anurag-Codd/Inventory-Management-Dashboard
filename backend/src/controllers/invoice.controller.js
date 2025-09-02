import Invoice from "../models/invoice.model.js";

export const fetchInvoicesWithLimit = async (req, res) => {
  const { page } = req.query;
  try {
    const totalInvoices = await Invoice.countDocuments();
    const totalPages = Math.ceil(totalInvoices / 10);

    const invoices = await Invoice.find()
      .skip((page - 1) * 10)
      .limit(10);
    res.json({ message: "All invoices", invoices, totalPages });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const processInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findById(id);

    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }
    if (invoice.status === "Paid") {
      invoice.processedCount += 1;
      await invoice.save();
    }

    res.json({ message: "Invoice generated", invoice });
  } catch (err) {
    res.status(500).json({ success: false, message: "Somthing went wrong" });
  }
};

export const updateInvoiceStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const referenceId = `REF-${new Date()
      .toISOString()
      .replace(/[-:.TZ]/g, "")
      .slice(0, 14)}`;
    const invoice = await Invoice.findByIdAndUpdate(
      id,
      { status: "Paid", referenceId },
      { new: true }
    );
    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }
    res.json({ message: "Invoice updated", invoice });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const deleteInvoice = async (req, res) => {
  const { id } = req.params;
  try {
    const invoice = await Invoice.findById(id);

    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    if (invoice.status !== "Paid") {
      return res.status(400).json({ error: "Invoice is unpaid" });
    }

    await Invoice.findByIdAndDelete(id);
    res.json({ message: "Invoice deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
