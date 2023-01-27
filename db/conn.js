const { correctModelName } = require('../util');
const db = require('./config');

const parseResFromDB = (res) => {
    return Object.values(JSON.parse(JSON.stringify(res)));
};

const getAllEmployees = async () => {
    const employees = await db('employee')
        .select('id', 'name', 'surname');
    return parseResFromDB(employees);
};

const getAllControllers = async () => {
    const controllers = await db
        .select('controller.id', 'designation.name', 'controller.model')
        .from('controller')
        .join('designation', 'designation_id', '=', 'designation.id');

    return parseResFromDB(controllers);
};

const getAllCounters = async () => {
    const counters = await db
        .select('counter.id', 'designation.name', 'counter.model')
        .from('counter')
        .join('designation', 'designation_id', '=', 'designation.id');

    return parseResFromDB(counters);
};

const getAllPumps = async () => {
    const pumps = await db
        .select('pump.id', 'designation.name', 'pump.model')
        .from('pump')
        .join('designation', 'designation_id', '=', 'designation.id');

    return parseResFromDB(pumps);
};

const getAllRegulators = async () => {
    const regulators = await db
        .select('regulator.id', 'designation.name', 'regulator.model')
        .from('regulator')
        .join('designation', 'designation_id', '=', 'designation.id');

    return parseResFromDB(regulators);
};

const getAllSensors = async () => {
    const sensors = await db
        .select('sensor.id', 'designation.name', 'sensor.model')
        .from('sensor')
        .join('designation', 'designation_id', '=', 'designation.id');

    return parseResFromDB(sensors);
};

const saveAssemblyToDB_ = async (assemblyObj) => {
    // console.log(assemblyObj);
    const assembly = Object.entries(assemblyObj);
    const insertQuery = [];
    let query = {
        employee_id: assembly[0][1].split('_')[2]
    };
    for (let i = 1; i < assembly.length; i++) {
        const current = assembly[i];
        const tableName = current[0];
        const units = Object.values(current[1]);
        const length = units.length;

        let j = 0;
        while (j != length) {
            const unit = units[j];

            if (unit.quantity > 0) {
                query[`${tableName}_id`] = `${unit.id}`;
                query[`${tableName}_quantity`] = `${unit.quantity}`;
            }

            if (j == length) {
                j = 0;
            }
        }
        j++;

        // units.forEach(unit => {
        //     if (j > 0) {
        //         let [`query_${j}`]
        //         query[`${tableName}_id`] = `${unit.id}`;
        //         query[`${tableName}_quantity`] = `${unit.quantity}`;
        //     }

        //     if (unit.quantity > 0) {
        //         query[`${tableName}_id`] = `${unit.id}`;
        //         query[`${tableName}_quantity`] = `${unit.quantity}`;
        //         j++;
        //     }
        // });
    }
    insertQuery.push(query);
    console.log(insertQuery);
    // await db('material_on_employee')
    //     .insert(insertQuery);

    // await db('material_on_employee')
    //     .insert([
    //         {
    //             employee_id: 1,
    //             controller_id: 2,
    //             controller_quantity: 222
    //         },
    //         // {
    //         //     employee_id: 1,
    //         //     controller_id: 3,
    //         //     controller_quantity: 77
    //         // }
    //     ]);
};

// IN DEVELOPMENT
/* const saveAssemblyToDB = async (assemblyObj) => {
    const insertQuery = [];
    let assembly = Object.entries(assemblyObj);
    let query = {
        employee_id: assembly[0][1].split('_')[2]
    };
    let units = [];

    let mappedAssembly = [];
    let j = 0;
    for (let i = 1; i < assembly.length; i++) {
        let category = assembly[i];
        const columnName = category[0];
        let units = Object.values(category[1]);

        units = units
            .filter(unit => unit.quantity > 0)
            .filter(unit => unit);

        if (units.length > 0) {
            units.unshift(columnName);
            mappedAssembly.push(units);
            //     query[`${columnName}_id`] = current.id;
            //     query[`${columnName}_quantity`] = current.quantity;
            //     j++;
        }
        // units.push(Object.values(category[1]));
        // console.log(units);
    }

    // console.log(mappedAssembly);
    // console.log(query);

    // units.map(unitArr => {
    //     unitArr = unitArr.filter(unit => unit.quantity > 0);
    // });

    // console.log(units);
    // units = units.filter(unit => unit.quantity > 0);
    // console.log(units);

    // assembly = assembly.map(category => {
    // console.log(Object.values(category));
    // console.log(category);
    // console.log(category);
    // category = category.map(cat => {
    // console.log(cat[1]);
    // console.log(Object.values(cat[1]));
    // .filter(model => model.quantity > 0);
    // });
    // });
    // console.log(assembly);
}; */

function createQueryObjectArr(assembly) {
    let arr = [];

}

// FOR TEST PURPOSES
// (async () => {
//     console.log(await getAllEmployees());
// })();

module.exports = {
    getAllEmployees,
    getAllControllers,
    getAllCounters,
    getAllPumps,
    getAllRegulators,
    getAllSensors,
    saveAssemblyToDB
};