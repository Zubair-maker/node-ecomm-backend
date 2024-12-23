import { Request } from "express";
import { asyncHandler } from "../middlewares/errorMiddleware.js";
import { NewOrderRequestBody } from "../types/type.js";
import { Order } from "../models/order.model.js";
import { reduceStock, reValidateDataCache } from "../utils/constant.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import { dataCache } from "../app.js";

export const newOrder = asyncHandler(
  async (req: Request<{}, {}, NewOrderRequestBody>, res, next) => {
    const {
      shippingInfo,
      user,
      subTotal,
      tax,
      shippingCharges,
      discount,
      total,
      orderItem,
    } = req.body;

    if (!shippingInfo || !orderItem || !user || !subTotal || !tax || !total) {
      throw new ApiError("Please Enter All Fields", 400);
    }

    const order = await Order.create({
      shippingInfo,
      user,
      subTotal,
      tax,
      shippingCharges,
      discount,
      total,
      orderItem,
    });
    // console.log("order", order);
    const temp = order.orderItem.map((i) => i.productId);
    await reduceStock(orderItem);
    await reValidateDataCache({
      product: true,
      order: true,
      admin: true,
      userId: user,
      productId: order.orderItem.map((i) => String(i.productId)),
    });

    return res
      .status(201)
      .json(new ApiResponse(201, "Product Created Successfully"));
  }
);

export const myOrders = asyncHandler(async (req, res, next) => {
  const { id } = req.query;
  
  let orders;
  // Check cache for orders
  if (dataCache.has(`my-orders-${id}`)) {
    orders = JSON.parse(dataCache.get(`my-orders-${id}`) as string);
  } else {
    // Fetch orders from database if not in cache
    orders = await Order.find({ user: id });
    // If no orders found, throw an error
    if (!orders || orders.length === 0) {
      throw new ApiError("Orders not found", 404);
    }
    // Save fetched orders in cache
    dataCache.set(`my-orders-${id}`, JSON.stringify(orders));
  }
  // Return the response
  res
    .status(200)
    .json(new ApiResponse(200, orders, "Orders fetched successfully"));
});

export const getAllOrders = asyncHandler(async (_, res, next) => {
  let orders;

  if (dataCache.has("all-orders"))
    orders = JSON.parse(dataCache.get("all-orders") as string);
  
  else {
    // Fetch orders from database if not in cache
    orders = await Order.find().populate("user", "name"); //we need user name who placed the order
    if (!orders || orders.length === 0) {
      throw new ApiError("orders not found", 404);
    }
    dataCache.set("all-orders", JSON.stringify(orders));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, orders, "All Order Fetched Successfully"));
});

export const getSingleOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  let order;

  if (dataCache.has(`order-${id}`))
    order = JSON.parse(dataCache.get(`order-${id}`) as string);
  else {
    order = await Order.findById(id).populate("user", "name");
    if (!order) {
      throw new ApiError("current order not found", 404);
    }
    dataCache.set(`order-${id}`, JSON.stringify(order));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order Fetched Successfully"));
});

export const processOrderStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const orderStatus = await Order.findById(id);

  if (!orderStatus) {
    throw new ApiError("order status not found", 404);
  }

  if (orderStatus.status === "Processing") {
    orderStatus.status = "Shipped";
  } else if (orderStatus.status === "Shipped") {
    orderStatus.status = "Delivered";
  }

  await orderStatus.save();
  await reValidateDataCache({
    product: false,
    order: true,
    admin: true,
    userId: orderStatus.user,
    orderId: String(orderStatus._id),
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        `Order Processed Successfully to '${orderStatus.status}'`
      )
    );
});

export const deleteOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findById(id);
  if (!order) {
    throw new ApiError("order not found", 404);
  }

  await order.deleteOne();
  await reValidateDataCache({
    product: false,
    order: true,
    admin: true,
    userId: order.user,
    orderId: String(order._id),
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Order Deleted  Successfully"));
});
