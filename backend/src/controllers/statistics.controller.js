import Invoice from "../models/invoice.model.js";
import Product from "../models/product.model.js";
import Purchase from "../models/purchase.model.js";

export const chartStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const yearlyPurchaseStats = await Purchase.aggregate([
      {
        $match: { createdAt: { $gte: startOfYear, $lte: now } },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalAmount: { $sum: { $multiply: ["$cost", "$quantity"] } },
        },
      },
    ]);

    const monthlyPurchaseStats = await Purchase.aggregate([
      {
        $match: { createdAt: { $gte: startOfMonth, $lte: now } },
      },
      {
        $group: {
          _id: { $dayOfMonth: "$createdAt" },
          totalAmount: { $sum: { $multiply: ["$cost", "$quantity"] } },
        },
      },
    ]);

    const weeklyPurchaseStats = await Purchase.aggregate([
      {
        $match: { createdAt: { $gte: startOfWeek, $lte: endOfWeek } },
      },
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          totalAmount: { $sum: { $multiply: ["$cost", "$quantity"] } },
        },
      },
    ]);

    const yearlySalesStats = await Invoice.aggregate([
      {
        $match: { createdAt: { $gte: startOfYear, $lte: now } },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalAmount: { $sum: "$total" },
        },
      },
    ]);

    const monthlySalesStats = await Invoice.aggregate([
      {
        $match: { createdAt: { $gte: startOfMonth, $lte: now } },
      },
      {
        $group: {
          _id: { $dayOfMonth: "$createdAt" },
          totalAmount: { $sum: "$total" },
        },
      },
    ]);

    const weeklySalesStats = await Invoice.aggregate([
      {
        $match: { createdAt: { $gte: startOfWeek, $lte: endOfWeek } },
      },
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          totalAmount: { $sum: "$total" },
        },
      },
    ]);

    const fillMissingData = (aggregatedData, length, startIndex = 1) => {
      const result = Array.from({ length }, () => 0);

      aggregatedData.forEach((item) => {
        const index = item._id - startIndex;
        if (index >= 0 && index < length) {
          result[index] = item.totalAmount || 0;
        }
      });

      return result;
    };

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const weekNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const monthsInCurrentYear = now.getMonth() + 1;
    const purchaseYearly = fillMissingData(
      yearlyPurchaseStats,
      monthsInCurrentYear,
      1
    );

    const salesYearly = fillMissingData(
      yearlySalesStats,
      monthsInCurrentYear,
      1
    );

    const yearly = monthNames
      .slice(0, monthsInCurrentYear)
      .map((month, index) => ({
        month,
        purchase: purchaseYearly[index] || 0,
        sales: salesYearly[index] || 0,
      }));

    const daysInCurrentMonth = now.getDate();

    const purchaseMonthly = fillMissingData(
      monthlyPurchaseStats,
      daysInCurrentMonth,
      1
    );
    const salesMonthly = fillMissingData(
      monthlySalesStats,
      daysInCurrentMonth,
      1
    );

    const monthly = Array.from({ length: daysInCurrentMonth }, (_, index) => ({
      date: index + 1,
      purchase: purchaseMonthly[index] || 0,
      sales: salesMonthly[index] || 0,
    }));

    const purchaseWeekly = fillMissingData(weeklyPurchaseStats, 7, 1);
    const salesWeekly = fillMissingData(weeklySalesStats, 7, 1);

    const weekly = weekNames.map((day, index) => ({
      day,
      purchase: purchaseWeekly[index] || 0,
      sales: salesWeekly[index] || 0,
    }));

    return res
      .status(200)
      .json({ yearly: yearly, monthly: monthly, weekly: weekly });
  } catch (error) {
    return res.status(500).json({
      error: "Something went wrong",
    });
  }
};

