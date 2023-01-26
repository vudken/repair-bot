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
        .select('designation.id', 'designation.name', 'pump.model')
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

// const mapAssemblyObjectTo

const saveAssemblyToDB = async (assemblyObj) => {
    const arr = Object.entries(assemblyObj);
    for (let i = 1; i < arr.length; i++) {
        const curr = arr[i];
        console.log(curr);
    }
};

// (async () => {
//     console.log(await getAllEmployees());
// })();

module.exports = { getAllEmployees, getAllControllers, getAllCounters, getAllPumps, getAllRegulators, getAllSensors, saveAssemblyToDB };