const TelegramApi = require('node-telegram-bot-api')
const { gameOptions, againOptions } = reduire('./options')

const token = '7713557462:AAHd9hBYAEIFHBHJQ6hBXUklQwlsqpKyJNY'

const bot = new TelegramApi(token, { polling: true })

const chats = {}

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    'Сейчас я загадаю цифру от 0 до 9 а ты должен еe угадать'
  )
  const randomNumder = Math.floor(Math.random() * 10)
  chats[chatId] = randomNumder
  await bot.sendMessage(chatId, 'Отгадывай', gameOptions)
}

const start = () => {
  bot.setMyCommands([
    { command: '/start', description: 'Начальное приветствие' },
    { command: '/info', description: 'Получить информацию о пользователях' },
    { command: '/game', description: 'Игра угадай цифру' },
  ])

  bot.on('message', async (msg) => {
    const text = msg.text
    const chatId = msg.chat.id
    if (text === '/start') {
      await bot.sendSticker(
        chatId,
        'https://tlgrm.eu/_/stickers/4dd/300/4dd300fd-0a89-3f3d-ac53-8ec93976495e/1.webp'
      )
      return bot.sendMessage(chatId, `Добро пожаловать в канал бота !!!`)
    }
    if (text === '/info') {
      return bot.sendMessage(
        chatId,
        `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`
      )
    }
    if (text === '/game') {
      return startGame(chatId)
    }
    return bot.sendMessage(chatId, 'Я тебя не понял, попробуй ещё раз!')
  })
  bot.on('callback_query', (msg) => {
    const data = msg.data
    const chatId = msg.message.chat.id
    if (data === '/again') {
      return startGame(chatId)
    }
    if (data === chats[chatId]) {
      return bot.sendMessage(
        chatId,
        `Поздравляю, ты отгадал цифру ${chats[chatId]}`,
        againOptions
      )
    } else {
      return bot.sendMessage(
        chatId,
        ` К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}`,
        againOptions
      )
    }
  })
}

start()
