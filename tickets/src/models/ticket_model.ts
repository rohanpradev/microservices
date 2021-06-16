import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
/**
 * @interface TicketType
 * That describes the properties that are required to create a new Ticket
 */
interface TicketType {
  title: string;
  price: number;
  userId: string;
  orderId?: string;
}

/**
 * @interface TicketModel
 * That describes the properties that a Ticket Model has
 */
interface TicketModel extends mongoose.Model<TicketDoc> {
  createTicket(attrs: TicketType): TicketDoc;
}

/**
 * @interface TicketDoc
 * That describes the properties that a Ticket document has
 */
interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version: number;
  orderId?: string;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
    },
  },
  {
    toJSON: {
      // versionKey: false,
      transform(_, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ticketSchema.set('versionKey', 'version');

ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.createTicket = (ticket: TicketType) => new Ticket(ticket);

const Ticket = mongoose.model<TicketDoc, TicketModel>('tickets', ticketSchema);

export default Ticket;
