import { Publisher, Subjects, OrderCancelledEvent } from '@grider-courses/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
