import { OrderCreatedEvent, TicketStatus, OrderStatus } from '@grider-courses/common';
import { Types } from 'mongoose';
import { Message } from 'node-nats-streaming';
import Ticket from '../../../models/ticket_model';
import { natsWrapper } from '../../../utils';
import { OrderCreatedListener } from '../order-created_listener';

const setup = async () => {
  // create an instanc eof the listener
  const listener = new OrderCreatedListener(natsWrapper.client);
  // create a ticket with some data
  const ticket = Ticket.createTicket({ title: 'Concert', price: 99, userId: 'adsakldj' });
  await ticket.save();

  // create a fake data event
  const data: OrderCreatedEvent['data'] = {
    id: Types.ObjectId().toHexString(),
    version: 0,
    userId: ticket.userId,
    status: OrderStatus.Created,
    expiresAt: 'sjadl',
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, ticket, msg };
};

it('sets the orderId of the ticket', async () => {
  const { listener, data, ticket, msg } = await setup();
  await listener.onMessage(data, msg);
  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket?.orderId).toEqual(data.id);
});

it('acks the message', async () => {
  const { listener, data, ticket, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
