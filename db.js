require('dotenv').config()
const { Sequelize } = require('Sequelize')

module.exports = new Sequelize(
  process.env.DATABASE,
  process.env.DATABASE_NAME,
  process.env.DATABASE_PASSWORD,
  {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres'
  }
)