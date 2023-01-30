'use strict';

const { Markup } = require('telegraf');
const EQUIMPMENT_CATEGORY = require('./constant/EquipmentCategoryEnum');
const { TEXT } = require('./constant/TextEnum');
const conn = require('./db/conn');
const { getItemsFromAssemblyByCategory } = require('./util');

const createKeyboard = (dataArr) => {
    let keyboard = [];
    dataArr.forEach((data) => {
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
            [Markup.button.callback('Контроллер', EQUIMPMENT_CATEGORY.CONTROLLER)],
            [Markup.button.callback('Счётчик', EQUIMPMENT_CATEGORY.COUNTER)],
            [Markup.button.callback('Насос', EQUIMPMENT_CATEGORY.PUMP)],
            [Markup.button.callback('Регулятор', EQUIMPMENT_CATEGORY.REGULATOR)],
            [Markup.button.callback('Датчик', EQUIMPMENT_CATEGORY.SENSOR)],
            [Markup.button.callback('Записать материал на работника', 'saveToDB')],
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

module.exports = {
    getEmployeeKeyboard,
    getCategoryKeyboard,
    getEquipmentKeyboardByCategory: getEquipmentKeyboard
};