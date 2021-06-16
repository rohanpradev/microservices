import request from 'supertest';
import { Types } from 'mongoose';
import app from '../../app';
import { Ticket } from '../../models';

it('fethes the order', async () => {
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

  const { body: fetchOrder } = await request(app)
    .get(`/api/orders/${id}`)
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(200);

  expect(fetchOrder.data.order.id).toEqual(id);
});

it('return an error if one user fetches another users order', async () => {
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

  await request(app)
    .get(`/api/orders/${id}`)
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(401);
});
