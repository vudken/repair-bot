'use strict';

require('dotenv').config();
const { Scenes: { WizardScene }, Composer } = require('telegraf');
const EQUIMPMENT_CATEGORY = require('../constant/EquipmentCategoryEnum');
const KEYBOARD_DATA = require('../constant/KeyboardDataEnum');
const SCENE_ID = require('../constant/SceneIdEnum');
const TEXT = require('../constant/TextEnum');
const keyboard = require('../keyboard');
const conn = require('../db/conn');
const { handleBackBtn, updateWorkById } = require('../service/util');
const sendEmail = require('../mailer');
const emoji = require('node-emoji')

const chooseProblemWithHandler = new Composer();
chooseProblemWithHandler.action(Object.values(KEYBOARD_DATA.WHERE), (ctx) => {
    ctx.wizard.state.job = {
        where: ctx.callbackQuery.data,
        problemWith: null,
        cause: []
    };
    console.log(emoji.find('❌'));

    ctx.answerCbQuery();
    ctx.editMessageText(
        TEXT.KEYBOARD.CHOOSE_PROBLEM_WITH,
        keyboard.getProblemWithKeyboard()
    );

    return ctx.wizard.next();
});

const chooseCauseHandler = new Composer();
chooseCauseHandler.action(Object.values(KEYBOARD_DATA.PROBLEM_WITH), (ctx) => {
    const problemWith = ctx.callbackQuery.data;

    ctx.wizard.state.job.problemWith = problemWith;
    ctx.answerCbQuery();
    ctx.editMessageText(
        TEXT.KEYBOARD.CHOOSE_CAUSE,
        keyboard.getCauseKeyboard(ctx.wizard.state.job.where, problemWith)
    );

    return ctx.wizard.next();
});

const updateKeyboardHandler = new Composer();
updateKeyboardHandler.action([...Object.values(KEYBOARD_DATA.CAUSE), ...Object.values(EQUIMPMENT_CATEGORY)], (ctx) => {
    ctx.answerCbQuery();
    ctx.editMessageText(
        TEXT.KEYBOARD.CHOOSE_CAUSE,
        keyboard.getCauseKeyboard(ctx.wizard.state.job.where, problemWith, true, ctx.callbackQuery.data)
    );

    return ctx.wizard.next();
});

const attachPhotoHandler = new Composer();
attachPhotoHandler.action(KEYBOARD_DATA.OTHER.CONTINUE_BTN, (ctx) => {
    ctx.wizard.state.job.cause.push(ctx.callbackQuery.data);
    ctx.wizard.state.job.photos = [];
    ctx.answerCbQuery();
    ctx.editMessageText(
        TEXT.KEYBOARD.ATTACH_PHOTO,
        keyboard.getBackKeyboard()
    );

    return ctx.wizard.next();
});

const completeHandler = new Composer();
completeHandler.action(KEYBOARD_DATA.OTHER.COMPLETE, (ctx) => {
    console.log(ctx.wizard.state.job);
    try {
        const job = ctx.wizard.state.job;

        console.log(job);

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

const scene = new WizardScene(
    SCENE_ID.COMPLETE_WORK_SCENE,
    chooseProblemWithHandler,
    chooseCauseHandler,
    attachPhotoHandler,
    updateKeyboardHandler,
    completeHandler,
);
scene.enter((ctx) => {
    return ctx.reply(
        TEXT.KEYBOARD.CHOOSE_WHERE,
        keyboard.getWhereKeyboard()
    );
});
scene.use(handleBackBtn());
scene.action(SCENE_ID.CHOOSE_WORK_SCENE, (ctx) => {
    ctx.deleteMessage();
    return ctx.scene.enter(SCENE_ID.CHOOSE_WORK_SCENE, ctx.wizard.state);
});

module.exports = scene;