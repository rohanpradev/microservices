import request from 'supertest';
import app from '../../app';
import { Types } from 'mongoose';
import { Ticket } from '../../models';

const createMultipleTickets = (arr: Array<{ title: string; price: number; id: string }>) => {
  const ticketList = arr.map((ticket) => Ticket.createTicket(ticket).save());
  return Promise.all(ticketList);
};

it('fetches all orders for a  particular user', async () => {
  //  Create three tickets
  const [ticket1, ticket2, ticket3] = await createMultipleTickets([
    { title: 'One', price: 10, id: Types.ObjectId().toHexString() },
    { title: 'Two', price: 20, id: Types.ObjectId().toHexString() },
    { title: 'Three', price: 30, id: Types.ObjectId().toHexString() },
  ]);
  const userOne = global.signin();
  const userTwo = global.signin();

  // Create one order as User #1
  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticket1.id })
    .expect(201);

  // Create two orders as User #2
  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticket2.id })
    .expect(201);
  const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticket3.id })
    .expect(201);

  // Make request to get orders for User #2
  const { body: orderList } = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .expect(200);
  expect(orderList.data.orders.length).toEqual(2);
  expect(orderList.data.orders[0].id).toEqual(orderOne.data.order.id);
  expect(orderList.data.orders[1].id).toEqual(orderTwo.data.order.id);
});
