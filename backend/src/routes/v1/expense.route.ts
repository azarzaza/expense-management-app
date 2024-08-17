import express, { Router } from 'express';
import auth from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import { expenseValidation } from '../../validations';
import { expenseController } from '../../controllers';

const router: Router = express.Router();

router
  .route('/')
  .post(
    auth('manageExpenses'),
    validate(expenseValidation.createExpense),
    expenseController.createExpense
  )
  .get(auth('getExpenses'), validate(expenseValidation.getExpenses), expenseController.getExpenses);

router
  .route('/:expenseId')
  .get(auth('getExpenses'), validate(expenseValidation.getExpenses), expenseController.getExpense)
  .patch(
    auth('manageExpenses'),
    validate(expenseValidation.updateExpense),
    expenseController.updateExpense
  )
  .delete(
    auth('manageExpenses'),
    validate(expenseValidation.deleteExpense),
    expenseController.deleteExpense
  );

router.route('/total').get(auth('getExpenses'), expenseController.getTotalSpent);

router
  .route('/date-range')
  .get(
    auth('getExpenses'),
    validate(expenseValidation.getExpensesByDateRange),
    expenseController.getExpensesByDateRange
  );

export default router;
