import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
} from '@grider-courses/common';
import { NextFunction, Response, Request } from 'express';
import { Order, Payment } from '../models';
import { catchAsync, ResponseMessageType, natsWrapper, stripe } from '../utils';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created_publisher';

export const createCharge = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // STEP 1 Pull out token and order for body
  const { token, orderId } = req.body;

  // STEP 2 Find the respective order using orderId
  const order = await Order.findById(orderId);

  // STEP 3 Check if order is present or not
  if (!order) return next(new NotFoundError());

  // STEP 4 If order user id matches orderId
  if (order.userId !== req.currentUser?.id) return next(new NotAuthorizedError());

  // STEP 5 Check if order status is not <*CANCELLED*>
  if (order.status === OrderStatus.Cancelled)
    return next(new BadRequestError('Cannot pay for a cancelled order'));

  // STEP 6 Make use of the STRIPE API to charge the user
  const charge = await stripe.charges.create({
    currency: 'inr',
    amount: order.price * 100,
    source: token,
  });

  // STEP 7 Save the stripe id to get info about transaction
  const payment = await Payment.createPayment({ orderId, stripeId: charge.id });
  payment.save();
  
  // STEP 8 Publish a payment created event
  new PaymentCreatedPublisher(natsWrapper.client).publish({
    id: payment.id,
    version: 0,
    orderId: payment.orderId,
    ticketId: '',
    stripeId: charge.id,
  });
  
  // STEP 9 Send the success response
  res.send({ status: ResponseMessageType.SUCCESS });
});
