'use strict';

require('dotenv').config();

const { Scenes: { WizardScene } } = require('telegraf');
const ROLE = require('../constant/RoleEnum');
const SCENE_ID = require('../constant/SceneIdEnum');
const user = require('../model/user');

const scene = new WizardScene(
    SCENE_ID.ENTRY_SCENE,
    (ctx) => {
        if (user.isBoss(ctx.message.chat.id)) {
            ctx.wizard.state.role = ROLE.BOSS;
            return ctx.scene.enter(SCENE_ID.CHOOSE_EMPLOYEE_SCENE, ctx.wizard.state);
        } else {
            ctx.wizard.state.role = ROLE.EMPLOYEE;
            return ctx.scene.enter(SCENE_ID.CHOOSE_WORK_SCENE, ctx.wizard.state);
        }
    },
);

module.exports = scene;