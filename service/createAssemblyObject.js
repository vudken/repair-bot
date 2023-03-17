const EQUIMPMENT_CATEGORY = require('../constant/EquipmentCategoryEnum');
const EquipmentFactory = require('../model/EquipmentFactory');

const createAssemblyObject = async () => {
    const factory = new EquipmentFactory(),
        categories = Object.values(EQUIMPMENT_CATEGORY),
        assembly = {
            'employeeId': undefined,
            'equipment': []
        };

    for (const category of categories) {
        let equipment = await factory.create(category);
        equipment.map(el => el['quantity'] = 0);
        assembly.equipment.push({
            category: category,
            items: equipment
        });
    }

    return assembly;
};

module.exports = createAssemblyObject;