'use strict';

const { Markup } = require('telegraf');
const EQUIMPMENT_CATEGORY = require('./constant/EquipmentCategoryEnum');
const KEYBOARD_DATA = require('./constant/KeyboardDataEnum');
const SCENE_ID = require('./constant/SceneIdEnum');
const TEXT = require('./constant/TextEnum');
const { getItemsFromAssemblyByCategory  } = require('./service/util');

const createKeyboard = (dataArr) => {
    let keyboard = [];
    dataArr.forEach((data) => {
        keyboard.push([
            Markup.button.callback(data.btnTxt, data.cbData)
        ]);
    });

    keyboard.push([Markup.button.callback(TEXT.BTN.CLOSE_MENU, KEYBOARD_DATA.OTHER.CLOSE_MENU)]);

    return {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard(keyboard)
    };
};

const getEmployeeKeyboard = (employees) => {
    employees = employees.map(employee => employee = {
        btnTxt: `${employee.name} ${employee.surname}`,
        cbData: `employeeId${employee.id}`
    });

    return createKeyboard(employees);
};

const getWorkKeyboard = (work) => {
    work = work.filter(el => el.isCompleted === 0);
    work = work.map(el => el = {
        btnTxt: `${el.address}`,
        cbData: `workId${el.id}`
    });

    return createKeyboard(work);
};

const getAddressKeyboard = (cbData) => {
    return {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard([
            [Markup.button.callback(TEXT.BTN.GET_DESCRIPTION, cbData)],
            [Markup.button.callback(TEXT.BTN.COMPLETE_WORK, SCENE_ID.COMPLETE_WORK_SCENE)],
            [Markup.button.callback(TEXT.BTN.BACK_BTN, KEYBOARD_DATA.OTHER.BACK_BTN)],
        ])
    };
};

const getCategoryKeyboard = () => {
    return {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard([
            [Markup.button.callback(TEXT.EQUIMPMENT.CONTROLLER, EQUIMPMENT_CATEGORY.CONTROLLER)],
            [Markup.button.callback(TEXT.EQUIMPMENT.COUNTER, EQUIMPMENT_CATEGORY.COUNTER)],
            [Markup.button.callback(TEXT.EQUIMPMENT.PUMP, EQUIMPMENT_CATEGORY.PUMP)],
            [Markup.button.callback(TEXT.EQUIMPMENT.REGULATOR, EQUIMPMENT_CATEGORY.REGULATOR)],
            [Markup.button.callback(TEXT.EQUIMPMENT.SENSOR, EQUIMPMENT_CATEGORY.SENSOR)],
            [Markup.button.callback(TEXT.BTN.WRITE_ON_WORKER, KEYBOARD_DATA.OTHER.SAVE_TO_DB)],
        ])
    };
};

const getEquipmentKeyboard = (assembly, category) => {
    const items = getItemsFromAssemblyByCategory(assembly, category);
    const keyboard = [];

    items.sort();
    items.forEach((obj) => {
        const model = obj.model;
        keyboard.push([
            Markup.button.callback('-', `order:${model}:${TEXT.OTHER.DICREMENT}`),
            Markup.button.callback(`${model}`, `order:${model}:${TEXT.OTHER.INFO}`),
            Markup.button.callback('+', `order:${model}:${TEXT.OTHER.INCREMENT}`),
        ]);
    });
    keyboard.push([
        Markup.button.callback(TEXT.BTN.BACK_BTN, KEYBOARD_DATA.OTHER.BACK_BTN)
    ]);

    return {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard(keyboard)
    };
};

const getWhereKeyboard = (cbData) => {
    let keyboard = [
        [Markup.button.callback(TEXT.WHERE.ATTIC, KEYBOARD_DATA.WHERE.ATTIC)],
        [Markup.button.callback(TEXT.WHERE.STAIRCASE, KEYBOARD_DATA.WHERE.STAIRCASE)],
        [Markup.button.callback(TEXT.WHERE.FLAT, KEYBOARD_DATA.WHERE.FLAT)],
        [Markup.button.callback(TEXT.WHERE.BASEMENT, KEYBOARD_DATA.WHERE.BASEMENT)],
        [Markup.button.callback(TEXT.WHERE.HEATING_STATION, KEYBOARD_DATA.WHERE.HEATING_STATION)],
        [Markup.button.callback(TEXT.BTN.BACK_BTN, SCENE_ID.CHOOSE_WORK_SCENE)],
    ];

    return {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard(keyboard)
    };
};

const getProblemWithKeyboard = () => {
    return {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard([
            [Markup.button.callback(TEXT.PROBLEM_WITH.HOT_WATER, KEYBOARD_DATA.PROBLEM_WITH.HOT_WATER)],
            [Markup.button.callback(TEXT.PROBLEM_WITH.HEATING, KEYBOARD_DATA.PROBLEM_WITH.HEATING)],
            [Markup.button.callback(TEXT.BTN.BACK_BTN, KEYBOARD_DATA.OTHER.BACK_BTN)],
        ])
    };
};

