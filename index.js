const bot = require('./bot');
const user = require('./model/user');
const TEXT = require('./constant/TextEnum');
const { logToFile, logger } = require('./log/logger');

process.on('uncaughtException', async function (err) {
    logToFile.error(err);

    await bot.telegram.sendMessage(
        user[0].chatId,
        `Произошла ошибка в программе:\n
                ${err}`
    );

    bot.stop(logger.error(TEXT.BOT.STOP));
    setTimeout(async () => {
        await bot.launch(logger.debug(TEXT.BOT.RELAUNCH));
    }, 2000);
});

bot.launch(logger.debug(TEXT.BOT.START));