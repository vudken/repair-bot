const MATERIAL_CATEGORY = require('./constant/MaterialCategoryEnum');
const conn = require('./db/conn');

class MaterialFactory {
    create = async (category) => {
        if (!category) return `Unable to get material. Please specify a category and tryagain!`;

        let material;
        switch (category) {
            case MATERIAL_CATEGORY.CONTROLLER:
                material = await conn.getAllControllers();
                break;
            case MATERIAL_CATEGORY.COUNTER:
                material = await conn.getAllCounters();
                break;
            case MATERIAL_CATEGORY.PUMP:
                material = await conn.getAllPumps();
                break;
            case MATERIAL_CATEGORY.REGULATOR:
                material = await conn.getAllRegulators();
                break;
            case MATERIAL_CATEGORY.SENSOR:
                material = await conn.getAllSensors();
                break;
            default:
                break;
        }

        return material;
    };
}

module.exports = MaterialFactory;