export const overview = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const saleOverview = await Invoice.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth, $lte: now },
          status: { $eq: "Paid" },
        },
      },
      { $unwind: "$products" },
      {
        $lookup: {
          from: "purchases",
          localField: "products.productId",
          foreignField: "productId",
          as: "purchaseDetails",
        },
      },
      { $unwind: "$purchaseDetails" },
      {
        $group: {
          _id: null,
          soldProductCost: {
            $sum: {
              $multiply: ["$products.quantity", "$purchaseDetails.cost"],
            },
          },
        },
      },
    ]);

    const salesCount = await Invoice.countDocuments({
      createdAt: { $gte: startOfMonth, $lte: now },
      status: { $eq: "Paid" },
    });

    const salesRevenue = await Invoice.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth, $lte: now },
          status: { $eq: "Paid" },
        },
      },
      { $group: { _id: null, revenue: { $sum: "$total" } } },
    ]);

    const purchaseCount = await Purchase.countDocuments({
      createdAt: { $gte: startOfMonth, $lte: now },
    });

    const purchaseOverview = await Purchase.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth, $lte: now },
        },
      },
      {
        $group: {
          _id: null,
          purchaseCost: { $sum: "$total" },
        },
      },
    ]);

    const inventory = await Product.aggregate([
      {
        $match: { availability: { $nin: ["Expired", "Out of Stock"] } },
      },
      { $group: { _id: null, quantity: { $sum: "$quantity" } } },
    ]);

    const categories = (await Product.distinct("category")) || [];
    const sales = salesCount || 0;
    const productInHand = inventory[0]?.quantity || 0;
    const soldCost = Math.round(saleOverview[0]?.soldProductCost || 0);
    const purchaseCost = Math.round(purchaseOverview[0]?.purchaseCost || 0);
    const revenue = Math.round(salesRevenue[0]?.revenue || 0);
    const profit = Math.round(revenue - soldCost) || 0;
    const purchase = purchaseCount || 0;

    res.json({
      sales: {
        sales,
        revenue,
        profit,
        soldCost,
      },
      purchase: {
        purchase,
        purchaseCost,
        productInHand,
        categories,
      },
    });
  } catch (error) {
    return res.status(500).json({
      error: "Something went wrong",
    });
  }
};

export const last7DaysProduct = async (req, res) => {
  const now = new Date();
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  try {
    const stats = await Product.aggregate([
      {
        $group: {
          _id: null,
          categories: { $addToSet: "$category" },
          lowStock: {
            $sum: { $cond: [{ $eq: ["$availability", "Low Stock"] }, 1, 0] },
          },
          outOfStock: {
            $sum: { $cond: [{ $eq: ["$availability", "Out of Stock"] }, 1, 0] },
          },
        },
      },
    ]);

    const revenueStats = await Invoice.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo, $lte: now },
          status: { $eq: "Paid" },
        },
      },
      {
        $group: {
          _id: null,
          revenue: { $sum: "$total" },
        },
      },
    ]);

    const quantityStats = await Invoice.aggregate([
      {
        $match: { createdAt: { $gte: sevenDaysAgo, $lte: now } },
      },
      { $unwind: "$products" },
      {
        $group: {
          _id: null,
          sold: { $sum: "$products.quantity" },
        },
      },
    ]);

    const topSellingProducts = await Invoice.aggregate([
      {
        $match: { createdAt: { $gte: sevenDaysAgo, $lte: now } },
      },
      { $unwind: "$products" },
      {
        $group: {
          _id: null,
          productName: { $first: "$products.productName" },
          quantitySold: { $sum: "$products.quantity" },
          revenue: {
            $sum: { $multiply: ["$products.currentPrice", 1.18] },
          },
        },
      },
      { $sort: { quantitySold: -1 } },
      { $limit: 5 },
    ]);

    const topFive =
      Math.round(
        topSellingProducts.reduce((acc, item) => acc + item.totalRevenue, 0)
      ) || 0;

    const categories = stats[0]?.categories || [];
    const lowStockCount = stats[0]?.lowStock || 0;
    const outOfStockCount = stats[0]?.outOfStock || 0;
    const sold = quantityStats[0]?.sold || 0;
    const revenue = Math.round(revenueStats[0]?.revenue || 0);

    return res
      .status(200)
      .json({
        categories,
        lowStockCount,
        outOfStockCount,
        sold,
        revenue,
        topFive,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Something went wrong",
    });
  }
};

