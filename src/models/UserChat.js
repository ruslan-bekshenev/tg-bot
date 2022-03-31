const sequelize = require('../db')
const User = require('./User')
const Chat = require('./Chat')

const UserChat = sequelize.define('User_Chat', {

}, { timestamps: false })

User.belongsToMany(Chat, { through: UserChat })
Chat.belongsToMany(User, { through: UserChat })

module.exports = UserChat