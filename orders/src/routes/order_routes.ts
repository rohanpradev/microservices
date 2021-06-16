import { NotFoundError, validateRequest } from '@grider-courses/common';
import { NextFunction, Request, Response, Router } from 'express';
import { body } from 'express-validator';
import { isValidObjectId } from '../utils';
import orderController from '../controller/order_controller';

const router = Router();

router.param('orderId', (req: Request, res: Response, next: NextFunction, val: string) => {
  if (!isValidObjectId(val)) return next(new NotFoundError());
  next();
});

router
  .route('/')
  .get(orderController.getOrders)
  .post(
    [
      body('ticketId')
        .notEmpty()
        .withMessage('Ticket id must be provided!')
        .isMongoId()
        .withMessage('Please provide a valid Ticket id!'),
    ],
    validateRequest,
    orderController.createOrder
  );

router.route('/:orderId').get(orderController.getSingleOrder).delete(orderController.deleteOrder);

export default router;
