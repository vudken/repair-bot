const MATERIAL_CATEGORY = require('../constant/MaterialCategoryEnum');
const MaterialFactory = require('../MaterialFactory');

const createAssemblyObject = async () => {
    const assembly = {},
        factory = new MaterialFactory(),
        categories = Object.values(MATERIAL_CATEGORY);

    for (const category of categories) {
        let materialArr = await factory.create(category);
        let tmpObj = {};

        materialArr.forEach(material => {
            tmpObj[material.model] = {
                'name': material.name,
                'quantity': 0
            };
        });

        assembly[category] = tmpObj;
    }

    return assembly;
};

module.exports = createAssemblyObject;