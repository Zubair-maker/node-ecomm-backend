import { dataCache } from "../app.js";
import { Product } from "../models/product.model.js";
import { reValidateCache } from "../types/type.js";

export const reValidateDataCache = async ({
  product,
  order,
  admin,
}: reValidateCache) => {
  if (product) {
    // Define base keys to invalidate
    const productKey: string[] = [
      "latest-product",
      "all-product",
      "categories",
    ];
    let products = await Product.find({}).select("_id");
    products.forEach((i) => productKey.push(`product-${i.id}`));
     // Invalidate cache keys
    dataCache.del(productKey);
  }
};

//dataCache.del("key-name");  Removes a specific cache key
//dataCache.del(["key1", "key2"]); emoves multiple cache keys
