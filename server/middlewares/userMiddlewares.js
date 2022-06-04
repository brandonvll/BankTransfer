const { response } = require('express');
const User = require('../models/userModel');

const accountExist = async (req, res = response, next) => {
  const { accountNumber } = req.body;
  try {
    const user = await User.findOne({
      where: {
        accountNumber,
        status: true,
      },
    });
    if (!user) {
      return res.status(400).json({
        msg: 'the account is not registered',
      });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({
      msg: 'Speak whith the administer',
    });
  }
};

const existAccountPerId = async (req, res = response, next) => {
  const { senderUserId } = req.body;

  try {
    const user = await User.findByPk(senderUserId);

    if (!user) {
      return res.status(400).json({
        msg: 'error in the transfer, the account that sends the money does not exist',
      });
    }

    if (!user.status) {
      return res.status(400).json({
        msg: 'the account is not registered',
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      msg: 'Speak whith the administer',
    });
  }
};

const existUserByIdParams = async (req, res = response, next) => {
  const { id } = req.params;

  try {
    const user = await User.findOne({
      where: {
        id,
        status: 'true',
      },
    });
    if (!user) {
      return res.status(400).json({
        msg: 'the account is not registered',
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      msg: 'Speak whith the administer',
    });
  }
};

module.exports = { accountExist, existUserByIdParams, existAccountPerId };
