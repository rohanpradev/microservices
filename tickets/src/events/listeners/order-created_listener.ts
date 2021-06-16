import { Listener, OrderCancelledEvent, OrderCreatedEvent, Subjects } from '@grider-courses/common';
import { Message } from 'node-nats-streaming';
import Ticket from '../../models/ticket_model';
import { TicketUpdatedPublisher } from '../publishers';
import { queueGroupName } from './queueGroupName';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    // Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);
    // If no ticket then throw Error
    if (!ticket) throw new Error('Ticket not found');
    // mark the ticket as being reserved by setting its orderId property
    ticket.set({ orderId: data.id });
    // Save the ticket
    await ticket.save();
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      serial: 1,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version,
    });
    // Ack the message
    msg.ack();
  }
}
