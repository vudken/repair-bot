'use strict';

const {
    Scenes: { WizardScene },
    Composer } = require('telegraf');
const SCENE_ID = require('../constant/SceneIdEnum');
const TEXT = require('../constant/TextEnum');
const keyboard = require('../keyboard');
const conn = require('../db/conn');
const { handleBackBtn,
    getWorkDataById,
    enterSceneHandler } = require('../service/util');
const emoji = require('node-emoji');

const optionsHandler = new Composer();
optionsHandler.action(/workId\d+/, async (ctx) => {
    const cbData = ctx.update.callback_query.data,
        works = ctx.session.works,
        id = cbData.match(/\d+/g).join(''),
        address = getWorkDataById(works, id, 'address'),
        description = getWorkDataById(works, id, 'description');

    ctx.session.work = {
        id: id,
        address: address,
        description: description,
        places: [],
    };

    ctx.answerCbQuery();
    ctx.editMessageText(
        TEXT.KEYBOARD.CHOOSE_OPTION,
        keyboard.getAddressKeyboard(cbData)
    );

    return ctx.wizard.next();
});

const descriptionHandler = new Composer();
descriptionHandler.action(/workId\d+/, async (ctx) => {
    ctx.answerCbQuery();
    ctx.editMessageText(
        `<b>Адрес:</b> <i>${ctx.session.work.address}</i>\n\n<b>Доп. инфо:</b> <i>${ctx.session.work.description}</i>`,
        keyboard.getBackKeyboard(),
    );

    return ctx.wizard.next();
});

const scene = new WizardScene(
    SCENE_ID.CHOOSE_WORK_SCENE,
    optionsHandler,
    descriptionHandler,
);
scene.use(handleBackBtn());
scene.enter(async (ctx) => {
    let works = await conn.getAllWork();
    works = works.filter(work => work.isCompleted === 0);

    ctx.session.works = works;

    works.length > 0
        ? enterSceneHandler(ctx,
            TEXT.KEYBOARD.CHOOSE_ADDRESS,
            keyboard.getWorkKeyboard(works)
        )
        : ctx.reply(`${emoji.get('🔥')} На данный момент все ремонтные работы выполнены!`);
});

module.exports = scene;