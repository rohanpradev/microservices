import mongoose from 'mongoose';

/**
 * @interface PaymentType
 * That describes the properties that are required to create a new Payment
 */
interface PaymentType {
  orderId: string;
  stripeId: string;
}

/**
 * @interface PaymentModel
 * That describes the properties that a Payment Model has
 */
interface PaymentModel extends mongoose.Model<PaymentDoc> {
  createPayment(attrs: PaymentType): PaymentDoc;
}

/**
 * @interface PaymentDoc
 * That describes the properties that a Payment document has
 */
interface PaymentDoc extends mongoose.Document {
  orderId: string;
  stripeId: string;
}

const paymentSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true },
    stripeId: { type: String, required: true },
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

paymentSchema.statics.createPayment = (attrs: PaymentType) => new Payment(attrs);

const Payment = mongoose.model<PaymentDoc, PaymentModel>('payments', paymentSchema);

export default Payment;
