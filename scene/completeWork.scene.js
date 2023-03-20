'use strict';

require('dotenv').config();

const { Scenes: { WizardScene },
    Composer } = require('telegraf');
const { Markup } = require('telegraf');
const emoji = require('node-emoji');
const EQUIMPMENT_CATEGORY = require('../constant/EquipmentCategoryEnum');
const KEYBOARD_DATA = require('../constant/KeyboardDataEnum');
const SCENE_ID = require('../constant/SceneIdEnum');
const TEXT = require('../constant/TextEnum');
const keyboard = require('../keyboard');
const emojiStrip = require('emoji-strip');
const { handleBackBtn,
    isContainsEmoji,
    enterSceneHandler } = require('../service/util');

const chooseProblemWithHandler = new Composer();
chooseProblemWithHandler.action(Object.values(KEYBOARD_DATA.WHERE), (ctx) => {
    ctx.wizard.state.place = {
        where: ctx.callbackQuery.data,
        problemWith: null,
        cause: []
    };

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
    const keyboardArr = keyboard.getCauseKeyboardArr(ctx.wizard.state.place.where, problemWith);

    ctx.session.causeKeyboardArr = keyboardArr;
    ctx.wizard.state.place.problemWith = problemWith;
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
    const cbData = ctx.callbackQuery.data, cause = ctx.wizard.state.place.cause;

    ctx.wizard.state.place.photos = [];

    if (cbData === KEYBOARD_DATA.OTHER.CONTINUE_BTN && cause.length === 0) {
        return ctx.answerCbQuery(TEXT.INFO.CAUSE_WARNING, { show_alert: true });
    }

    if (cbData === KEYBOARD_DATA.OTHER.CONTINUE_BTN && cause.length > 0) {
        ctx.session.work.places.push(ctx.wizard.state.place);
        ctx.scene.leave();
        return ctx.scene.enter(SCENE_ID.SEND_WORK_SCENE, ctx.wizard.state);
    }

    let keyboardArr = ctx.session.causeKeyboardArr;
    keyboardArr = keyboardArr.map((btnArr) => {
        const btn = btnArr[0];

        if (btn.callback_data === cbData && !isContainsEmoji(btn.text)) {
            cause.push(cbData);
            return [{ ...btn, text: `${btn.text}  ${emoji.get('white_check_mark')}` }];
        }

        if (btn.callback_data === cbData && isContainsEmoji(btn.text)) {
            ctx.wizard.state.place.cause = cause.filter(el => el != cbData);
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

const scene = new WizardScene(
    SCENE_ID.COMPLETE_WORK_SCENE,
    chooseProblemWithHandler,
    chooseCauseHandler,
    checkOrUncheckHandler,
);
scene.use(handleBackBtn());
scene.enter((ctx) => {
    ctx.session.works = [];
    enterSceneHandler(ctx,
        TEXT.KEYBOARD.CHOOSE_WHERE,
        keyboard.getWhereKeyboard()
    );
});

module.exports = scene;