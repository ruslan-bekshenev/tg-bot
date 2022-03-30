const sequelize = require('./db')
const { DataTypes } = require('sequelize')

const User = sequelize.define('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true },
  tgId: { type: DataTypes.INTEGER, unique: true },
  firstName: { type: DataTypes.STRING },
  lastName: { type: DataTypes.STRING },
  tgLogin: { type: DataTypes.STRING, allowNull: false },
})

const Chat = sequelize.define('chat', {
  id: { type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true },
  chatId: { type: DataTypes.STRING, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false }
})

const UserChat = sequelize.define('User_Chat', {

}, { timestamps: false })

User.belongsToMany(Chat, { through: UserChat })
Chat.belongsToMany(User, { through: UserChat })

module.exports = { User, Chat, UserChat }