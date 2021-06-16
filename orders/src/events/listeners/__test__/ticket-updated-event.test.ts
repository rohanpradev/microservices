import { TicketUpdatedListener } from '../ticket-updated_listener';
import { natsWrapper } from '../../../utils';
import { TicketUpdatedEvent } from '@grider-courses/common';
import { Types } from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models';

const setup = async () => {
  // create an instance of the listener
  const listener = new TicketUpdatedListener(natsWrapper.client);
  // create and save a ticket
  const ticket = await Ticket.createTicket({
    id: Types.ObjectId().toHexString(),
    title: 'Concert',
    price: 100,
  }).save();

  // create a fake data
  const data: TicketUpdatedEvent['data'] = {
    version: 1,
    id: ticket.id,
    title: 'Concert:Dire-Straits',
    price: 99999,
    userId: 'sarearsd',
    serial: 1,
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = { ack: jest.fn() };

  return { listener, ticket, data, msg };
};

it('finds updates and saves a ticket', async () => {
  const { listener, ticket, data, msg } = await setup();
  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);
  // write assertion to make sure ticket matches the data and is created
  expect(updatedTicket?.version).toEqual(data.version);
  expect(updatedTicket?.price).toEqual(data.price);
  expect(updatedTicket?.title).toEqual(data.title);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  // write assertion to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a skipped version number', async () => {
  const { listener, data, msg } = await setup();
  data.version = 10;
  try {
    await listener.onMessage(data, msg);
  } catch (err) {}
  expect(msg.ack).not.toHaveBeenCalled();
});
