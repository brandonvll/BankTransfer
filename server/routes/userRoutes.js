const { Router } = require('express');
const { check } = require('express-validator');
const {
  register,
  login,
  getHistory,
} = require('../controllers/userController');
const {
  accountExist,
  existUserByIdParams,
} = require('../middlewares/userMiddlewares');
const { validateFields } = require('../middlewares/validateFields');

const router = Router();

router.post(
  '/signup',
  [
    check('name', 'name is required').not().isEmpty(),
    check(
      'password',
      'the password is mandatory and must have a minium of 8 characters'
    ).isLength({ min: 8 }),
    validateFields,
  ],
  register
);

router.post(
  '/login',
  [
    check(
      'accountNumber',
      'The entered account number is mandatory and must have e minimum of 6 characters'
    ).isLength({ min: 6 }),
    check(
      'password',
      'the password is mandatory and must have a minium of 8 characters'
    ),
    validateFields,
    accountExist,
  ],
  login
);

router.get('/:id/history', existUserByIdParams, getHistory);

module.exports = { usersRouter: router };
