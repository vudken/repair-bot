'use strict';

require('dotenv').config();
const { Scenes: { WizardScene } } = require('telegraf');
const ТЕХТ = require('../constant/TextEnum');
const SCENE_ID = require('../constant/SceneIdEnum');
const keyboard = require('../keyboard');
const createAssemblyObject = require('../service/createAssemblyObject');
const conn = require('../db/conn');

const scene = new WizardScene(
    SCENE_ID.CHOOSE_EMPLOYEE_SCENE,
    async (ctx) => {
        let employees = await conn.getAllEmployees();

        ctx.reply(
            ТЕХТ.KEYBOARD.CHOOSE_EMPLOYEE,
            keyboard.getEmployeeKeyboard(employees)
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

module.exports = scene;