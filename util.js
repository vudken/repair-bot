'use strict';

const isAssemblyObjectEmpty = (assemblyObj) => {
    let isEmpty = true;
    Object.entries(assemblyObj).forEach(arr => {
        Object.values(arr[1]).forEach(unit => {
            if (unit.quantity > 0) isEmpty = false;
        });
    });

    return isEmpty;
};

const correctModelName = (modelName) => {
    return modelName.replace(/\s|\(\d+\)/g, '');
};

module.exports = { isAssemblyObjectEmpty, correctModelName };