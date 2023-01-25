'use strict';

require('dotenv').config();

const ROLE = require('../constant/RoleEnum');
const user = require('../user');
const wizardSceneFactory = require('../scene/wizardFactory');

// const createEntryScene = wizardSceneFactory(
//     (ctx, done) => {
//         if (user.isBoss(ctx.message.chat.id)) ctx.role = ROLE.BOSS;
//         return done();
//     },
// );

const createEntryScene = wizardSceneFactory(
    (ctx, done) => {
        user.isBoss(ctx.message.chat.id)
            ? ctx.role = ROLE.BOSS
            : ctx.role = ROLE.EMPLOYEE;
        return done();
    },
);

module.exports = createEntryScene;