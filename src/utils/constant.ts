import { dataCache } from "../app.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { OrderItemType, reValidateCache } from "../types/type.js";

export const reValidateDataCache = async ({
  product,
  order,
  admin,
  userId,
  orderId,
  productId,
}: reValidateCache) => {
  if (product) {
    // Define base keys to invalidate
    const productKey: string[] = [
      "latest-product",
      "all-product",
      "categories",
    ];
    if (typeof productId === "string") productKey.push(`product-${productId}`);
    if (typeof productId === "object") {
      productId.forEach((i) => productKey.push(`product-${i}`));
      // console.log("running");
    }
    // let products = await Product.find({}).select("_id");
    // products.forEach((i) => productKey.push(`product-${i.id}`));
    // Invalidate cache keys
    dataCache.del(productKey);
  }

  if (order) {
    const orderKey: string[] = [
      "all-orders",
      `my-orders-${userId}`,
      `order-${orderId}`,
    ];
    // let order = await Order.find({}).select("_id");
    // order.forEach((i) => orderKey.push(`order-${i.id}`));
    dataCache.del(orderKey);
  }
};
//dataCache.del("key-name");  Removes a specific cache key
//dataCache.del(["key1", "key2"]); emoves multiple cache keys

//if user add two product then this two prdct reduce frm stock
export const reduceStock = async (orderItem: OrderItemType[]) => {
  for (const order of orderItem) {
    const product = await Product.findById(order.productId);
    // console.log("productmidd",product)
    if (!product) throw new Error("Product not found");
    product.stock -= order.quantity;
    await product.save();
  }
};

// PercentageChange= (currentMonth − lastMonth)/lastMonth × 100 = %
export const calculatePercentChange = (thisMoth: number, lastMonth: number) => {
  if (lastMonth === 0) {
    return thisMoth > 0 ? 100 : 0; // Handle division by zero
  }
  const percent = (thisMoth / lastMonth) * 100;
  return Number(percent.toFixed(2));
};
//calculta revenue
// const currentMonthRevenue = currentMonthOrder.reduce((acc,order)=>{
//   if(typeof order.total === 'number'){
//       acc = acc + order.total
//   }
//   return acc;
// },0);

