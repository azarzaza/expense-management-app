import Joi from 'joi';

const createExpense = {
  body: Joi.object().keys({
    amount: Joi.number().required(),
    category: Joi.string().required(),
    date: Joi.date().iso().required()
  })
};

const getExpenses = {
  query: Joi.object().keys({
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
};

const getExpensesByDateRange = {
  query: Joi.object().keys({
    startDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().required()
  })
};

const updateExpense = {
  body: Joi.object().keys({
    amount: Joi.number(),
    category: Joi.string(),
    date: Joi.date().iso()
  }),
  params: Joi.object().keys({
    expenseId: Joi.string().required()
  })
};

const deleteExpense = {
  params: Joi.object().keys({
    expenseId: Joi.string().required()
  })
};

export default {
  createExpense,
  getExpenses,
  getExpensesByDateRange,
  updateExpense,
  deleteExpense
};
