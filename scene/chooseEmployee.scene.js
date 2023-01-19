'use strict';

const wizardSceneFactory = require('./wizardFactory');
const keyboard = require('../keyboard');
const { KEYBOARD_TEXT } = require('../constant/TextEnum');

const createChooseEmployeeScene = wizardSceneFactory(
    async (ctx, done) => {
        await ctx.reply(
            KEYBOARD_TEXT.CHOOSE_EMPLOYEE,
            keyboard.getEmployeeKeyboard()
        );
        console.log(ctx.wizard);
        ctx.wizard.data = 'test';
        return done();
    },
);

// createChooseEmployeeScene.action(THEATER_ACTION, (ctx) => {
//     ctx.reply('You choose theater');
//     ctx.session.myData.preferenceType = 'Theater';
//     return ctx.scene.enter('SOME_OTHER_SCENE_ID'); // switch to some other scene
// });

module.exports = createChooseEmployeeScene;