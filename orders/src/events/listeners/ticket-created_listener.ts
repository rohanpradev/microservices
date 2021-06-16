import { Listener, Subjects, TicketCreatedEvent } from '@grider-courses/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models';
import { queueGroupName } from './queue-group-name';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { title, price, id, version } = data;
    console.log('CREATING TICKET', data);
    await Ticket.createTicket({ title, price, id, version }).save();
    console.log('CREATED TICKET');
    msg.ack();
  }
}
