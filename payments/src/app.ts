import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { errorHandler, currentUser } from '@grider-courses/common';
import middleware from './middleware';
import paymentsRouter from './routes/payment_routes';

const app = express();

app.set('trust proxy', true);

app.use(express.json({ limit: '10kb' }));

app.use(cookieSession({ signed: false, secure: process.env.NODE_ENV !== 'test' }));

app.use(currentUser);

app.use('/api/payments', paymentsRouter);

app.all('*', middleware.notFoundHandler);

app.use(errorHandler);

export default app;
