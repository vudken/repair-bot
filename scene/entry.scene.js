'use strict';

require('dotenv').config();
const { Scenes: { WizardScene } } = require('telegraf');
const ROLE = require('../constant/RoleEnum');
const SCENE_ID = require('../constant/SceneIdEnum');
const user = require('../user');

const entryWizard = new WizardScene(
    SCENE_ID.ENTRY_SCENE,
    (ctx) => {
        user.isBoss(ctx.message.chat.id)
            ? ctx.wizard.state.role = ROLE.BOSS
            : ctx.wizard.state.role = ROLE.EMPLOYEE;
        return ctx.scene.enter(SCENE_ID.CHOOSE_EMPLOYEE_SCENE, ctx.wizard.state);
    },
);

module.exports = entryWizard;