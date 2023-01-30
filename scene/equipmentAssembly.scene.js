'use strict';

require('dotenv').config();
const { Composer, Scenes: { WizardScene } } = require('telegraf');
const { KEYBOARD_TEXT, TEXT } = require('../constant/TextEnum');
const EQUIMPMENT_CATEGORY = require('../constant/EquipmentCategoryEnum');
const SCENE_ID = require('../constant/SceneIdEnum');
const keyboard = require('../keyboard');
const { isAssemblyEmpty, correctModelName, getItemsFromAssemblyByCategory, updateQuantity, updateModel} = require('../util');
const { saveAssemblyToDB } = require('../db/conn');

const editModelKeyboard = async (ctx) => {
    return ctx.editMessageText(
        KEYBOARD_TEXT.CHOOSE_MODEL_AND_QUANTITE,
        keyboard.getEquipmentKeyboardByCategory(
            ctx.wizard.state.assembly,
            ctx.wizard.state.category
        )
    );
};

const chooseCategoryHandler = new Composer();
chooseCategoryHandler.action(Object.values(EQUIMPMENT_CATEGORY), ctx => {
    ctx.wizard.state.category = ctx.update.callback_query.data;
    editModelKeyboard(ctx);
    return ctx.wizard.next();
});
chooseCategoryHandler.action('saveToDB', async (ctx) => {
    if (isAssemblyEmpty(ctx.wizard.state.assembly)) {
        ctx.answerCbQuery('Вы ничего не добавили в сборку материала', { show_alert: true });
        return;
    };
    await ctx.answerCbQuery('Материал успешно записан на сотрудника и добавлен в базу данных', { show_alert: true });
    await ctx.deleteMessage();
    await ctx.scene.leave();
    await saveAssemblyToDB(ctx.wizard.state.assembly);
});;

const chooseModelAndQuantiteHandler = new Composer();
chooseModelAndQuantiteHandler.action(/order:(.+):(.+)/, async (ctx) => {
    ctx.answerCbQuery();
    const [, modelName, action] = ctx.match;
    if (action === TEXT.INFO) return;

    const category = ctx.wizard.state.category;
    const assembly = ctx.wizard.state.assembly;
    const items = getItemsFromAssemblyByCategory(assembly, category);
    const correctedModelName = correctModelName(modelName);

    let quantity = items.find(i => i.model === modelName).quantity;
    if (action == TEXT.INCREMENT) quantity++;
    if (action == TEXT.DICREMENT && quantity > 0) quantity--;
    updateQuantity(items, modelName, quantity);

    if (quantity > 0) {
        updateModel(items, modelName, quantity);
        editModelKeyboard(ctx);
    }
    if (quantity == 0 && correctedModelName != modelName) {
        updateModel(items, modelName, quantity);
        editModelKeyboard(ctx);
    }
});
chooseModelAndQuantiteHandler.action('wizardBack', ctx => {
    ctx.scene.reenter();
});

const scene = new WizardScene(
    SCENE_ID.EQUIMPMENT_SCENE,
    chooseCategoryHandler,
    chooseModelAndQuantiteHandler,
);

scene.enter(async ctx => {
    return (ctx.update.callback_query) ?
        ctx.editMessageText(
            KEYBOARD_TEXT.CHOOSE_CATEGORY,
            keyboard.getCategoryKeyboard()
        )
        :
        ctx.reply(
            KEYBOARD_TEXT.CHOOSE_CATEGORY,
            keyboard.getCategoryKeyboard()
        );
});

module.exports = scene;