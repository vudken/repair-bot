'use strict';

const { Composer } = require('telegraf');
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

const isContainsEmoji = (str) => {
    return (new RegExp('\\p{Emoji}', 'gu').test(str)) ? true : false;
};

const getEmailText = (places) => {
    const title = `Это письмо сгенерировано автоматически в тестовом режиме и отправлено через телеграмм-бот\n\n`;

    let cause;
    let text;
    places.forEach(place => {
        text += `\nГде: ${getTxtByCbData(place.where)}\nЧто: ${getTxtByCbData(place.problemWith)}\nЗаменено: ${place.cause.length > 1 ? cause = place.cause.map(el => getTxtByCbData(el)).join(' и ') : getTxtByCbData(place.cause[0])}\n`;
    });

    return title + text;
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

const getTxtByCbData = (cbData) => {
    let txt;
    switch (cbData) {
        case KEYBOARD_DATA.PROBLEM_WITH.HOT_WATER:
            txt = TEXT.PROBLEM_WITH.HOT_WATER;
            break;
        case KEYBOARD_DATA.PROBLEM_WITH.HEATING:
            txt = TEXT.PROBLEM_WITH.HEATING;
            break;
        case KEYBOARD_DATA.WHERE.ATTIC:
            txt = TEXT.WHERE.ATTIC;
            break;
        case KEYBOARD_DATA.WHERE.BASEMENT:
            txt = TEXT.WHERE.BASEMENT;
            break;
        case KEYBOARD_DATA.WHERE.FLAT:
            txt = TEXT.WHERE.FLAT;
            break;
        case KEYBOARD_DATA.WHERE.HEATING_STATION:
            txt = TEXT.WHERE.STAIRCASE;
            break;
        case KEYBOARD_DATA.CAUSE.COUNTER:
            txt = TEXT.CAUSE.COUNTER;
            break;
        case KEYBOARD_DATA.CAUSE.EXPANSION_TANK:
            txt = TEXT.CAUSE.EXPANSION_TANK;
            break;
        case KEYBOARD_DATA.CAUSE.FILTER:
            txt = TEXT.CAUSE.FILTER;
            break;
        case KEYBOARD_DATA.CAUSE.PIPELINE:
            txt = TEXT.CAUSE.PIPELINE;
            break;
        case KEYBOARD_DATA.CAUSE.RADIATOR:
            txt = TEXT.CAUSE.RADIATOR;
            break;
        case KEYBOARD_DATA.CAUSE.RISER:
            txt = TEXT.CAUSE.RISER;
            break;
        case KEYBOARD_DATA.CAUSE.TANK:
            txt = TEXT.CAUSE.TANK;
            break;
        case KEYBOARD_DATA.CAUSE.TOWEL_RAIL:
            txt = TEXT.CAUSE.TOWEL_RAIL;
            break;
        case KEYBOARD_DATA.CAUSE.VALVE:
            txt = TEXT.CAUSE.VALVE;
            break;
        case KEYBOARD_DATA.CAUSE.VENTIL:
            txt = TEXT.CAUSE.VENTIL;
            break;
    }

    return txt;
};

module.exports = {
    isAssemblyEmpty,
    correctModelName,
    getItemsFromAssemblyByCategory,
    updateQuantity,
    updateModel,
    handleBackBtn,
    getWorkDataById,
    isContainsEmoji,
    getEmailText,
    enterSceneHandler,
    getTxtByCbData
};