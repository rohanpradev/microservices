import { NotFoundError } from '@grider-courses/common';
import { RequestHandler } from 'express';

export const notFoundHandler: RequestHandler = (req, res, next) => {
  next(new NotFoundError());
};
