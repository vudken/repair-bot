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
        keyboard.getKeyboardFromGivenData(ctx.scene.state.assembly[`${ctx.scene.state.category}`])
    );
};

const materialAssemblyScene = new Scenes.BaseScene(SCENE_ID.ENTRY_SCENE);

materialAssemblyScene.enter((ctx) => {
    (user.isBoss(ctx.message.chat.id)) ? ctx.role = ROLE.BOSS : ctx.role = ROLE.EMPLOYEE;
    if (ctx.role === ROLE.BOSS) {
        ctx.reply(
            KEYBOARD_TEXT.CHOOSE_EMPLOYEE,
            keyboard.getEmployeeKeyboard()
        );
    } else {
        ctx.reply('You are not a boss');
    }
    return ctx.wizard.next();
});

async (ctx) => {
    let assembly = await createAssemblyObject();
    assembly = Object.assign({
        'userId': ctx.update.callback_query.data
    }, assembly);

    ctx.scene.state.assembly = assembly;
    ctx.editMessageText(
        KEYBOARD_TEXT.CHOOSE_CATEGORY,
        keyboard.getMaterialKeyboard()
    );

    return ctx.wizard.next();
},
    (ctx) => {
        const category = ctx.update.callback_query.data;
        ctx.scene.state.category = category;
        editModelKeyboard(ctx);
        // return ctx.wizard.next();
        // return ctx.scene.leave();
    }
).action(/order:([^]+):([^]+)/, async (ctx) => {
        ctx.answerCbQuery();
        console.log(ctx.scene.state.assembly[ctx.scene.state.category]);

        const modelName = ctx.match[1],
            action = ctx.match[2],
            category = ctx.scene.state.category,
            assembly = ctx.scene.state.assembly[category],
            correctedModelName = modelName.replace(/\s|\(\d+\)/g, '');
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
    });

module.exports = materialAssemblyScene;