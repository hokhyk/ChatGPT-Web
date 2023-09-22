import { Request, Response, NextFunction } from "express";
import { httpBody } from "../utils";

const catchError = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.log(`[${req.method}][${req.path}]:${err.message} [body]:${JSON.stringify(req.body)} [query]:${JSON.stringify(req.query)}`);

  try {
    const errJson = JSON.parse(err.message);
    res.status(500).json(errJson);
  } catch (e) {
    res.status(500).json(httpBody(5000, err.message));
  }

  next(err);
};

export default catchError;
