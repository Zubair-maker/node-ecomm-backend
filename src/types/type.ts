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
  userId?: string;
  orderId?: string;
  productId?: string | string[];
};

export type OrderItemType = {
  productName: string;
  photo: string;
  price: number;
  quantity: number;
  productId: string; //we send json data ie string
};

export type ShippingType = {
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: number;
};
//order
export interface NewOrderRequestBody {
  shippingInfo: ShippingType;
  user: string;
  subTotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  orderItem: OrderItemType[];
}