export const last7DaysInvoice = async (req, res) => {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const transactions = await Invoice.countDocuments({
      $or: [
        { createdAt: { $gte: sevenDaysAgo, $lte: now } },
        { updatedAt: { $gte: sevenDaysAgo, $lte: now } },
      ],
    });

    const invoicesCount = await Invoice.countDocuments({
      createdAt: { $gte: sevenDaysAgo, $lte: now },
    });

    const sold = await Invoice.aggregate([
      {
        $match: {
          $or: [
            { createdAt: { $gte: sevenDaysAgo, $lte: now } },
            { updatedAt: { $gte: sevenDaysAgo, $lte: now } },
          ],
          status: "Paid",
        },
      },
      {
        $group: {
          _id: null,
          amount: { $sum: "$total" },
        },
      },
    ]);

    const pendingOrders = await Invoice.countDocuments({
      status: "Unpaid",
    });

    const totalInvoicesCount = await Invoice.countDocuments();

    const processCount = await Invoice.aggregate([
      { $match: { status: "Paid" } },
      {
        $group: {
          _id: null,
          processCount: { $sum: "$processedCount" },
        },
      },
    ]);
  
    const stats = {
      transactions: transactions || 0,
      invoicesCount: invoicesCount || 0,
      sold: sold[0]?.amount || 0,
      pendingOrders: pendingOrders || 0,
      totalInvoicesCount: totalInvoicesCount || 0,
      processCount: processCount[0]?.processCount || 0,
    };

    return res.status(200).json({
      ...stats,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Something went wrong",
    });
  }
};

export const compareMonthData = async (req, res) => {
  try {
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const lastMonthRevenue = await Invoice.aggregate([
      {
        $match: {
          createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd },
          status: "Paid",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
        },
      },
    ]);

    const currentMonthRevenue = await Invoice.aggregate([
      {
        $match: {
          createdAt: { $gte: currentMonthStart, $lte: currentMonthEnd },
          status: "Paid",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
        },
      },
    ]);

    const lastMonthProductSold = await Invoice.aggregate([
      {
        $match: {
          createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd },
          status: "Paid",
        },
      },
      {
        $unwind: "$products",
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$products.quantity" },
        },
      },
    ]);

    const currentMonthProductSold = await Invoice.aggregate([
      {
        $match: {
          createdAt: { $gte: currentMonthStart, $lte: currentMonthEnd },
          status: "Paid",
        },
      },
      {
        $unwind: "$products",
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$products.quantity" },
        },
      },
    ]);

    const lastMonthProductStock = await Product.aggregate([
      {
        $match: { createdAt: { $lt: currentMonthStart } },
      },
      { $group: { _id: null, total: { $sum: "$quqntity" } } },
    ]);

    const currentMonthProductStock = await Product.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$quantity" },
        },
      },
    ]);

    const lastRevenue = lastMonthRevenue[0]?.total || 0;
    const currentRevenue = currentMonthRevenue[0]?.total || 0;
    const lastProductsSold = lastMonthProductSold[0]?.total || 0;
    const currentProductsSold = currentMonthProductSold[0]?.total || 0;
    const lastStock = lastMonthProductStock[0]?.total || 0;
    const currentStock = currentMonthProductStock[0]?.total || 0;

    const revenueChange =
      lastRevenue === 0
        ? 0
        : ((currentRevenue - lastRevenue) / lastRevenue) * 100;
    const productsSoldChange =
      lastProductsSold === 0
        ? 0
        : ((currentProductsSold - lastProductsSold) / lastProductsSold) * 100;
    const stockChange =
      lastStock === 0 ? 0 : ((currentStock - lastStock) / lastStock) * 100;

    return res.status(200).json({
      currentMonthRevenue: currentRevenue,
      currentMonthProductSold: currentProductsSold,
      currentMonthProductStock: currentStock,
      revenueChangePercentage: Math.round(revenueChange * 100) / 100,
      productSoldChangePercentage: Math.round(productsSoldChange * 100) / 100,
      stockChangePercentage: Math.round(stockChange * 100) / 100,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Something went wrong",
    });
  }
};

export const top5products = async (req, res) => {
  try {
    const products = await Invoice.aggregate([
      {
        $match: { status: "Paid" },
      },
      {
        $unwind: "$products",
      },
      {
        $group: {
          _id: "$products.name",
          name: { $first: "$products.name" },
          quantity: { $sum: "$products.quantity" },
        },
      },
      {
        $sort: { quantity: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    return res.status(200).json({
      products,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Something went wrong",
    });
  }
};
