const { Sequelize } = require('sequelize');

const db = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'Chamanquin12',
  database: 'DB_REPASO',
  logging: false,
});

module.exports = { db };
