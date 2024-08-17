import { PrismaClient, Expense } from '@prisma/client';
import ApiError from '../utils/ApiError';
import httpStatus from 'http-status';

const prisma = new PrismaClient();

const createExpense = async (
  userId: string,
  amount: number,
  category: string,
  date: Date
): Promise<Expense> => {
  return prisma.expense.create({
    data: {
      userId,
      amount,
      category,
      date
    }
  });
};

const queryExpenses = async (userId: string, filter: any, options: any) => {
  const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
  const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10;
  const skip = (page - 1) * limit;

  const [result, total] = await Promise.all([
    prisma.expense.findMany({
      where: {
        userId,
        ...filter
      },
      orderBy: options.sortBy ? { [options.sortBy]: options.sortOrder || 'asc' } : { date: 'desc' },
      skip,
      take: limit
    }),
    prisma.expense.count({ where: { userId, ...filter } })
  ]);

  return {
    results: result,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    totalResults: total
  };
};

const getExpenseById = async (userId: string, expenseId: string): Promise<Expense | null> => {
  return prisma.expense.findUnique({
    where: {
      id: expenseId,
      userId: userId
    }
  });
};

const updateExpenseById = async (
  userId: string,
  expenseId: string,
  updateBody: Partial<Expense>
): Promise<Expense> => {
  const expense = await getExpenseById(userId, expenseId);
  if (!expense) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Expense not found');
  }
  return prisma.expense.update({
    where: { id: expenseId },
    data: updateBody
  });
};

const deleteExpenseById = async (userId: string, expenseId: string): Promise<Expense> => {
  const expense = await getExpenseById(userId, expenseId);
  if (!expense) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Expense not found');
  }
  return prisma.expense.delete({
    where: { id: expenseId }
  });
};

const getTotalSpentByUserId = async (userId: string): Promise<number> => {
  const result = await prisma.expense.aggregate({
    where: { userId },
    _sum: { amount: true }
  });
  return result._sum.amount || 0;
};

const getExpensesByUserIdAndDateRange = async (
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<Expense[]> => {
  return prisma.expense.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate
      }
    },
    orderBy: { date: 'desc' }
  });
};

export default {
  createExpense,
  queryExpenses,
  getExpenseById,
  updateExpenseById,
  deleteExpenseById,
  getTotalSpentByUserId,
  getExpensesByUserIdAndDateRange
};
