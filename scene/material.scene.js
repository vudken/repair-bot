'use strict';

const wizardSceneFactory = require('./wizardFactory');
const keyboard = require('../keyboard');
const { KEYBOARD_TEXT } = require('../constant/TextEnum');

const createMaterialScene = wizardSceneFactory(
    async (ctx, done) => {
        await ctx.editMessageText(
            KEYBOARD_TEXT.CHOOSE_MATERIAL,
            keyboard.getMaterialKeyboard()
        );
        // return done();
        return ctx.scene.leave();
    },
);

module.exports = createMaterialScene;