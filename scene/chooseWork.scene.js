'use strict';

const {
    Scenes: { WizardScene },
    Composer } = require('telegraf');
const SCENE_ID = require('../constant/SceneIdEnum');
const TEXT = require('../constant/TextEnum');
const keyboard = require('../keyboard');
const { handleBackBtn,
    enterSceneHandler,
    getWorkById } = require('../service/util');
const emoji = require('node-emoji');
const { fetchData } = require('../api/suiteCrm');

const regex = /\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/;

const optionsHandler = new Composer();
optionsHandler.action(regex, async (ctx) => {
    const works = ctx.session.works,
        id = ctx.update.callback_query.data,
        work = getWorkById(works, id);

    ctx.session.work = {
        id: id,
        address: work.address,
        description: work.description,
        material: work.material,
        places: [],
    };

    ctx.answerCbQuery();
    ctx.editMessageText(
        TEXT.KEYBOARD.CHOOSE_OPTION,
        keyboard.getAddressKeyboard(id)
    );

    return ctx.wizard.next();
});

const descriptionHandler = new Composer();
descriptionHandler.action(regex, async (ctx) => {
    ctx.answerCbQuery();
    ctx.editMessageText(
        `<b>Адрес:</b> <i>${ctx.session.work.address}</i>\n\n<b>Доп. инфо:</b> <i>${ctx.session.work.description}</i>\n\n<b>Материал:</b> <i>${ctx.session.work.material}</i>`,
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
    let works = await fetchData();
    // ctx.reply(`Res: ${works}`);

    works = works.filter(work => work.status !== 'Completed');

    ctx.session.works = works;

    works.length > 0
        ? enterSceneHandler(ctx,
            TEXT.KEYBOARD.CHOOSE_ADDRESS,
            keyboard.getWorkKeyboard(works)
        )
        : ctx.reply(`${emoji.get('🔥')} На данный момент все ремонтные работы выполнены!`);
});

module.exports = scene;