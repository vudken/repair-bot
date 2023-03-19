'use strict';

require('dotenv').config();
const { Scenes: { WizardScene }, Composer } = require('telegraf');
const { Markup } = require('telegraf');
const emoji = require('node-emoji');
const EQUIMPMENT_CATEGORY = require('../constant/EquipmentCategoryEnum');
const KEYBOARD_DATA = require('../constant/KeyboardDataEnum');
const SCENE_ID = require('../constant/SceneIdEnum');
const TEXT = require('../constant/TextEnum');
const keyboard = require('../keyboard');
const conn = require('../db/conn');
const emojiStrip = require('emoji-strip');
const { handleBackBtn, updateWorkById, getCheckMark, isContainsEmoji, checkAndUncheck } = require('../service/util');
const sendEmail = require('../mailer');
const { enterSceneHandler } = require('../service/util');

const updateHandler = new Composer();
updateHandler.action(KEYBOARD_DATA.OTHER.COMPLETE, (ctx) => {
    console.log(`COMPLETING ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^`);
    console.log(ctx.wizard.state.photos);
    // ctx.wizard.state.job.cause.push(ctx.callbackQuery.data);
    // ctx.wizard.state.job.photos = [];
    try {
        const job = ctx.wizard.state.job;

        ctx.

            works = updateWorkById(works, work.id, work);
        // conn.updateWorkIsCompleted(work.id, true);
        // sendEmail(ctx);

        ctx.answerCbQuery(
            TEXT.INFO.COMPLETE_MSG_ALERT,
            { show_alert: true }
        );
        ctx.deleteMessage();

        return ctx.scene.leave();
    } catch (error) {
        return ctx.reply(TEXT.OTHER.ERROR);
    }
});

const sendHandler = new Composer();
sendHandler.action(KEYBOARD_DATA.OTHER.COMPLETE, (ctx) => {
});

const scene = new WizardScene(
    SCENE_ID.SEND_WORK_SCENE,
    updateHandler,
    sendHandler
);
// scene.use(handleBackBtn());
scene.enter((ctx) => {


    enterSceneHandler(ctx,
        TEXT.KEYBOARD.ATTACH_PHOTO,
        keyboard.getAttachmentKeyboard()
    );
});

module.exports = scene;