import { Listener, Subjects, OrderCreatedEvent } from '@grider-courses/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const order = Order.createOrder({
      id: data.id,
      version: data.version,
      userId: data.userId,
      status: data.status,
      price: data.ticket.price,
    });
    await order.save();
    msg.ack();
  }
}
