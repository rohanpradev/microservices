import { OrderStatus } from '@grider-courses/common';
import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { TicketDoc } from './ticket_model';

/**
 * @interface OrderType
 * That describes the properties that are required to create a new Order
 */
interface OrderType {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

/**
 * @interface OrderModel
 * That describes the properties that a Order Model has
 */
interface OrderModel extends mongoose.Model<OrderDoc> {
  createOrder(attrs: OrderType): OrderDoc;
}

/**
 * @interface OrderDoc
 * That describes the properties that a Order document has
 */
interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
  version: number;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
      required: true,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
    },
  },

  {
    toJSON: {
      transform(_, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

orderSchema.set('versionKey', 'version');

orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.createOrder = (attrs: OrderType) => new Order(attrs);

const Order = mongoose.model<OrderDoc, OrderModel>('orders', orderSchema);

export default Order;
