import { ExpirationCompleteEvent, Listener, OrderStatus, Subjects } from '@grider-courses/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models';
import { OrderCancelledPublisher } from '../publishers';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    // STEP 1: Find the order that is to be cancelled
    const order = await Order.findById(data.orderId).populate('ticket');

    // STEP 2: If order is not found the return with an error
    if (!order) throw new Error('Order not found!');

    // STEP 3: Do not mak the order as <*CANCELLED*> id order status is <*COMPLETE*>
    if (order.status === OrderStatus.Complete) return msg.ack();

    // STEP 4: CHange the order status to <*CANCELLED*> if payment is not complete
    await order.set({ status: OrderStatus.Cancelled }).save();

    // STEP 5: Publish an order cancelled event
    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      userId: order.userId,
      version: order.version,
      ticket: { id: order.ticket.id },
    });

    // STEP 6: acknowledge the message
    msg.ack();
  }
}
