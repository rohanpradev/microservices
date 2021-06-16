import { NotFoundError } from '@grider-courses/common';
import { RequestHandler } from 'express';

/**
 * @constant notFoundHandler
 * middleware that handles routes that are not matched by previous route handler
 * @see Always add in the end part of the middleware stack just before the global route handler
 * @param req 
 * @param res 
 * @param next 
 */
export const notFoundHandler: RequestHandler = (req, res, next) => {
  next(new NotFoundError());
};
