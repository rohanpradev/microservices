import { OrderStatus } from '@grider-courses/common';
import request from 'supertest';
import { Types } from 'mongoose';
import app from '../../app';
import { Ticket, Order } from '../../models';
import { natsWrapper } from '../../utils';

it('marks an order as cancelled', async () => {
  const ticket = await Ticket.createTicket({
    title: 'Concert',
    price: 20,
    id: Types.ObjectId().toHexString(),
  }).save();
  const user = global.signin();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  const id = order.data.order.id;

  await request(app).delete(`/api/orders/${id}`).set('Cookie', user).expect(204);

  const foundOrder = await Order.findById(id);

  expect(foundOrder?.status).toEqual(OrderStatus.Cancelled);
});

it('emits an order deleted event', async () => {
  const ticket = await Ticket.createTicket({
    title: 'Concert',
    price: 20,
    id: Types.ObjectId().toHexString(),
  }).save();
  const user = global.signin();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  const id = order.data.order.id;

  await request(app).delete(`/api/orders/${id}`).set('Cookie', user).expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
