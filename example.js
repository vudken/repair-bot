const {
  Telegraf,
  Markup,
  Scenes,
  session
} = require("telegraf");
require('dotenv').config();
 

 
const getInvoice = (id) => {
  const invoice = {
    chat_id: id,
    provider_token: process.env.PROVIDER_TOKEN,
    start_parameter: 'get_access',
    title: 'lala',
    description: 'Оплата за участие в игре',
    currency: 'RUB',
    prices: [{
      label: 'Оплата за участие в игре',
      amount: 100 * 120
    }],
    payload: {
      unique_id: `${id}_${Number(new Date())}`,
      provider_token: process.env.PROVIDER_TOKEN
    }
  }
  return invoice
}
 
 
const bowlingGame = new Scenes.BaseScene('bowling_game');
 
bowlingGame.enter(async(ctx) => {
  ctx.session.bowlingGame = {};
  ctx.session.bowlingGame.score = 6;
  await ctx.replyWithInvoice(getInvoiceBowling(ctx.from.id));
});
 
bowlingGame.on('forward_from', async(ctx) => {
  await ctx.reply(`Ты пытался меня обмануть, за это я забираю твои деньги и прекращаю игру. Нажми \/start если исправился и хочешь сыграть снова.`);
  await ctx.scene.leave();
});
 
bowlingGame.on('successful_payment', async (ctx) => {
  ctx.session.bowlingGame.power = true;
  ctx.session.bowlingGame.balance = 12000;
  await ctx.reply(`Теперь брось мне 🎲`);
});
 
bowlingGame.on('dice', async(ctx) => {
  if (ctx.session.bowlingGame.score <= 0) {
    await bot.telegram.sendMessage('-1001620890074', `Игра в кости завершилась таким результатом\n ${ctx.message.from.id} ${ctx.message.from.first_name} ${ctx.session.bowlingGame.balance}`);
    await ctx.reply(`Увы, ты кинул кости 6 раз - игра завершена\n\/money - для выплаты выигрыша или остатка \n\/start - для новой игры`);
    await ctx.scene.leave();
  } else if (ctx.message.dice.emoji === '🎲' && ctx.message.dice.value != '6' && ctx.session.bowlingGame.power === true) {
    ctx.session.bowlingGame.score = ctx.session.bowlingGame.score - 1;
    ctx.session.bowlingGame.balance = ctx.session.bowlingGame.balance - 2000;
    await ctx.reply(`Увы, ты проиграл. Твой баланс - ${ctx.session.bowlingGame.balance} сум.`)
  } else if (ctx.message.dice.emoji === '🎲' && ctx.message.dice.value == '6' && ctx.session.bowlingGame.power === true) {
    ctx.session.bowlingGame.score = ctx.session.bowlingGame.score - 1;
    ctx.session.bowlingGame.balance = ctx.session.bowlingGame.balance + 6000;
    await ctx.reply(`Молодец, ты выиграл! Твой баланс - ${ctx.session.bowlingGame.balance} сум. Попробуй выиграть больше`)
  } else if (ctx.session.bowlingGame.power === false) {
    return ctx.reply(`Сначала пополни баланс, а потом кидай 🎲`);
  } else {
    return ctx.reply(`Мы играем в кости или в "а давай я кину тебе какое-нибудь говно"?\nКидай 🎲`);
  }
});

const bot = new Telegraf(process.env.BOT_TOKEN);

const stage = new Scenes.Stage([bowlingGame]);
 
bot.use(Telegraf.log());
bot.use(session());
bot.use(stage.middleware());
 
bot.command('start', async (ctx) => {
  return ctx.replyWithHTML('<b>Привет, это тестовый бот, в нём я просто показываю поверхностные возможности моих телеграм-ботов\n\nВвведите команду /game для симуляции игры в кости или дартс</b>')
});
 
bot.command('game', async (ctx) => {
  return ctx.reply('Ну что же, выбирай игру', Markup.inlineKeyboard([
    Markup.button.callback('🎳 Боулинг', 'bowling_action')
  ]))
});
 
 
bot.action('bowling_action', async (ctx) => {
  return ctx.scene.enter('bowling_game')
});

bot.on('pre_checkout_query', async (ctx) => {
  return ctx.answerPreCheckoutQuery(true)
});
 
// запуск бота через webhook
 
bot.launch();
 
// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))

process.once('SIGTERM', () => bot.stop('SIGTERM'))
