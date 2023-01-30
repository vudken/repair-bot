const EQUIPMENT_CATEGORY = require('./constant/EquipmentCategoryEnum');
const conn = require('./db/conn');

class EquipmentFactory {
    create = async (category) => {
        if (!category) return `Unable to get equipment. Please specify a category and tryagain!`;

        let equipment;
        switch (category) {
            case EQUIPMENT_CATEGORY.CONTROLLER:
                equipment = await conn.getAllControllers();
                break;
            case EQUIPMENT_CATEGORY.COUNTER:
                equipment = await conn.getAllCounters();
                break;
            case EQUIPMENT_CATEGORY.PUMP:
                equipment = await conn.getAllPumps();
                break;
            case EQUIPMENT_CATEGORY.REGULATOR:
                equipment = await conn.getAllRegulators();
                break;
            case EQUIPMENT_CATEGORY.SENSOR:
                equipment = await conn.getAllSensors();
                break;
            default:
                break;
        }

        return equipment;
    };
}

module.exports = EquipmentFactory;