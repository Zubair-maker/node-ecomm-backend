import { NextFunction, Request, Response } from "express";

export interface NewUserRequestBody {
  _id: string;
  name: string;
  email: string;
  photo: string;
  gender: string;
  dob: Date;
}

//asyncHanler types
export type Controller = (
  req: Request<{}, {}, NewUserRequestBody>,
  res: Response,
  next: NextFunction
) =>  Promise<void | Response<any, Record<string, any>>>
