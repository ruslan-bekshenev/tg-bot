require('dotenv').config()
const fs = require('fs')
const sequelize = require('./db')
const { User, Chat, UserChat } = require('./models')
const TelegramApi = require('node-telegram-bot-api')
const token = `${process.env.BOT_ID}:${process.env.BOT_TOKEN}`

const bot = new TelegramApi(token, { polling: true })

function randomInteger(min, max) {
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}

const answers = ['ДА!', `Нет!`, `Не знаю!`]

const start = async () => {

  try {
    await sequelize.authenticate()
    await sequelize.sync()
  } catch (e) {
    console.log('Подключение к бд сломалось')
  }

  bot.setMyCommands([
    { command: '/start', description: 'Приветствие' },
    { command: '/info', description: 'Получить информацию' },
    { command: '/kto_loh', description: 'Определяить лоха' },
    { command: '/register', description: 'Регистрация нового пользователя' },
    { command: '/solution', description: 'Помогает определиться' }
  ])
  
  bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;
    if (text === '/start') {
      return bot.sendMessage(chatId, `Добро пожаловать в телеграм бот`)
    }
    if (text === '/info') {
      return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
    }
    if (text.indexOf('/solution') > -1) {
      const answerIndex = randomInteger(0, 2)
      return bot.sendMessage(chatId, `${answers[answerIndex]} ${msg.from.first_name} ${msg.from.last_name}`)
    }
    if (text === '/kto_loh') {
      const ids =  fs.readFileSync(`${chatId}.txt`, 'utf-8', (err) => {
        if (err) {
          throw err
        }
      }).split('\r\n')
      const indexLoh = randomInteger(0, ids.length - 1)
      if (ids[indexLoh]) {
        const currentLoh = await bot.getChatMember(chatId, +ids[indexLoh])
        return bot.sendMessage(chatId, `На данный момент лохом является ${currentLoh.user.first_name ?? 'без имени'} ${currentLoh.user.last_name ?? 'без фамилии'}`)
      }
      return bot.sendMessage(chatId, `Лох не найден`)
    }
    if (text === '/register') {
      let ids = []
      try {
        const user = await User.create({ where: { tgId: msg.from.id, firstName: msg.from.first_name, listName: msg.from.last_name, tgLogin: msg.from.username, chats: { chatId: `${msg.chat.id}`, title: msg.chat.title } } }, { include: Chat })
      } catch (e) {
        throw e
      }
      
      const findedId = ids.find((id) => +id === msg.from.id)
      if (!findedId) {
        fs.appendFileSync(`${chatId}.txt`, `${msg.from.id}\r\n`, (err) => {
          if (err) {
            throw err
          }
        })
        return bot.sendMessage(chatId, `${msg.from.first_name} ${msg.from.last_name} успешно зарегистрировался!!!`)
      }
      return bot.sendMessage(chatId, `${msg.from.first_name} ${msg.from.last_name} уже зарегистрирован`)
    }
    return bot.sendMessage(chatId, 'Не понимать')
  })
}

start()