'use strict';

require('dotenv').config();

const env = process.env;
const user = {
    0: { name: 'Test user', chatId: parseInt(env.TEST_USER_ID) },
    1: { name: 'Boss', chatId: parseInt(env.BOSS_USER_ID) },

    isKeyValid: function (key) {
        return this.hasOwnProperty(key);
    },

    isValid: function (id) {
        return this.getAllChatIds().some(chatId => chatId === id);
    },

    isBoss: function (id) {
        return this[1].chatId == id;
    },

    getAllChatIds: function () {
        return Object.values(this)
            .filter(val => typeof val != "function")
            .map(val => val.chatId);
    },
};

module.exports = user;