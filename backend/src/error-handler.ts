import { Request, Response, NextFunction } from "express";
import { ErrorCodes, HttpException } from "./exceptions/root";
import { InternalException } from "./exceptions/internal-exception";
import { ZodError } from "zod";
import { UnprocessableEntity } from "./exceptions/validation";

export const errorHandler = (func: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next)
    } catch (error: any) {


      let exception: HttpException;

      if (error instanceof ZodError) {

        exception = new UnprocessableEntity(error, 'Validation Error', ErrorCodes.UNPROCESSABLE_ENTITY);
      }
      else if (error instanceof HttpException) {
        exception = error;
      } else {
        exception = new InternalException('Internal Server Error', ErrorCodes.INTERNAL_EXCEPTION, error.message);
      }

      // res.status(error.statusCode).json({
      //   message: error.message,
      //   errorCode: error.errorCode,
      //   errors: error.errorMessage
      // });
      next(exception);
    }
  }
}