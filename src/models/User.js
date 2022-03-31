const sequelize = require('../db')
const { DataTypes } = require('sequelize')

const User = sequelize.define('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true },
  tgId: { type: DataTypes.INTEGER, unique: true },
  firstName: { type: DataTypes.STRING },
  lastName: { type: DataTypes.STRING },
  tgLogin: { type: DataTypes.STRING, allowNull: false },
})

module.exports = User