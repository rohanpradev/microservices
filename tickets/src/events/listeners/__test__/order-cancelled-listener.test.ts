import { OrderCancelledEvent, OrderStatus } from '@grider-courses/common';
import { Types } from 'mongoose';
import { Message } from 'node-nats-streaming';
import Ticket from '../../../models/ticket_model';
import { natsWrapper } from '../../../utils';
import { OrderCancelledListener } from '../order-cancelled_listener';

const setup = async () => {
  // create an instanc eof the listener
  const listener = new OrderCancelledListener(natsWrapper.client);
  // create a ticket with some data
  const orderId = Types.ObjectId().toHexString();
  const ticket = Ticket.createTicket({ title: 'Concert', price: 99, userId: 'adsakldj' });
  ticket.set({ orderId });
  await ticket.save();

  // create a fake data event
  const data: OrderCancelledEvent['data'] = {
    id: Types.ObjectId().toHexString(),
    version: 0,
    userId: ticket.userId,
    ticket: {
      id: ticket.id,
    },
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, ticket, msg };
};

it('updates the ticket, publishes an event, acks the message', async () => {
  const { listener, data, ticket, msg } = await setup();
  await listener.onMessage(data, msg);
  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket?.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
