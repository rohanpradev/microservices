import { PaymentCreatedEvent, Publisher, Subjects } from '@grider-courses/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
