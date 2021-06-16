import { NotFoundError, BadRequestError, NotAuthorizedError } from '@grider-courses/common';
import { NextFunction, Response, Request } from 'express';
import { TicketUpdatedPublisher } from '../events/publishers';
import Ticket from '../models/ticket_model';
import { catchAsync, natsWrapper, ResponseMessageType } from '../utils';

export const updateTicket = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  /** STEP 1
   * Find the id of the ticket to be updated
   */
  const ticket = await Ticket.findById(req.params.id);

  /** STEP 2
   * If the ticket is not found the return
   */
  if (!ticket) return next(new NotFoundError());

  /** STEP 3
   * If the ticket has an orderId then it is <*RESERVED*> so do not allow update
   */
  if (ticket.orderId) return next(new BadRequestError('Ticket is reserved.'));

  /** STEP 4
   * If the ticket is modified by someone else apart from owner of the ticket then return
   * Only owner can modify the ticket
   */
  if (ticket.userId !== req.currentUser!.id) return next(new NotAuthorizedError());

  /** STEP 5
   * Update and save the ticket
   */
  const { title, price } = req.body;
  await ticket.set({ title, price }).save();

  /** STEP 6
   * Publish a ticket updated event
   */
  new TicketUpdatedPublisher(natsWrapper.client).publish({
    title: ticket.title,
    id: ticket.id,
    price: ticket.price,
    userId: ticket.userId,
    version: ticket.version,
    serial: 12,
  });

  /** STEP 7
   * Send the response with updated ticket data
   */
  res.send({ status: ResponseMessageType.SUCCESS, data: { ticket } });
});
