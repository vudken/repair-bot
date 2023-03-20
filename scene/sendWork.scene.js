'use strict';

require('dotenv').config();

const {
    Scenes: { WizardScene },
    Composer } = require('telegraf');
const KEYBOARD_DATA = require('../constant/KeyboardDataEnum');
const SCENE_ID = require('../constant/SceneIdEnum');
const TEXT = require('../constant/TextEnum');
const keyboard = require('../keyboard');
const conn = require('../db/conn');
const sendEmail = require('../mailer');
const { enterSceneHandler } = require('../service/util');
const { logger } = require('../log/logger');

const updateHandler = new Composer();
updateHandler.action(KEYBOARD_DATA.OTHER.COMPLETE, async (ctx) => {
    try {
        const work = ctx.session.work;

        // conn.updateWork(work.id, {
        //     'photo': JSON.stringify(work.place.photos),
        //     'is_completed': true
        // });

        await sendEmail(work);

        ctx.answerCbQuery(TEXT.INFO.COMPLETE_MSG_ALERT, { show_alert: true });
        ctx.deleteMessage();

        return ctx.scene.leave();
    } catch (err) {
        logger.error(err);
        ctx.reply(TEXT.OTHER.ERROR);

        return ctx.scene.leave();
    }
});

const scene = new WizardScene(
    SCENE_ID.SEND_WORK_SCENE,
    updateHandler,
);
scene.enter((ctx) => {
    enterSceneHandler(ctx,
        TEXT.KEYBOARD.ATTACH_PHOTO,
        keyboard.getAttachmentKeyboard()
    );
});

module.exports = scene;