import { OrderStatus } from '@grider-courses/common';
import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import Order from './order_model';

interface TicketType {
  title: string;
  price: number;
  id: string;
  version: number;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  createTicket(attrs: TicketType): TicketDoc;
  findByEvent(event: { id: string; version: number }): Promise<TicketDoc | null>;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
  version: number;
}

const ticketSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
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

ticketSchema.set('versionKey', 'version');

ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.createTicket = (attrs: TicketType) =>
  new Ticket({ _id: attrs.id, ...attrs, id: undefined });

ticketSchema.methods.isReserved = async function () {
  // this === the ticketDocument tht we just  called 'isReserved' on
  const existingOrder = await Order.findOne({
    ticket: this._id,
    status: { $in: [OrderStatus.Created, OrderStatus.AwaitingPayment, OrderStatus.Complete] },
  });
  /** Check whether ticket is reserved
   *  Make sure that this ticket is not already reserved
   *  Run query to look at all orders. Find an order where he ticket
   *  is the ticket we just found *<and>* the order status is *<not>* cancelled.
   *  If we find an order from this that means the order *<is>* reserved
   */
  return !!existingOrder;
};

ticketSchema.statics.findByEvent = ({ id, version }: { id: string; version: number }) => {
  return Ticket.findOne({
    _id: id,
    version: version - 1,
  });
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('tickets', ticketSchema);

export default Ticket;
