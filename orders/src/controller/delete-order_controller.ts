import { NotFoundError, NotAuthorizedError, OrderStatus } from '@grider-courses/common';
import { NextFunction, Request, Response } from 'express';
import { OrderCancelledPublisher } from '../events/publishers';
import { Order } from '../models';
import { catchAsync, natsWrapper, ResponseMessageType } from '../utils';

export const deleteOrder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  /** STEP 1
   * Find the order that is to be deleted
   */
  const { orderId } = req.params;
  const order = await Order.findById(orderId);

  /** STEP 2
   * If the order is not found then return
   */
  if (!order) return next(new NotFoundError());

  /** STEP 3
   * check if the order is created by the current user otherwise return
   */
  if (order?.userId !== req.currentUser!.id) return next(new NotAuthorizedError());

  /** STEP 4
   * change the order status of the order to <*Cancelled*>
   */
  order.status = OrderStatus.Cancelled;
  await order.save();

  /** STEP 5
   * Publish an event saying that an order was cancelled
   */
  new OrderCancelledPublisher(natsWrapper.client).publish({
    id: order.id,
    ticket: {
      id: order.ticket.id,
    },
    userId: order.userId,
    version: 1,
  });

  res.status(204).send({ status: ResponseMessageType.SUCCESS, data: { order } });
});
