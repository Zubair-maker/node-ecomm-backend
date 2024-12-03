import { Request } from "express";
import { asyncHandler } from "../middlewares/errorMiddleware.js";
import {
  BaseQuery,
  NewProductRequestBody,
  SearchQuery,
} from "../types/type.js";
import { Product } from "../models/product.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import { rm } from "fs";
import { dataCache } from "../app.js";
import { reValidateDataCache } from "../utils/constant.js";

export const newProduct = asyncHandler(
  async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
    const { productName, price, stock, category } = req.body;
    const photo = req.file;

    if (
      [productName, price, stock, category]?.some(
        (fields: any) => fields.trim() == ""
      )
    ) {
      if (photo?.path) {
        rm(photo.path, (err) => {
          if (err) console.error("Failed to remove file:", err);
        });
      }

      throw new ApiError("Please add all fields", 400);
    }

    if (!photo) {
      throw new ApiError("Please add photo", 400);
    }
    const product = await Product.create({
      productName,
      price,
      stock,
      category: category.toLowerCase(),
      photo: photo?.path,
    });
    // console.log("prod",product)
    //Clears relevant cache keys after creating a new product to ensure data consistency.cache remains accurate and up-to-date
    await reValidateDataCache({ product: true });
    return res
      .status(201)
      .json(new ApiResponse(201, product, "Product Created Successfully"));
  }
);

export const getLatestProduct = asyncHandler(async (req, res, next) => {
  let product;
  if (dataCache.has("latest-product")) product = JSON.parse(dataCache.get("latest-product")!);
  if(!product) throw new ApiError("Product Not Found", 404);
  else {
    product = await Product.find({}).sort({ createdAt: -1 }).limit(5);
    dataCache.set("latest-product", JSON.stringify(product));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product Fetched Successfully"));
});

export const getAdminProduct = asyncHandler(async (req, res, next) => {
  let product;
  if (dataCache.has("all-product"))  product = JSON.parse(dataCache.get("all-product")!);
  if(!product) throw new ApiError("Product Not Found", 404);
  else {
    product = await Product.find({});
    dataCache.set("all-product", JSON.stringify(product));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product Fetched Successfully"));
});

//detels dynamic
export const getSingleProduct = asyncHandler(async (req, res, next) => {
  let product;
  const { id } = req.params;
  if (dataCache.has(`product-${id}`))
    product = JSON.parse(dataCache.get("product-${id}")!);
  else {
    product = await Product.findById(id);
    if (!product) {
      throw new ApiError("Product not found", 404);
    }
    dataCache.set(`product-${id}`, JSON.stringify(product));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product Fetched Successfully"));
});

export const getAllCategoriesProduct = asyncHandler(async (_, res, next) => {
  let categories;
  if (dataCache.has("categories"))
    categories = JSON.parse(dataCache.get("categories") as string);
  else {
    categories = await Product.distinct("category");

    if (!categories) {
      throw new ApiError("category not found", 404);
    }
    dataCache.set("categories", JSON.stringify(categories));
  }

  return res.status(200).json(new ApiResponse(200, categories));
});

export const updateProduct = asyncHandler(
  async (
    req: Request<{ id: string }, {}, NewProductRequestBody>,
    res,
    next
  ) => {
    const { id } = req.params;
    const { productName, price, stock, category } = req.body;
    const photo = req.file;

    const product = await Product.findById(id);

    if (!product) {
      throw new ApiError("Product not found invalid  Id", 404);
    }
    if (photo) {
      rm(product.photo, () => {
        console.log("Old photo deleted.");
      });

      product.photo = photo.path;
    }

    if (productName) product.productName = productName;
    if (price) product.price = price;
    if (stock) product.stock = stock;
    if (category) product.category = category;

    await product.save();
    await reValidateDataCache({ product: true });
    return res
      .status(201)
      .json(new ApiResponse(201, product, "Product Updated Successfully"));
  }
);

export const deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError("Product not found", 404);
  }

  rm(product.photo, () => {
    console.log("Product photo deleted");
  });

  await Product.deleteOne();
  await reValidateDataCache({ product: true });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Product deleted Successfully"));
});

//sort filter search to allproduct
export const getAllProduct = asyncHandler(
  async (req: Request<{}, {}, {}, SearchQuery>, res, next) => {
    const { search, sort, category, price } = req.query;

    const page = Number(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const baseQuery: BaseQuery = {};
    if (search) {
      baseQuery.productName = {
        $regex: search,
        $options: "i",
      };
    }
    if (price) {
      baseQuery.price = {
        $lte: Number(price),
      };
    }
    if (category) {
      baseQuery.category = category;
    }

    // Promise.all Executes two parallel queries ,use when independent operations.
    const [products, productsbyFilter] = await Promise.all([
      Product.find(baseQuery)
        .sort(
          sort ? { price: sort === "asc" ? 1 : -1 } : {}
        ) /* .sort(sort && { price: sort === "asc" ? 1 : -1 }) */
        .limit(limit)
        .skip(skip),
      Product.countDocuments(baseQuery),
    ]);

    const totalPage = Math.ceil(productsbyFilter / limit);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { products, totalPage },
          "Product Fetched Successfully"
        )
      );
  }
);
//currentPage: Page, totalProducts
