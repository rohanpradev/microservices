import mongoose from 'mongoose';
import app from './app';
import { natsWrapper } from './utils';
import {
  TicketCreatedListener,
  TicketUpdatedListener,
  ExpirationCompleteListener,
  PaymentCreatedListener,
} from './events/listeners';

process.on('uncaughtException', (err) => {
  console.log('Uncaught exception... Shutting down');
  console.log(err.name, err.message);
  process.exit(1);
});

const port = process.env.PORT || 3000;

const start = async () => {
  if (!process.env.JWT_KEY) throw new Error('JWT_KEY must be defined!');
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI must be defined!');
  if (!process.env.NATS_CLIENT_ID) throw new Error('NATS_CLIENT_ID must be defined!');
  if (!process.env.NATS_CLUSTER_ID) throw new Error('NATS_CLUSTER_ID must be defined!');
  if (!process.env.NATS_URL) throw new Error('NATS_URL must be defined!');
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed');
      process.exit();
    });

    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();
    new ExpirationCompleteListener(natsWrapper.client).listen();
    new PaymentCreatedListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
  } catch (err) {
    console.error(err);
  }

  app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
  });
};

start();
