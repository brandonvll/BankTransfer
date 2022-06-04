const express = require('express');
const cors = require('cors');
const { db } = require('../database/config');
const { usersRouter } = require('../routes/userRoutes');
const { transferRouter } = require('../routes/transferRoutes');
const User = require('./userModel');
const Transfer = require('./transferModel');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    //RUTAS
    this.userPath = '/api/v1/user';
    this.transferPath = '/api/v1/transfer';
    //Conectdb
    this.database();
    // MIDDLEWARES
    this.middleware();
    //ROUTES
    this.routes();
  }
  middleware() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  routes() {
    this.app.use(this.userPath, usersRouter);
    this.app.use(this.transferPath, transferRouter);
  }

  database() {
    db.authenticate()
      .then(() => console.log('Database authenticate'))
      .catch(err => console.log('err'));

    //Relation

    User.hasMany(Transfer, { foreignKey: 'senderUserId', sourceKey: 'id' });
    Transfer.belongsTo(User, { targetKey: 'id', foreignKey: 'senderUserId' });

    db.sync()
      .then(() => console.log('Database synced'))
      .catch(err => console.log('err'));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log('SERVIDOR CORRIENDO EN PUERTO: ' + this.port);
    });
  }
}

module.exports = Server;
