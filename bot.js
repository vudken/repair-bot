'use strict';

require('dotenv').config();
const { Telegraf,
    Scenes: { Stage },
    session,
} = require('telegraf');
const logger = require('./logger');
const SCENE_ID = require('./constant/SceneIdEnum');
const entryWizard = require('./scene/entry.scene');
const chooseEmployeeWizard = require('./scene/chooseEmployee.scene');
const equipmentAssemblyWizard = require('./scene/equipmentAssembly.scene');

const stage = new Stage([entryWizard, chooseEmployeeWizard, equipmentAssemblyWizard]);
const bot = new Telegraf(process.env.BOT_TOKEN);

process.on('uncaughtException', (err) => {
    logger.error(err);
});

bot.use(session());
bot.use(stage.middleware());
bot.telegram
    .callApi("getUpdates", { offset: -1 })
    .then((updates) => updates.length && updates[0].update_id + 1)
    .then((offset) => {
        if (offset) return bot.telegram.callApi("getUpdates", { offset });
    });
bot.launch(logger.debug('Bot has been started'));
bot.hears(['id', 'Id'], (ctx) => {
    logger.info(`User's chat id is: ${ctx.message.chat.id}`);
});
bot.start((ctx) => {
    ctx.scene.enter(SCENE_ID.ENTRY_SCENE);
});