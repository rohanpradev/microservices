import { Listener, Subjects, TicketUpdatedEvent } from '@grider-courses/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models';
import { queueGroupName } from './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const { id, title, price, version } = data;
    const ticket = await Ticket.findByEvent({ id, version });
    if (!ticket) throw new Error('Ticket not Found');
    await ticket?.set({ title, price }).save();
    msg.ack();
  }
}
