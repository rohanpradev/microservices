import { NotFoundError } from '@grider-courses/common';
import { NextFunction, Request, Response } from 'express';
import Ticket from '../models/ticket_model';
import { catchAsync, ResponseMessageType } from '../utils';
import { updateTicket } from './ticket-updated_controller';
import { createTicket } from './ticket-created_controller';

const getTickets = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const tickets = await Ticket.find({}).limit(10);
  res.send({ status: ResponseMessageType.SUCCESS, data: { tickets } });
});

const getSingleTicket = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) next(new NotFoundError());
  res.send({ status: ResponseMessageType.SUCCESS, data: { ticket } });
});

export default { getTickets, getSingleTicket, createTicket, updateTicket };
