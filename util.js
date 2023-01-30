'use strict';

const { TEXT } = require("./constant/TextEnum");
const { category } = require("./logger");

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
        throw new Error(TEXT.UNDEFINED);
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
        throw new Error(TEXT.UNDEFINED);
    }
};

module.exports = {
    isAssemblyEmpty,
    correctModelName,
    getItemsFromAssemblyByCategory,
    updateQuantity,
    updateModel,
};