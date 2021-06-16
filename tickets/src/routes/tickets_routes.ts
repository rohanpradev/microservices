import { NextFunction, Request, Response, Router } from 'express';
import ticketController from '../controller/tickets_controller';
import { body } from 'express-validator';
import { validateRequest, requireAuth, NotFoundError } from '@grider-courses/common';
import { isValidObjectId } from '../utils';

const router = Router();

router.param('id', (req: Request, res: Response, next: NextFunction, val: string) => {
  if (!isValidObjectId(val)) {
    return next(new NotFoundError());
  }
  next();
});

router
  .route('/')
  .get(ticketController.getTickets)
  .post(
    requireAuth,
    [
      body('title').notEmpty().withMessage('Please provide'),
      body('price').isFloat({ gt: 0 }).withMessage('Provide a valid price'),
    ],
    validateRequest,
    ticketController.createTicket
  );

router
  .route('/:id')
  .get(ticketController.getSingleTicket)
  .put(
    requireAuth,
    [
      body('title').notEmpty().withMessage('Please provide'),
      body('price').isFloat({ gt: 0 }).withMessage('Provide a valid price'),
    ],
    validateRequest,
    ticketController.updateTicket
  );

export default router;
