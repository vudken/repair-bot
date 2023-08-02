'use strict';

require('dotenv').config();

const { Scenes: { WizardScene } } = require('telegraf');
const SCENE_ID = require('../constant/SceneIdEnum');
const { isEmployeeExist } = require('../constant/EmployeeEnum');
// const ROLE = require('../constant/RoleEnum');
// const user = require('../model/user');

const scene = new WizardScene(
    SCENE_ID.ENTRY_SCENE,
    (ctx) => {
        /**
         * *  Left this code for the future implementation
         */
        // if (user.isBoss(ctx.message.chat.id)) {
        //     ctx.wizard.state.role = ROLE.BOSS;
        //     return ctx.scene.enter(SCENE_ID.CHOOSE_EMPLOYEE_SCENE, ctx.wizard.state);
        // } else {
        //     ctx.wizard.state.role = ROLE.EMPLOYEE;
        //     return ctx.scene.enter(SCENE_ID.CHOOSE_WORK_SCENE, ctx.wizard.state);
        // }
        // console.log(isEmployeeExist(ctx.message.chat.id));

        return ctx.scene.enter(SCENE_ID.CHOOSE_WORK_SCENE);
        
        return isEmployeeExist(ctx.message.chat.id)
            ? ctx.scene.enter(SCENE_ID.CHOOSE_WORK_SCENE)
            : ctx.reply('У вас нету права доступа к этому чату');
    },
);

module.exports = scene;