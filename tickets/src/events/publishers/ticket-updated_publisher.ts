import { Publisher, Subjects, TicketUpdatedEvent } from '@grider-courses/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
