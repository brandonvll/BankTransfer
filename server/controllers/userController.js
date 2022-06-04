const bcryptjs = require('bcryptjs');
const { response } = require('express');
const { accountNumberGenerator } = require('../helpers/accountNumberGenerator');
const Transfer = require('../models/transferModel');
const User = require('../models/userModel');

const register = async (req, res = response) => {
  const { name, password } = req.body;

  try {
    const accountNumber = await accountNumberGenerator();
    const amount = 1000;

    const user = new User({ name, accountNumber, password, amount });

    //encrypt password
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);

    //Save on db
    await user.save();

    res.status(201).json({
      ok: true,
      name: user.name,
      uid: user.id,
      amount: user.amount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Speak whith the administer',
    });
  }
};

const login = async (req, res = response) => {
  const { password } = req.body; // ES LA QUE VIENE DE LA PETICION
  const { user } = req; // ESTO ES LO QUE VIENE DE LA BASE DE DATOS

  try {
    //verify password
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: 'the email or password is not correct',
      });
    }

    await user.save();

    res.status(201).json({
      ok: 'true',
      msg: 'successfully authenticated user',
      uid: user.id,
      name: user.name,
      amount: user.amount,
    });
  } catch (error) {
    res.status(500).json({
      msg: 'Speak whith the administer',
    });
  }
};

const getHistory = async (req, res = response) => {
  const { id } = req.user;

  try {
    const trans = await Transfer.findOne({ where: { senderUserId: id } });

    if (!trans) {
      return res.status(400).json({
        msg: 'there are no records in the account',
      });
    }

    const transfer = await Transfer.findAll({
      where: { senderUserId: id },
      include: [{ model: User }],
    });

    transfer.forEach(trans => {
      trans.senderUserId = undefined;
      trans.receiverUserId = undefined;
      trans.updatedAt = undefined;
      trans.user.accountNumber = undefined;
      trans.user.password = undefined;
      trans.user.amount = undefined;
      trans.user.status = undefined;
      trans.user.createdAt = undefined;
      trans.user.updatedAt = undefined;
    });

    res.status(200).json({
      ok: true,
      transfer,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Speak whith the administer',
    });
  }
};

module.exports = {
  register,
  login,
  getHistory,
};
