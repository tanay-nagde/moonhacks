import { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * A wrapper function to handle async errors in both controllers and middleware.
 */
export const asyncHandler =
  <T extends Request>(fn: (req: T, res: Response, next: NextFunction) => Promise<any>): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req as T, res, next)).catch(next);
  };
