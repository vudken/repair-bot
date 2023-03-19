const db = require('./config');
const table = 'work';

const parseResFromDB = (res) => {
    return Object.values(JSON.parse(JSON.stringify(res)));
};

const getAllWork = async () => {
    const work = await db(table)
        .select('id', 'name', 'address', 'description', { 'isCompleted': 'is_completed' });
    return parseResFromDB(work);
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

const updateWork = async (id, update) => {
    await db(table)
        .where({ id: id })
        .update(update);
};

const saveAssemblyToDB = async (assembly) => {
    let insertQuery = [];
    let oneMoreIteration;
    let filteredEquipment = assembly.equipment
        .map(({ category, items }) => ({
            category,
            items: items.filter(item => item.quantity > 0)
        })).filter(obj => obj.items.length !== 0);

    do {
        let query = {};
        oneMoreIteration = false;
        filteredEquipment.forEach(obj => {
            const category = obj.category;
            const items = obj.items;
            const item = items.shift();

            query[`${category}_id`] = item.id;
            query[`${category}_quantity`] = item.quantity;

            if (items.length === 0) {
                filteredEquipment = filteredEquipment.filter(obj => obj.items.length !== 0);
            } else {
                oneMoreIteration = true;
            }
        });

        query = { employee_id: assembly.employeeId.split('_')[2], ...query };
        insertQuery.push(query);
    } while (oneMoreIteration);

    await db('material_on_employee')
        .insert(insertQuery);
};

module.exports = {
    getAllWork,
    getAllEmployees,
    getAllControllers,
    getAllCounters,
    getAllPumps,
    getAllRegulators,
    getAllSensors,
    saveAssemblyToDB,
    updateWork,
};