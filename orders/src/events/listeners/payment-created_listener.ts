import { Listener, OrderStatus, PaymentCreatedEvent, Subjects } from '@grider-courses/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models';
import { queueGroupName } from './queue-group-name';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId);
    if (!order) throw new Error('Order not found!');
    await order?.set({ status: OrderStatus.AwaitingPayment }).save();
    msg.ack();
  }
}
