const { response } = require('express');
const Transfer = require('../models/transferModel');
const User = require('../models/userModel');

const transferAmount = async (req, res = response) => {
  const { amount, accountNumber, senderUserId } = req.body;

  try {
    const userRx = await User.findOne({ where: { accountNumber } }); //user receiving the transaction
    const receiverUserId = userRx.id;
    //Verify that the user has capital

    const userTx = await User.findByPk(senderUserId); //user making the transaction

    if (amount > userTx.amount) {
      return res.status(400).json({
        msg: 'You dont have a balance to carry out this transaction',
      });
    }

    if (userRx.id == senderUserId) {
      return res.status(400).json({
        msg: 'you cannot send money from your account to the same account',
      });
    }

    const newAmountTx = userTx.amount - amount; // new capital of the account that consigns
    const newAmountRx = userRx.amount + amount; //new capital of the account that receives the money

    await userTx.update({ amount: newAmountTx });
    await userRx.update({ amount: newAmountRx });

    const transfer = new Transfer({ amount, senderUserId, receiverUserId });

    await transfer.save();

    res.json({
      msg: 'transaction carried out successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Speak whit the administer',
    });
  }
};

module.exports = {
  transferAmount,
};
