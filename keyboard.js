'use strict';

const { Markup } = require('telegraf');
const MATERIAL_CATEGORY = require('./constant/MaterialCategoryEnum');
const { TEXT } = require('./constant/TextEnum');
const conn = require('./db/conn');

const createKeyboard = (dataArr) => {
    let keyboard = [];
    dataArr.forEach(data => {
        keyboard.push([
            Markup.button.callback(data.btnTxt, data.cbStr)
        ]);
    });

    return {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard(keyboard)
    };
};

const getEmployeeKeyboard = async () => {
    let employees = await conn.getAllEmployees();
    employees = employees.map(employee => employee = {
        btnTxt: `${employee.name} ${employee.surname}`,
        cbStr: `employee_id_${employee.id}`
    });

    return createKeyboard(employees);
};

const getCategoryKeyboard = () => {
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

const getMaterialKeyboardByCategory = (givenObj) => {
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

module.exports = { getEmployeeKeyboard, getCategoryKeyboard, getMaterialKeyboardByCategory };