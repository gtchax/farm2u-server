import { ErrorRequestHandler, RequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Check for ObjectId mongoose error
  if (err.name === "CastError" && err.kind === "ObjectId") {
    message = "Resource not found";
    statusCode = 404;
  }
  res
    .status(statusCode)
    .json({
      error: message,
      stack: process.env.NODE_ENV === "production" ? "" : err.stack,
    });
};

export const notFound: RequestHandler = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};
