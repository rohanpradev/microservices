import { NextFunction, Response, Request } from 'express';
import { TicketCreatedPublisher } from '../events/publishers';
import Ticket from '../models/ticket_model';
import { catchAsync, natsWrapper, ResponseMessageType } from '../utils';

export const createTicket = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  /** STEP 1
   * Create a new ticket and save to DB
   */
  const { title, price } = req.body;
  const ticket = await Ticket.createTicket({ title, price, userId: req.currentUser!.id }).save();
  
  /** STEP 2
   * Publish a ticket created event
   */
  new TicketCreatedPublisher(natsWrapper.client).publish({
    title: ticket.title,
    id: ticket.id,
    price: ticket.price,
    userId: ticket.userId,
    version: ticket.version,
    serial: 12,
  });
  
  /** STEP 3
   * Send the response with updated ticket data
   */
  res.status(201).send({ status: ResponseMessageType.SUCCESS, data: { ticket } });
});
