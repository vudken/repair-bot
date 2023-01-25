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
        .select('designation.name', 'controller.model')
        .from('controller')
        .join('designation', 'designation_id', '=', 'designation.id');

    return parseResFromDB(controllers);
};

const getAllCounters = async () => {
    const counters = await db
        .select('designation.name', 'counter.model')
        .from('counter')
        .join('designation', 'designation_id', '=', 'designation.id');

    return parseResFromDB(counters);
};

const getAllPumps = async () => {
    const pumps = await db
        .select('designation.name', 'pump.model')
        .from('pump')
        .join('designation', 'designation_id', '=', 'designation.id');

    return parseResFromDB(pumps);
};

const getAllRegulators = async () => {
    const regulators = await db
        .select('designation.name', 'regulator.model')
        .from('regulator')
        .join('designation', 'designation_id', '=', 'designation.id');

    return parseResFromDB(regulators);
};

const getAllSensors = async () => {
    const sensors = await db
        .select('designation.name', 'sensor.model')
        .from('sensor')
        .join('designation', 'designation_id', '=', 'designation.id');

    return parseResFromDB(sensors);
};

// (async () => {
//     console.log(await getAllEmployees());
// })();

module.exports = { getAllEmployees, getAllControllers, getAllCounters, getAllPumps, getAllRegulators, getAllSensors };