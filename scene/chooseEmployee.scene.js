'use strict';

const wizardSceneFactory = require('../scene/wizardFactory');
const keyboard = require('../keyboard');
const { KEYBOARD_TEXT, TEXT } = require('../constant/TextEnum');
const logger = require('../logger');
const createAssemblyObject = require('../scene/createAssemblyObject');


// const createChooseEmployeeScene = wizardSceneFactory(
//     async (ctx, done) => {
//         await ctx.reply(
//             KEYBOARD_TEXT.CHOOSE_EMPLOYEE,
//             keyboard.getEmployeeKeyboard()
//         );
//         console.log(ctx.wizard);
//         ctx.wizard.data = 'test';
//         return done();
//     },
// );

const createChooseEmployeeScene = wizardSceneFactory(
    async (ctx, done) => {
        ctx.reply(
            KEYBOARD_TEXT.CHOOSE_EMPLOYEE,
            await keyboard.getEmployeeKeyboard()
        );

        return ctx.wizard.next();
    },
    async (ctx, done) => {
        logger.info('Creating assembly object');
        const assembly = await createAssemblyObject();
        ctx.wizard.state.assembly = assembly;
        return done();
    },
);

module.exports = createChooseEmployeeScene;