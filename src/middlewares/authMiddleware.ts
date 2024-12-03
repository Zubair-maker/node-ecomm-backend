import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "./errorMiddleware.js";

export const isAdmin = asyncHandler(async (req, res, next) => {
  const { id } = req.query;
  console.log("id",id)
  if (!id) {
    throw new ApiError("unauthorise user", 401);
  }

  const user = await User.findById(id);

  if (!user) {
    throw new ApiError("unauthorise user", 401);
  }

  if (user.role !== "admin") {
    throw new ApiError("unauthorise user", 401);
  }

  next();
});
