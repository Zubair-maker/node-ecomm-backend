import { dataCache } from "../app.js";
import { asyncHandler } from "../middlewares/errorMiddleware.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import { calculatePercentChange } from "../utils/constant.js";

export const getDashboardStats = asyncHandler(async (req, res, next) => {
  let stats;

  if (dataCache.has("admin-stats")) {
    stats = JSON.parse(dataCache.get("admin-stats")!);
  } else {
    const today = new Date();
    const startDateOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    let lastMonth =
      today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear();
    let lastMonthYear = today.getMonth() === 0 ? 11 : today.getMonth() - 1;
    const startDateOfLastMonth = new Date(
      lastMonth,
      today.getFullYear(),
      lastMonthYear,
      1
    );
    //new Date(year, month + 1, 0) creates a date for the last day of the given month.
    const endOFLastMonth = new Date(lastMonth, lastMonthYear + 1, 0);

    //last sixmonth ago
    const sixMonthAgo = new Date();
    sixMonthAgo.setMonth(sixMonthAgo.getMonth() - 6);
    //calculate this month products
    const currentMonthProducts = await Product.find({
      createdAt: {
        $gte: startDateOfMonth,
        $lte: new Date(),
      },
    });
    // Calculate last month's products
    const lastMonthProducts = await Product.find({
      createdAt: {
        $gte: startDateOfLastMonth,
        $lte: endOFLastMonth,
      },
    });
    //calculate this month orders
    const currentMonthOrder = await Order.find({
      createdAt: {
        $gte: startDateOfMonth,
        $lte: new Date(),
      },
    });
    // Calculate last month's Order
    const lastMonthOrder = await Order.find({
      createdAt: {
        $gte: startDateOfLastMonth,
        $lte: endOFLastMonth,
      },
    });
    //calculate this month users
    const currentMonthUser = await User.find({
      createdAt: {
        $gte: startDateOfMonth,
        $lte: new Date(),
      },
    });
    // Calculate last month's users
    const lastMonthUser = await User.find({
      createdAt: {
        $gte: startDateOfLastMonth,
        $lte: endOFLastMonth,
      },
    });
    const lastSixMonthOrder = await Order.find({
      createdAt: {
        $gte: sixMonthAgo,
        $lte: today,
      },
    });
    console.log("lastSix",lastSixMonthOrder)
    const orderMonthCount = new Array(6).fill(0);  //count of orders for each of the last six months
    const orderMonthRevenue = new Array(6).fill(0);  //total revenue for each of the last six months.
    lastSixMonthOrder.forEach((order)=>{
     const creationDate = order.createdAt;
     // difference in months between today and the order's creation date.
     const monthDiff = today.getMonth() - creationDate.getMonth();
     if(monthDiff < 6){
        orderMonthCount[6 - monthDiff - 1] += 1;
        orderMonthRevenue[6 - monthDiff - 1] += order.total
     }
    })
    //calculate revenue
    const currentMonthRevenue = currentMonthOrder.reduce(
      (acc, order) => acc + (order.total || 0),
      0
    );
    const lastMonthRevenue = lastMonthOrder.reduce(
      (acc, order) => acc + (order.total || 0),
      0
    );
    const revenueChangePercent = calculatePercentChange(
      currentMonthRevenue,
      lastMonthRevenue
    );
    // console.log("-->", revenueChangePercent);
    // Compile stats
    const productChangePercent = calculatePercentChange(
      currentMonthProducts.length,
      lastMonthProducts.length
    );
    const orderChangePercent = calculatePercentChange(
      currentMonthOrder.length,
      lastMonthOrder.length
    );
    const userChangePercent = calculatePercentChange(
      currentMonthUser.length,
      lastMonthUser.length
    );
    let productsCount = await Product.countDocuments();
    let usersCount = await User.countDocuments();
    let allOrder = await Order.find({}).select("total"); //total field in order collection
    let revenue = allOrder.reduce((acc, order) => acc + (order.total || 0), 0);
    const count = {
      revenue, //total - product
      users: usersCount,
      products: productsCount,
      order: allOrder.length,
    };
    stats = {
      revenue: revenueChangePercent,
      product: productChangePercent,
      order: orderChangePercent,
      user: userChangePercent,
      count,
      charts:{
        order:orderMonthCount,
        revenue:orderMonthRevenue
      }
    };
  }

  return res.json({
    success: true,
    stats,
  });
});
