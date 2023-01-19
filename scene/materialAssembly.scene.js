'use strict';

require('dotenv').config();

const ROLE = require('../constant/RoleEnum');
const user = require('../user');
const { KEYBOARD_TEXT, TEXT } = require('../constant/TextEnum');
const keyboard = require('../keyboard');
const { Scenes } = require('telegraf');
const SCENE_ID = require('./SceneIdEnum');
const createAssemblyObject = require('./createAssemblyObject');

const editModelKeyboard = (ctx) => {
    return ctx.editMessageText(
        KEYBOARD_TEXT.CHOOSE_MODEL_AND_QUANTITE,
        keyboard.getKeyboardFromGivenData(ctx.wizard.state.assembly[`${ctx.wizard.state.category}`])
    );
};

const materialAssemblyScene = new Scenes.WizardScene(
    SCENE_ID.ENTRY_SCENE, // first argument is Scene_ID, same as for BaseScene
    async (ctx) => {
        (user.isBoss(ctx.message.chat.id)) ? ctx.role = ROLE.BOSS : ctx.role = ROLE.EMPLOYEE;
        if (ctx.role === ROLE.BOSS) {
            let assembly = await createAssemblyObject();
            ctx.wizard.state.assembly = assembly;
            ctx.reply(
                KEYBOARD_TEXT.CHOOSE_EMPLOYEE,
                keyboard.getEmployeeKeyboard()
            );
        } else {
            ctx.reply('You are not a boss');
        }
        return ctx.wizard.next();
    },
    (ctx) => {
        let assembly = ctx.wizard.state.assembly;
        assembly = Object.assign({
            'userId': ctx.update.callback_query.data
        }, assembly);

        ctx.editMessageText(
            KEYBOARD_TEXT.CHOOSE_CATEGORY,
            keyboard.getMaterialKeyboard()
        );

        return ctx.wizard.next();
    },
    (ctx) => {
        ctx.answerCbQuery();
        ctx.wizard.state.category = ctx.update.callback_query.data;
        editModelKeyboard(ctx);
    }
).action(/order:([^]+):([^]+)/, async (ctx) => {
    ctx.answerCbQuery();
    const action = ctx.match[2];
    if (action == TEXT.INFO) return;

    const modelName = ctx.match[1];
    const category = ctx.wizard.state.category;
    const assembly = ctx.wizard.state.assembly[category];
    const correctedModelName = modelName.replace(/\s|\(\d+\)/g, '');

    let quantity = assembly[modelName].quantity;

    if (action == TEXT.INCREMENT) quantity++;
    if (action == TEXT.DICREMENT && quantity > 0) quantity--;
    assembly[modelName].quantity = quantity;

    if (quantity > 0) {
        assembly[`${correctedModelName} (${quantity})`] = assembly[modelName];
        delete assembly[modelName];
        editModelKeyboard(ctx);
    }
    if (quantity == 0 && correctedModelName != modelName) {
        assembly[correctedModelName] = assembly[modelName];
        delete assembly[modelName];
        editModelKeyboard(ctx);
    }
}).action('wizardBack', (ctx) => {
    ctx.answerCbQuery();
    ctx.wizard.back();  // Set the listener to the previous function
    return ctx.wizard.steps[ctx.wizard.cursor](ctx); // Manually trigger the listener with the current ctx
}).action('saveToDB', async (ctx) => {
    ctx.answerCbQuery('Материал успешно записан на работникa и сохранён в базу данных', { show_alert: true });
    await ctx.scene.leave();
    ctx.session.isSceneRunning = false;
});

module.exports = materialAssemblyScene;;