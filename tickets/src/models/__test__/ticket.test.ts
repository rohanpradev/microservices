import Ticket from '../ticket_model';

it('implements optimistic concurrency control', async (done) => {
  // Create an instance of a ticket
  const ticket = Ticket.createTicket({ userId: '1234', price: 5, title: 'concert' });

  // Save the ticket to the database
  await ticket.save();

  // fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // make two separate change to the tickets we fetched
  firstInstance?.set({ price: 10 });
  secondInstance?.set({ price: 20 });

  // Save the first fetched ticket
  await firstInstance?.save();

  // Save the second fetched ticket and expect an error
  try {
    await secondInstance?.save();
  } catch (e) {
    return done();
  }
  throw new Error('Should not reach this!');
});

it('increments the version number on multiple saves', async () => {
  const ticket = Ticket.createTicket({ userId: '1234', price: 5, title: 'concert' });
  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
