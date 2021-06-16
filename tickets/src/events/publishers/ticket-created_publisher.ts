import { Publisher, Subjects, TicketCreatedEvent } from '@grider-courses/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
