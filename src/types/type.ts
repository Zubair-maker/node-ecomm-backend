import { NextFunction, Request, Response } from "express";

export interface NewUserRequestBody {
  _id: string;
  name: string;
  email: string;
  photo: string;
  gender: string;
  dob: Date;
}

//product
export interface NewProductRequestBody {
  productName: string;
  category: string;
  price: number;
  stock: number;
}

//asyncHanler types
export type Controller = (
  req: Request<any>,
  res: Response,
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;

//
export type SearchQuery = {
  search?: string;
  price?: string;
  category?: string;
  sort?: string;
  page?: string;
};

export interface BaseQuery {
  productName?: {
    $regex: string;
    $options: string;
  };
  price?: {
    $lte: Number;
  };
  category?: string;
}

export type reValidateCache = {
  product?: boolean;
  order?: boolean;
  admin?: boolean;
};
