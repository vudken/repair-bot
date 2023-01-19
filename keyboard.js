const { Markup } = require('telegraf');
const MATERIAL_CATEGORY = require('./constant/MaterialCategoryEnum');
const { TEXT } = require('./constant/TextEnum');

const getEmployeeKeyboard = () => {
    return {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard([
            [Markup.button.callback('Тролли', 'user_id_1')],
            [Markup.button.callback('Алкаши', 'user_id_2')],
            [Markup.button.callback('Кирилл и Мифодий', 'user_id_3')],
        ])
    };
};

const getMaterialKeyboard = () => {
    return {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard([
            [Markup.button.callback('Контроллер', MATERIAL_CATEGORY.CONTROLLER)],
            [Markup.button.callback('Счётчик', MATERIAL_CATEGORY.COUNTER)],
            [Markup.button.callback('Насос', MATERIAL_CATEGORY.PUMP)],
            [Markup.button.callback('Регулятор', MATERIAL_CATEGORY.REGULATOR)],
            [Markup.button.callback('Датчик', MATERIAL_CATEGORY.SENSOR)],
            [Markup.button.callback('Записать материал на работника', 'saveToDB')],
        ])
    };
};

const getKeyboardFromGivenObj = (givenObj) => {
    const models = Object.keys(givenObj);
    const keyboard = [];

    models.sort();
    models.forEach(model => {
        keyboard.push([
            Markup.button.callback('-', `order:${model}:${TEXT.DICREMENT}`),
            Markup.button.callback(`${model}`, `order:${model}:${TEXT.INFO}`),
            Markup.button.callback('+', `order:${model}:${TEXT.INCREMENT}`),
        ]);
    });
    keyboard.push([
        Markup.button.callback('Назад', `wizardBack`)
    ]);

    return {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard(keyboard)
    };
};

module.exports = { getEmployeeKeyboard, getMaterialKeyboard, getKeyboardFromGivenData: getKeyboardFromGivenObj };