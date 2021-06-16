import { requireAuth, validateRequest } from '@grider-courses/common';
import { Router } from 'express';
import { body } from 'express-validator';
import { createCharge } from '../controller/create-charge_controller';

const router = Router();

router
  .route('/')
  .post(
    requireAuth,
    [
      body('token').notEmpty().withMessage('Please provide a token'),
      body('orderId').notEmpty().withMessage('Please provide an orderId'),
    ],
    validateRequest,
    createCharge
  );

export default router;
