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

const chooseProblemWithHandler = new Composer();
chooseProblemWithHandler.action(Object.values(KEYBOARD_DATA.WHERE), (ctx) => {
    ctx.wizard.state.work.where = ctx.callbackQuery.data;
    ctx.answerCbQuery();
    ctx.editMessageText(
        TEXT.KEYBOARD.CHOOSE_PROBLEM_WITH,
        keyboard.getProblemWithKeyboard()
    );
    ctx.wizard.next();
});

const chooseCauseHandler = new Composer();
chooseCauseHandler.action(Object.values(KEYBOARD_DATA.PROBLEM_WITH), (ctx) => {
    ctx.wizard.state.work.problemWith = ctx.callbackQuery.data;
    ctx.answerCbQuery();
    ctx.editMessageText(
        TEXT.KEYBOARD.CHOOSE_CAUSE,
        keyboard.getCauseKeyboard(ctx.wizard.state.work.where, ctx.callbackQuery.data)
    );
    ctx.wizard.next();
});

const attachPhotoHandler = new Composer();
attachPhotoHandler.action([...Object.values(KEYBOARD_DATA.CAUSE), ...Object.values(EQUIMPMENT_CATEGORY)], (ctx) => {
    ctx.wizard.state.work.cause = ctx.callbackQuery.data;
    ctx.wizard.state.work.photos = [];
    ctx.answerCbQuery();
    ctx.editMessageText(
        TEXT.KEYBOARD.ATTACH_PHOTO,
        keyboard.getBackKeyboard()
    );
    ctx.wizard.next();
});

const completeHandler = new Composer();
completeHandler.action(KEYBOARD_DATA.OTHER.COMPLETE, (ctx) => {
    try {
        const work = ctx.wizard.state.work, works = ctx.session.works;

        console.log(work)
        
        works = updateWorkById(works, work.id, work);
        // conn.updateWorkIsCompleted(work.id, true);
        sendEmail(ctx);

        ctx.answerCbQuery(
            TEXT.INFO.COMPLETE_MSG_ALERT,
            { show_alert: true }
        );
        ctx.deleteMessage();
        ctx.scene.leave();
    } catch (error) {
        ctx.reply(TEXT.OTHER.ERROR);
    }
});

const scene = new WizardScene(
    SCENE_ID.COMPLETE_WORK_SCENE,
    chooseProblemWithHandler,
    chooseCauseHandler,
    attachPhotoHandler,
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