import { ExpirationCompleteEvent, Publisher, Subjects } from '@grider-courses/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
