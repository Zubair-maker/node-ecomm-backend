import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.model.js";
import { NewUserRequestBody } from "../types/type.js";
import { asyncHandler } from "../middlewares/errorMiddleware.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

export const newUser = asyncHandler(
  async (
    req: Request<{}, {}, NewUserRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { _id, name, email, gender, photo, dob } = req.body;

    if (
      [_id, name, email, gender, photo, dob].some(
        (field: any) => field?.trim() === ""
      )
    ) {
      throw new ApiError("Please add all fields", 400);
    }

    const existedUser = await User.findOne({
      $or: [{ name }, { email }],
    });

    if (existedUser) {
      throw new ApiError("user already exist", 409);
    }
     
   //when login with google 
    let user = await User.findById(_id);
    if (user) {
      return res
        .status(201)
        .json(new ApiResponse(201, {}, `Welcome ${user.name}`));
    }
    user = await User.create({
      _id,
      name,
      email,
      gender,
      photo,
      dob: new Date(dob),
    });

    return res
      .status(201)
      .json(new ApiResponse(201, {}, `Welcome ${user.name}`));
  }
);

export const getAllUsers = asyncHandler(async (_, res, next) => {
  const user = await User.find({});

  if (!user) {
    return next(new ApiError("user not found", 400));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Users fetched Successfully"));
});

export const getUser = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);

  if (!user) {
    throw new ApiError("Invalid Id user not found", 404);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User fetched Successfully"));
});

export const deleteUser = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);

  if (!user) {
    return next(new ApiError("user not found", 400));
  }

  await User.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User deleted Successfully"));
});
