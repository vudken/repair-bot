'use strict';

require('dotenv').config();
const { Scenes: { WizardScene } } = require('telegraf');
const { KEYBOARD_TEXT } = require('../constant/TextEnum');
const SCENE_ID = require('../constant/SceneIdEnum');
const keyboard = require('../keyboard');

const editModelKeyboard = (ctx) => {
    return ctx.editMessageText(
        KEYBOARD_TEXT.CHOOSE_MODEL_AND_QUANTITE,
        keyboard.getMaterialKeyboardByCategory(ctx.wizard.state.assembly[`${ctx.wizard.state.category}`])
    );
};

const materialAssemblyWizard = new WizardScene(
    SCENE_ID.MATERIAL_SCENE,
    (ctx) => {
        ctx.editMessageText(
            KEYBOARD_TEXT.CHOOSE_CATEGORY,
            keyboard.getCategoryKeyboard()
        );

        return ctx.wizard.next();
    },
    (ctx) => {
        ctx.wizard.state.category = ctx.update.callback_query.data;
        editModelKeyboard(ctx);
        return ctx.wizard.next();
    },
    (ctx) => {
        console.log(ctx.update.callback_query.data);
    },
);

materialAssemblyWizard.action(/order:([^]+):([^]+)/, async (ctx) => {
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
    ctx.wizard.back();  // Set the listener to the previous function
    return ctx.wizard.steps[ctx.wizard.cursor](ctx); // Manually trigger the listener with the current ctx
}).action('saveToDB', async (ctx) => {
    ctx.answerCbQuery('Материал успешно записан на работникa и сохранён в базу данных', { show_alert: true });
    await ctx.scene.leave();
    await saveAssemblyToDB(ctx.wizard.state.assembly);
});

module.exports = materialAssemblyWizard;