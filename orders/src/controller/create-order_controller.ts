import { NotFoundError, BadRequestError, OrderStatus } from '@grider-courses/common';
import { NextFunction, Request, Response } from 'express';
import { OrderCreatedPublisher } from '../events/publishers';
import { Order, Ticket } from '../models';
import { catchAsync, natsWrapper, ResponseMessageType } from '../utils';

// time in seconds
const EXPIRATION_WINDOW_TIME = 1 * 60;

export const createOrder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { ticketId } = req.body;
  /** STEP 1
   *  Find the ticket that that user is trying to order in the database
   */
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) return next(new NotFoundError());

  /** STEP 2
   *  Check if the ticket is already reserved
   */
  const existingOrder = await ticket.isReserved();
  if (existingOrder) return next(new BadRequestError('Ticket is already reserved'));

  /** STEP 3
   * Calculate an expiration date for this order
   */
  const expiration = new Date();
  expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_TIME);

  /** STEP 4
   *  Build the order and save it to the database
   */
  const order = Order.createOrder({
    userId: req.currentUser!.id,
    status: OrderStatus.Created,
    expiresAt: expiration,
    ticket,
  });

  order.save();

  /** STEP 5
   * Publish an event saying that an order was created
   */

  new OrderCreatedPublisher(natsWrapper.client).publish({
    id: order.id,
    userId: order.userId,
    status: order.status,
    expiresAt: order.expiresAt.toISOString(),
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
    version: 1,
  });
  res.status(201).send({ status: ResponseMessageType.SUCCESS, data: { order } });
});
