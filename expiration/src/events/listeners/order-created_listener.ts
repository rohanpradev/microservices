import { Listener, OrderCreatedEvent, Subjects } from '@grider-courses/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queueGroupName';
import { expirationQueue } from '../../queues/expiration_queue';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    await expirationQueue.add({ orderId: data.id }, { delay });
    msg.ack();
  }
}
