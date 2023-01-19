'use strict';

require('dotenv').config();

const ROLE = require('../constant/RoleEnum');
const user = require('../user');
const wizardSceneFactory = require('./wizardFactory');

const createEntryScene = wizardSceneFactory(
    (ctx, done) => {
        if (user.isBoss(ctx.message.chat.id)) ctx.role = ROLE.BOSS;
        return done();
    },
);

module.exports = createEntryScene;