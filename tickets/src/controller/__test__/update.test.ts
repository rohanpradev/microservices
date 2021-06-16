import request from 'supertest';
import { Types } from 'mongoose';
import app from '../../app';
import Ticket from '../../models/ticket_model';

it('return a 404 if the provided id is not found', async () => {
  await request(app).put('/api/tickets/12345689').expect(404);
});

it('return a ticket if a ticket is  found', async () => {
  const cookie = global.signin();
  const { body: createdTicket } = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'test', price: 1000 });
  const id = createdTicket.data.ticket.id;
  const title = 'Concert';
  const price = 1000;

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', cookie)
    .send({ title, price })
    .expect(200);

  const { body: foundTicket } = await request(app)
    .get(`/api/tickets/${id}`)
    .set('Cookie', cookie)
    .expect(200);
  expect(foundTicket.data.ticket.title).toEqual(title);
  expect(foundTicket.data.ticket.price).toEqual(price);
});

it('rejects updates if the ticket is reserved', async () => {
  const cookie = global.signin();
  const { body } = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'test', price: 1000 });
  const id = body.data.ticket.id;

  const ticket = await Ticket.findById(id);
  await ticket?.set({ orderId: Types.ObjectId().toHexString() }).save();

  const title = 'Concert';
  const price = 1000;
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', cookie)
    .send({ title, price })
    .expect(400);
});
