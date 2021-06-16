import request from 'supertest';
import app from '../../app';

it('return a 404 if a ticket is not found', async () => {
  await request(app).get('/api/tickets/12345689').expect(404);
});

it('return a ticket if a ticket is  found', async () => {
  const title = 'Concert';
  const price = 1000;
  const { body } = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title, price });
  const id = body.data.ticket.id;
  const response = await request(app).get(`/api/tickets/${id}`).expect(200);
  expect(response.body.data.ticket.title).toEqual(title);
  expect(response.body.data.ticket.price).toEqual(price);
});
