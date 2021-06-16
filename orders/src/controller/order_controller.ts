import { NotAuthorizedError, NotFoundError } from '@grider-courses/common';
import { NextFunction, Request, Response } from 'express';
import { Order } from '../models';
import { catchAsync, ResponseMessageType } from '../utils';
import { createOrder } from './create-order_controller';
import { deleteOrder } from './delete-order_controller';

const getOrders = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const orders = await Order.find({ userId: req.currentUser!.id }).populate('ticket');
  res.send({ status: ResponseMessageType.SUCCESS, data: { orders } });
});

const getSingleOrder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { orderId } = req.params;
  const order = await Order.findById(orderId).populate('ticket');
  if (!order) return next(new NotFoundError());
  if (order?.userId !== req.currentUser!.id) return next(new NotAuthorizedError());
  res.send({ status: ResponseMessageType.SUCCESS, data: { order } });
});

export default { getOrders, getSingleOrder, createOrder, deleteOrder };