const getCauseKeyboardArr = (where, problemWith) => {
    let keyboard = [];

    switch (where) {
        case KEYBOARD_DATA.WHERE.ATTIC:
            keyboard = [
                [Markup.button.callback(TEXT.CAUSE.PIPELINE, KEYBOARD_DATA.CAUSE.PIPELINE)],
                [Markup.button.callback(TEXT.CAUSE.TANK, KEYBOARD_DATA.CAUSE.TANK)],
                [Markup.button.callback(TEXT.CAUSE.VENTIL, KEYBOARD_DATA.CAUSE.VENTIL)],
            ];
            break;
        case KEYBOARD_DATA.WHERE.STAIRCASE:
            switch (problemWith) {
                case KEYBOARD_DATA.PROBLEM_WITH.HOT_WATER:
                    keyboard = [
                        [Markup.button.callback(TEXT.CAUSE.RISER, KEYBOARD_DATA.CAUSE.RISER)],
                    ];
                    break;
                case KEYBOARD_DATA.PROBLEM_WITH.HEATING:
                    keyboard = [
                        [Markup.button.callback(TEXT.CAUSE.RISER, KEYBOARD_DATA.CAUSE.RISER)],
                        [Markup.button.callback(TEXT.CAUSE.RADIATOR, KEYBOARD_DATA.CAUSE.RADIATOR)],
                    ];
                    break;
            }
            break;
        case KEYBOARD_DATA.WHERE.FLAT:
            switch (problemWith) {
                case KEYBOARD_DATA.PROBLEM_WITH.HOT_WATER:
                    keyboard = [
                        [Markup.button.callback(TEXT.CAUSE.RISER, KEYBOARD_DATA.CAUSE.RISER)],
                        [Markup.button.callback(TEXT.CAUSE.FILTER, KEYBOARD_DATA.CAUSE.FILTER)],
                        [Markup.button.callback(TEXT.CAUSE.TOWEL_RAIL, KEYBOARD_DATA.CAUSE.TOWEL_RAIL)],
                        [Markup.button.callback(TEXT.CAUSE.COUNTER, KEYBOARD_DATA.CAUSE.COUNTER)],
                        [Markup.button.callback(TEXT.CAUSE.VENTIL, KEYBOARD_DATA.CAUSE.VENTIL)],
                    ];
                    break;
                case KEYBOARD_DATA.PROBLEM_WITH.HEATING:
                    keyboard = [
                        [Markup.button.callback(TEXT.CAUSE.RISER, KEYBOARD_DATA.CAUSE.RISER)],
                        [Markup.button.callback(TEXT.CAUSE.TOWEL_RAIL, KEYBOARD_DATA.CAUSE.TOWEL_RAIL)],
                        [Markup.button.callback(TEXT.CAUSE.RADIATOR, KEYBOARD_DATA.CAUSE.RADIATOR)],
                    ];
                    break;
            }
            break;
        case KEYBOARD_DATA.WHERE.BASEMENT:
            keyboard = [
                [Markup.button.callback(TEXT.CAUSE.PIPELINE, KEYBOARD_DATA.CAUSE.PIPELINE)],
                [Markup.button.callback(TEXT.CAUSE.VENTIL, KEYBOARD_DATA.CAUSE.VENTIL)],
            ];
            break;
        case KEYBOARD_DATA.WHERE.HEATING_STATION:
            keyboard = [
                [Markup.button.callback(TEXT.CAUSE.PIPELINE, KEYBOARD_DATA.CAUSE.PIPELINE)],
                [Markup.button.callback(TEXT.CAUSE.VALVE, KEYBOARD_DATA.CAUSE.VALVE)],
                [Markup.button.callback(TEXT.EQUIMPMENT.CONTROLLER, EQUIMPMENT_CATEGORY.CONTROLLER)],
                [Markup.button.callback(TEXT.EQUIMPMENT.COUNTER, EQUIMPMENT_CATEGORY.COUNTER)],
                [Markup.button.callback(TEXT.EQUIMPMENT.PUMP, EQUIMPMENT_CATEGORY.PUMP)],
                [Markup.button.callback(TEXT.EQUIMPMENT.REGULATOR, EQUIMPMENT_CATEGORY.REGULATOR)],
                [Markup.button.callback(TEXT.EQUIMPMENT.SENSOR, EQUIMPMENT_CATEGORY.SENSOR)],
            ];
            break;
    }

    keyboard.push([Markup.button.callback(TEXT.BTN.CONTINUE, KEYBOARD_DATA.OTHER.CONTINUE_BTN)]);
    keyboard.push([Markup.button.callback(TEXT.BTN.BACK_BTN, KEYBOARD_DATA.OTHER.BACK_BTN)]);

    return keyboard;
};

const getBackKeyboard = () => {
    return {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard([[Markup.button.callback(TEXT.BTN.BACK_BTN, KEYBOARD_DATA.OTHER.BACK_BTN)]])
    };
};

const getAttachmentKeyboard = () => {
    return {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard([[Markup.button.callback(TEXT.BTN.BACK_BTN, SCENE_ID.COMPLETE_WORK_SCENE)]])
    };
};

const getConfirmationKeyboard = () => {
    return {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard([
            [Markup.button.callback(TEXT.BTN.ADD_ANOTHER_PLACE, SCENE_ID.COMPLETE_WORK_SCENE)],
            [Markup.button.callback(TEXT.BTN.COMPLETE, KEYBOARD_DATA.OTHER.COMPLETE)],
        ])
    };
};

const getPhotoWarningKeyboard = () => {
    return {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard([
            [Markup.button.callback(TEXT.BTN.UNDERSTAND, KEYBOARD_DATA.OTHER.UNDERSTAND)],
        ])
    };
};

module.exports = {
    getEmployeeKeyboard,
    getWorkKeyboard,
    getAddressKeyboard,
    getCategoryKeyboard,
    getEquipmentKeyboard,
    getWhereKeyboard,
    getProblemWithKeyboard,
    getCauseKeyboardArr,
    getAttachmentKeyboard,
    getConfirmationKeyboard,
    getBackKeyboard,
    getPhotoWarningKeyboard
};