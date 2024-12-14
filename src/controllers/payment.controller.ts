import { asyncHandler } from "../middlewares/errorMiddleware.js";
import { Coupon } from "../models/coupon.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const createCoupen = asyncHandler(async (req, res, next) => {
  const { coupon, amount } = req.body;

  if (!coupon || !amount) {
    throw new ApiError("Invalid Id user not found", 404);
  }
  const coupenCode = await Coupon.create({
    coupon,
    amount,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        {},
        `Coupen Code ${coupenCode.coupon} Created Successfully`
      )
    );
});

export const applyDiscount = asyncHandler(async (req, res, next) => {
  const { coupon } = req.query;

  const discount = await Coupon.findOne({ coupon });

  if (!discount) {
    throw new ApiError("Invalid Coupen Code", 400);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { discount: discount.amount }));
});

export const allCoupons = asyncHandler(async (req, res, next) => {
  const coupons = await Coupon.find({});

  if (!coupons) {
    throw new ApiError("Coupons Code Not Found", 404);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, coupons, "All Coupons Fetched Successsfully"));
});

export const deleteCoupon = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const coupons = await Coupon.findByIdAndDelete(id);
  if (!coupons) {
    throw new ApiError("Coupon Not Found", 404);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Coupon Deleted Successsfully"));
});
