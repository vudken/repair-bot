'use strict';

const { Scenes: { WizardScene }, Composer } = require('telegraf');
const { handleBackBtn, getWorkDataById } = require('../service/util');
const SCENE_ID = require('../constant/SceneIdEnum');
const TEXT = require('../constant/TextEnum');
const keyboard = require('../keyboard');
const conn = require('../db/conn');

const optionsHandler = new Composer();
optionsHandler.action(/workId\d+/, async (ctx) => {
    const cbData = ctx.update.callback_query.data,
        works = ctx.session.works,
        id = cbData.match(/\d+/g).join(''),
        address = getWorkDataById(works, id, 'address'),
        description = getWorkDataById(works, id, 'description');

    ctx.wizard.state.work = {
        id: id,
        address: address,
        description: description,
        fixed: [{
            where: null,
            problemWith: null,
            cause: []
        }],
    };

    ctx.answerCbQuery();
    ctx.editMessageText(
        TEXT.KEYBOARD.CHOOSE_OPTION,
        keyboard.getAddressKeyboard(cbData)
    );

    ctx.wizard.next();
});

const descriptionHandler = new Composer();
descriptionHandler.action(/workId\d+/, async (ctx) => {
    ctx.editMessageText(
        `<b>Адрес:</b> ${ctx.wizard.state.work.address}\n\n<b>Доп инфо:</b> ${ctx.wizard.state.work.description}`,
        keyboard.getBackKeyboard(),
    );
    
    return ctx.wizard.next(ctx);
});

const scene = new WizardScene(
    SCENE_ID.CHOOSE_WORK_SCENE,
    optionsHandler,
    descriptionHandler,
);
scene.use(handleBackBtn());
scene.enter(async (ctx) => {
    const works = await conn.getAllWork();

    // const imagePaths = ['/path/to/image1.jpg', '/path/to/image2.jpg', '/path/to/image3.jpg'];
    // const jsonImagePaths = JSON.stringify(imagePaths);
    // console.log(jsonImagePaths)

    ctx.session.works = works;
    ctx.reply(
        TEXT.KEYBOARD.CHOOSE_ADDRESS,
        keyboard.getWorkKeyboard(works)
    );
});

module.exports = scene;