'use strict';

require('dotenv').config();

const { Telegraf, Markup, Scenes, log, session, Composer } = require('telegraf');
const logger = require('./logger');
const conn = require('./db/conn');
const keyboard = require('./keyboard');
const ROLE = require('./constant/RoleEnum');
const SCENE_ID = require('./scene/SceneIdEnum');
const createEntryScene = require('./scene/entry.scene');
const createChooseEmployeeScene = require('./scene/chooseEmployee.scene');
const createMaterialScene = require('./scene/material.scene');
const oneBigScene = require('./scene/materialAssembly.scene');

const bot = new Telegraf(process.env.BOT_TOKEN);
const stage = new Scenes.Stage([
    // createEntryScene(SCENE_ID.ENTRY_SCENE, (ctx) => ctx.role === ROLE.BOSS ? SCENE_ID.CHOOSE_EMPLOYEE_SCENE : ctx.reply(`you're not a boss`)),
    // createChooseEmployeeScene(SCENE_ID.CHOOSE_EMPLOYEE_SCENE, () => SCENE_ID.MATERIAL_SCENE),
    // createChooseEmployeeScene(SCENE_ID.CHOOSE_EMPLOYEE_SCENE, async () => await ctx.reply('Finished')),
    // createMaterialScene(SCENE_ID.MATERIAL_SCENE, async (ctx) => await ctx.reply('Finished')),
    oneBigScene
]);



process.on('uncaughtException', (err) => {
    logger.error(err);
});

bot.use(session());
bot.use(stage.middleware());
bot.telegram
    .callApi("getUpdates", { offset: -1 })
    .then((updates) => updates.length && updates[0].update_id + 1)
    .then((offset) => {
        if (offset) return bot.telegram.callApi("getUpdates", { offset });
    });
bot.launch(console.log('Bot has been started'));
bot.start((ctx) => {
    ctx.scene.enter(SCENE_ID.ENTRY_SCENE);
});
bot.hears(['id', 'Id'], (ctx) => {
    logger.info(`User's chat id is: ${ctx.message.chat.id}`);
});










// const user = require('./user');

// const { isBoss } = require('./user');
// const SCENE_ID = require('./constant/SCENE_ID');
// // const Stage = require('telegraf-better-stage');
// const materialWizard = new Scenes.WizardScene(
//     SCENE_ID.MATERIAL,
//     async (ctx) => {
//         console.log('Scene is worked');
//         await ctx.editMessageText(
//             'Выберите материал',
//             keyboard.getMaterialKeyboard()
//         );
//         return ctx.wizard.next();
//     },
//     (ctx) => {

//     },
//     async (ctx) => {

//     },
// );

// // const stage = new Stage([materialWizard]);
// const stage = new Scenes.Stage([materialWizard]);

// bot.use(session());
// bot.use(Telegraf.log());
// bot.use(stage.middleware());

// bot.launch();

// // bot.start((ctx) => {
// //     ctx.scene.enter(SCENE_ID.MATERIAL);
// // });

// process.on('uncaughtException', function (err) {
//     console.log(err);
// });

// bot.hears(['id', 'ID', 'Id'], (ctx) => {
//     logger.info(`USER ID: ${ctx.chat.id}`);
// });

// bot.start(async (ctx) => {
//     const id = ctx.chat.id;
//     if (user.isValid(ctx.chat.id)) {
//         user.isBoss(id)
//             ? await ctx.reply('Чтобы назначить работу, выберите сотрудников:', keyboard.getEmployeeKeyboard())
//             : await ctx.reply('Чтобы получить доп. информацию по заданию, выберите адрес:');
//     } else {
//         ctx.reply('У вас нету права доступа к этому чату.');
//     }
// });


// // bot.action(['user1', 'user2', 'user3'], async (ctx) => {
// //     await ctx.editMessageText(
// //         'Выберите материал',
// //         keyboard.getMaterialKeyboard()
// //     );
// // });

// bot.action(['user1', 'user2', 'user3'], async (ctx) => {
//     // console.log(ctx.scene);
//     await ctx.scene.enter(SCENE_ID.MATERIAL);
// });

// bot.action(['user1', 'user2', 'user3'], Stage.enter(materialWizard));

// bot.action('add', async (ctx) => {
//     // await ctx.editMessageText(
//     //     'Выберите модель и кол-во:',
//     //     // console.log(await conn.getAllControllers())
//     //     keyboard.getKeyboardFromGivenData(await conn.getAllControllers())
//     // );
//     console.log(ctx.data);
// });

// // bot.action('controller', async (ctx) => {
// //     const data = await conn.getAllControllers();
// //     await ctx.editMessageText(
// //         'Выберите модель и кол-во:',
// //         // console.log(await conn.getAllControllers())
// //         keyboard.getKeyboardFromGivenData(data)
// //     );

// //     ctx.data = data;
// // });

// // bot.action('counter', async (ctx) => {
// //     await ctx.editMessageText(
// //         'Выберите модель и кол-во:',
// //         conn.getAllCounters()
// //     );
// // });


// // bot.on(() => {
// //     console.log('REACTED');
// // });
