import { OrderStatus } from '@grider-courses/common';
import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

/**
 * @interface OrderType
 * That describes the properties that are required to create a new Order
 */
interface OrderType {
  id: string;
  status: OrderStatus;
  version: number;
  userId: string;
  price: number;
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
  version: number;
  price: number;
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
    price: { type: Number, required: true, min: 0 },
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

orderSchema.statics.createOrder = (attrs: OrderType) =>
  new Order({ ...attrs, _id: attrs.id, id: undefined });

const Order = mongoose.model<OrderDoc, OrderModel>('orders', orderSchema);

export default Order;
