'use strict';

require('dotenv').config();
const { Telegraf,
    Scenes: { Stage },
    session,
} = require('telegraf');
const mediaGroup = require('telegraf-media-group');
const { logger } = require('./log/logger');
const keyboard = require('./keyboard');
const TEXT = require('./constant/TextEnum');
const SCENE_ID = require('./constant/SceneIdEnum');
const KEYBOARD_DATA = require('./constant/KeyboardDataEnum');
const entryWizard = require('./scene/entry.scene');
const chooseEmployeeWizard = require('./scene/chooseEmployee.scene');
const chooseWorkWizard = require('./scene/chooseWork.scene');
const equipmentAssemblyWizard = require('./scene/equipmentAssembly.scene');
const completeWorkWizard = require('./scene/completeWork.scene');
const sendWorkWizard = require('./scene/sendWork.scene');
const getPhotoPath = require('./service/getPhotoFromTg');

const stage = new Stage([entryWizard, chooseEmployeeWizard, chooseWorkWizard, completeWorkWizard, equipmentAssemblyWizard, sendWorkWizard]);
const bot = new Telegraf(process.env.BOT_TOKEN);

process.on('uncaughtException', (err) => {
    logger.error(err);
});

bot.use(session());
bot.use(stage.middleware());
bot.use(mediaGroup());
bot.telegram
    .callApi("getUpdates", { offset: -1 })
    .then((updates) => updates.length && updates[0].update_id + 1)
    .then((offset) => {
        if (offset) return bot.telegram.callApi("getUpdates", { offset });
    });
bot.start((ctx) => {
    // const hasActiveScene = !!ctx.session.scene;

    // if (hasActiveScene) {
    //     ctx.reply('Закончите, пожалуйста, предыдущее шаги в меню');
    // } else {
    ctx.scene.enter(SCENE_ID.CHOOSE_WORK_SCENE);
    // }
});
bot.on(['photo', 'media_group'], async (ctx) => {
    const mediaGroup = ctx.mediaGroup;

    if (ctx.wizard && ctx.wizard.state.job.cause.length > 0) {
        const msg = ctx.update.message, photos = ctx.wizard.state.job.photos;

        if (mediaGroup) {
            for (const msg of mediaGroup) {
                photos.push({ path: await getPhotoPath(msg.photo) });
            }
        } else {
            photos.push({ path: await getPhotoPath(msg.photo) });
        }

        return await ctx.reply(
            `<b>Адрес:</b> <i>${ctx.wizard.state.work.address}</i>\n\n<b>Кол-во добавленных фото:</b> ${photos.length}\n\n<b>Можете прикрепить ещё фото. Если все фото добавлены, можете завершить работу или добавить ещё место выполнения работы (например, чердак, подвал и т.п.)</b>`,
            keyboard.getConfirmationKeyboard()
        );
    } else {
        if (mediaGroup) {
            for (const msg of mediaGroup) {
                ctx.deleteMessage(msg.message_id);
            }
        } else {
            ctx.deleteMessage();
        }

        return ctx.reply(
            TEXT.INFO.PHOTO_WARNING,
            keyboard.getPhotoWarningKeyboard()
        );
    }
});
bot.on(['message', 'sticker', 'file', 'text'], (ctx) => {
    ctx.deleteMessage();
});
bot.hears(['id', 'Id'], (ctx) => {
    logger.info(`User's chat id is: ${ctx.message.chat.id}`);
});
bot.action(KEYBOARD_DATA.OTHER.UNDERSTAND, (ctx) => ctx.deleteMessage());
bot.action(/\w+_SCENE_ID/, (ctx) => {
    const state = ctx.wizard ? ctx.wizard.state : null;
    ctx.scene.leave();
    return ctx.scene.enter(ctx.update.callback_query.data, state);
});
bot.action(KEYBOARD_DATA.OTHER.CLOSE_MENU, (ctx) => {
    ctx.scene.leave();
    ctx.deleteMessage();
});

module.exports = bot;