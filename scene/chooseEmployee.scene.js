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
        ctx.reply(
            KEYBOARD_TEXT.CHOOSE_EMPLOYEE,
            await keyboard.getEmployeeKeyboard()
        );

        return ctx.wizard.next();
    },
    async (ctx) => {
        let assembly = await createAssemblyObject();
        assembly.employeeId = ctx.update.callback_query.data;
        ctx.wizard.state.assembly = assembly;
        return ctx.scene.enter(SCENE_ID.EQUIMPMENT_SCENE, ctx.wizard.state);
    },
);

module.exports = chooseEmployeeWizard;