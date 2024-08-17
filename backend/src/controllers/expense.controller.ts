import httpStatus from 'http-status';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { expenseService } from '../services';

const createExpense = catchAsync(async (req, res) => {
  const expense = await expenseService.createExpense(
    req.params.userId,
    req.body.amount,
    req.body.category,
    new Date(req.body.date)
  );
  res.status(httpStatus.CREATED).send(expense);
});

const getExpenses = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['category']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await expenseService.queryExpenses(req.params.userId, filter, options);
  res.send(result);
});

const getExpense = catchAsync(async (req, res) => {
  const expense = await expenseService.getExpenseById(req.params.userId, req.params.expenseId);
  if (!expense) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Expense not found');
  }
  res.send(expense);
});

const updateExpense = catchAsync(async (req, res) => {
  const expense = await expenseService.updateExpenseById(
    req.params.userId,
    req.params.expenseId,
    req.body
  );
  res.send(expense);
});

const deleteExpense = catchAsync(async (req, res) => {
  await expenseService.deleteExpenseById(req.params.userId, req.params.expenseId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getTotalSpent = catchAsync(async (req, res) => {
  const total = await expenseService.getTotalSpentByUserId(req.params.userId);
  res.send({ total });
});

const getExpensesByDateRange = catchAsync(async (req, res) => {
  const { startDate, endDate } = req.query;
  const expenses = await expenseService.getExpensesByUserIdAndDateRange(
    req.params.userId,
    new Date(startDate as string),
    new Date(endDate as string)
  );
  res.send(expenses);
});

export default {
  createExpense,
  getExpenses,
  getExpense,
  updateExpense,
  deleteExpense,
  getTotalSpent,
  getExpensesByDateRange
};
