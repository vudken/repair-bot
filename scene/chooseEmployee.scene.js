'use strict';

require('dotenv').config();
const { Scenes: { WizardScene } } = require('telegraf');
const { KEYBOARD_TEXT } = require('../constant/TextEnum');
const SCENE_ID = require('../constant/SceneIdEnum');
const logger = require('../logger');
const keyboard = require('../keyboard');
const createAssemblyObject = require('./createAssemblyObject');

const chooseEmployeeWizard = new WizardScene(
    SCENE_ID.CHOOSE_EMPLOYEE_SCENE,
    async (ctx) => {
        console.log(ctx.wizard.state)

        ctx.reply(
            KEYBOARD_TEXT.CHOOSE_EMPLOYEE,
            await keyboard.getEmployeeKeyboard()
        );

        return ctx.wizard.next();
    },
    async (ctx) => {
        logger.info('Creating assembly object');
        const assembly = await createAssemblyObject();
        ctx.wizard.state.assembly = assembly;
        return ctx.scene.enter(SCENE_ID.MATERIAL_SCENE, ctx.wizard.state);
    },
);

module.exports = chooseEmployeeWizard;