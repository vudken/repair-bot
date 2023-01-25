'use strict';

require('dotenv').config();

const { Telegraf, Markup, Scenes, log, session, Composer } = require('telegraf');
const logger = require('./logger');
const conn = require('./db/conn');
const keyboard = require('./keyboard');
const ROLE = require('./constant/RoleEnum');
const SCENE_ID = require('./constant/SceneIdEnum');
const oneBigScene = require('./scene/materialAssembly.scene');
// const createEntryScene = require('./scene/entry.scene');
// const createChooseEmployeeScene = require('./scene/chooseEmployee.scene');
// const createMaterialScene = require('./scene/material.scene');

const bot = new Telegraf(process.env.BOT_TOKEN);
const stage = new Scenes.Stage([oneBigScene]);
// const stage = new Scenes.Stage([
//     createEntryScene(SCENE_ID.ENTRY_SCENE, (ctx) => ctx.role === ROLE.BOSS ? SCENE_ID.CHOOSE_EMPLOYEE_SCENE : ctx.reply(`you're not a boss`)),
//     createChooseEmployeeScene(SCENE_ID.CHOOSE_EMPLOYEE_SCENE, () => SCENE_ID.MATERIAL_SCENE),
//     createChooseEmployeeScene(SCENE_ID.CHOOSE_EMPLOYEE_SCENE, async () => await ctx.reply('Finished')),
//     createMaterialScene(SCENE_ID.MATERIAL_SCENE, async (ctx) => await ctx.reply('Finished')),
// ]);

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