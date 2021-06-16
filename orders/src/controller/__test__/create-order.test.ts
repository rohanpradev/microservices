import { Types } from 'mongoose';
import request from 'supertest';
import { OrderStatus } from '@grider-courses/common';
import app from '../../app';
import { Order, Ticket } from '../../models';
import { natsWrapper } from '../../utils';

it('returns an error if the ticket does not exist', async () => {
  const ticketId = Types.ObjectId();
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId })
    .expect(404);
});

it('returns an error if the ticket is already reserved', async () => {
  const ticket = await Ticket.createTicket({
    title: 'Concert',
    price: 20,
    id: Types.ObjectId().toHexString(),
  }).save();
  const order = Order.createOrder({
    userId: '123456',
    ticket,
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it('reserves a ticket', async () => {
  const ticket = await Ticket.createTicket({
    title: 'Concert',
    price: 20,
    id: Types.ObjectId().toHexString(),
  }).save();
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it('emits an order created event', async () => {
  const ticket = await Ticket.createTicket({
    title: 'Concert',
    price: 20,
    id: Types.ObjectId().toHexString(),
  }).save();
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
