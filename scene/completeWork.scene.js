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
const { handleBackBtn, updateWorkById, getCheckMark, isContainEmoji, checkAndUncheck } = require('../service/util');
const sendEmail = require('../mailer');

const chooseProblemWithHandler = new Composer();
chooseProblemWithHandler.action(Object.values(KEYBOARD_DATA.WHERE), (ctx) => {
    ctx.wizard.state.job = {
        where: ctx.callbackQuery.data,
        problemWith: null,
        cause: []
    };
    // console.log(emoji.find('❌'));

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
    const keyboardArr = keyboard.getCauseKeyboardArr(ctx.wizard.state.job.where, problemWith);

    ctx.session.causeKeyboardArr = keyboardArr;
    ctx.wizard.state.job.problemWith = problemWith;
    ctx.answerCbQuery();
    ctx.editMessageText(
        TEXT.KEYBOARD.CHOOSE_CAUSE,
        {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard(keyboardArr)
        }
    );

    return ctx.wizard.next();
});

const checkOrUncheckHandler = new Composer();
checkOrUncheckHandler.action([...Object.values(KEYBOARD_DATA.CAUSE),
...Object.values(EQUIMPMENT_CATEGORY), KEYBOARD_DATA.OTHER.CONTINUE_BTN], (ctx) => {
    const cbData = ctx.callbackQuery.data, cause = ctx.wizard.state.job.cause;

    ctx.wizard.state.job.photos = [];
    ctx.wizard.state.job.cause.push(cbData);
    
    if (cbData === KEYBOARD_DATA.OTHER.CONTINUE_BTN) {
        ctx.answerCbQuery();
        ctx.editMessageText(
            TEXT.KEYBOARD.ATTACH_PHOTO,
            keyboard.getBackKeyboard()
        );

        return ctx.wizard.next();
    }

    let keyboardArr = ctx.session.causeKeyboardArr;
    keyboardArr = keyboardArr.map((btnArr) => {
        const btn = btnArr[0];

        if (btn.callback_data === cbData && !isContainEmoji(btn.text)) {
            cause.push(cbData);
            return [{ ...btn, text: `${btn.text}  ${getCheckMark()}` }];
        }

        if (btn.callback_data === cbData && isContainEmoji(btn.text)) {
            ctx.wizard.state.job.cause = cause.filter(el => el != cbData);
            return [{ ...btn, text: `${emojiStrip(btn.text).trim()}` }];
        }

        return btnArr;
    });

    ctx.session.causeKeyboardArr = keyboardArr;
    ctx.answerCbQuery();
    ctx.editMessageText(
        TEXT.KEYBOARD.CHOOSE_CAUSE,
        {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard(keyboardArr)
        }
    );
});

const completeHandler = new Composer();
completeHandler.action(KEYBOARD_DATA.OTHER.COMPLETE, (ctx) => {
    ctx.wizard.state.job.cause.push(ctx.callbackQuery.data);
    ctx.wizard.state.job.photos = [];
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
    checkOrUncheckHandler,
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