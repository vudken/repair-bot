'use strict';

const { Composer } = require('telegraf');
const emoji = require('node-emoji');
const emojiStrip = require('emoji-strip');
const TEXT = require("../constant/TextEnum");
const KEYBOARD_DATA = require('../constant/KeyboardDataEnum');

const isAssemblyEmpty = (assembly) => {
    let isEmpty = true;
    assembly.equipment.forEach((element) => {
        element.items.forEach((item) => {
            if (item.quantity > 0) isEmpty = false;
        });
    });

    return isEmpty;
};

const correctModelName = (modelName) => {
    return modelName.replace(/\s|\(\d+\)/g, '');
};

const getItemsFromAssemblyByCategory = (assembly, category) => {
    return assembly.equipment.find((obj) => obj.category === category).items;
};

const updateQuantity = (items, model, quantity) => {
    const item = items.find((i) => i.model === model);
    if (item) {
        item.quantity = quantity;
    } else {
        throw new Error(TEXT.OTHER.UNDEFINED);
    }
};

const updateModel = (items, model, quantity) => {
    const item = items.find((i) => i.model === model);
    model = correctModelName(model);

    if (quantity === 0) {
        item.model = model;
        return;
    }

    if (item) {
        item.model = `${model} (${quantity})`;
    } else {
        throw new Error(TEXT.OTHER.UNDEFINED);
    }
};

const handleBackBtn = () => {
    return new Composer().action(KEYBOARD_DATA.OTHER.BACK_BTN, async (ctx) => {
        ctx.scene.reenter();
        ctx.deleteMessage();
    });
};

const getWorkById = (works, id) => {
    return works.find((work) => work.id === parseInt(id));
};

const getWorkDataById = (works, id, property) => {
    const work = getWorkById(works, id);
    return work ? work[property] : null;
};

const updateWorkById = (works, id, updatedWork) => {
    return works.map((work) => (work.id === id) ? updatedWork : work);
};

const getCheckMark = () => {
    return emoji.get('white_check_mark');
};

const isContainEmoji = (str) => {
    return (new RegExp('\\p{Emoji}', 'gu').test(str)) ? true : false;
};

const checkAndUncheck = (keyboardArr, cbData) => {
    return keyboardArr.map((btnArr) => {
        const btn = btnArr[0];

        if (btn.callback_data === cbData && !isContainEmoji(btn.text)) {
            [{ ...btn, text: `${btn.text}  ${getCheckMark()}` }];

        } else {
            [{ ...btn, text: `${emojiStrip(btn.text)}` }];
        }
    });
};

const enterSceneHandler = (ctx, txt, keyboard) => {
    return (ctx.update.callback_query && ctx.update.callback_query.data != KEYBOARD_DATA.OTHER.BACK_BTN)
        ? ctx.editMessageText(
            txt,
            keyboard
        )
        : ctx.reply(
            txt,
            keyboard
        );
};

module.exports = {
    isAssemblyEmpty,
    correctModelName,
    getItemsFromAssemblyByCategory,
    updateQuantity,
    updateModel,
    handleBackBtn,
    getWorkById,
    getWorkDataById,
    updateWorkById,
    getCheckMark,
    isContainEmoji,
    checkAndUncheck,
    enterSceneHandler
};