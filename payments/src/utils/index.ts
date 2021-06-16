import catchAsync from './catchAsync';
import { Types } from 'mongoose';
import { natsWrapper } from './nats-wrapper';
import { stripe } from './stripe';

enum ResponseMessageType {
  SUCCESS = 'SUCCESS',
  FAIL = 'FAILED',
}

const ObjectId = Types.ObjectId;

const isValidObjectId = (id: string) =>
  ObjectId.isValid(id) ? (String(new ObjectId(id)) === id ? true : false) : false;

export { catchAsync, isValidObjectId, ResponseMessageType, natsWrapper, stripe };
