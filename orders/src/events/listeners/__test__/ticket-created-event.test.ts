import { TicketCreatedListener } from '../ticket-created_listener';
import { natsWrapper } from '../../../utils';
import { TicketCreatedEvent } from '@grider-courses/common';
import { Types } from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models';

const setup = async () => {
  // create an instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client);
  // create a fake data
  const data: TicketCreatedEvent['data'] = {
    version: 0,
    id: new Types.ObjectId().toHexString(),
    title: 'Concert',
    price: 100,
    userId: new Types.ObjectId().toHexString(),
    serial: 1,
  };
  // create a fake message object
  // @ts-ignore
  const msg: Message = { ack: jest.fn() };

  return { listener, data, msg };
};

it('creates and saves a test', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  const ticket = await Ticket.findById(data.id);
  // write assertion to make sure ticket matches the data and is created
  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  // write assertion to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});
