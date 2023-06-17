require('dotenv').config();

const EMPLOYEE_ENUM = Object.freeze({
    TEIKA_PURVCIEMS: {
        CHAT_ID: process.env.TEIKA_PURVCIEMS_CHAT_ID,
        CRM_ID: process.env.TEIKA_PURVCIEMS_CRM_ID,
        CRM_USERNAME: process.env.TEIKA_PURVCIEMS_CRM_USERNAME,
    },
    PURVCIEMS_A: {
        CHAT_ID: process.env.PURVCIEMS_A_CHAT_ID,
        CRM_ID: process.env.PURVCIEMS_A_CRM_ID,
        CRM_USERNAME: process.env.PURVCIEMS_A_CRM_USERNAME,
    },
    PURVCIEMS_B: {
        CHAT_ID: process.env.PURVCIEMS_B_CHAT_ID,
        CRM_ID: process.env.PURVCIEMS_B_CRM_ID,
        CRM_USERNAME: process.env.PURVCIEMS_B_CRM_USERNAME,
    },
    JUGLA: {
        CHAT_ID: process.env.JUGLA_CHAT_ID,
        CRM_ID: process.env.JUGLA_CRM_ID,
        CRM_USERNAME: process.env.JUGLA_CRM_USERNAME,
    },
    MEZCIEMS: {
        CHAT_ID: process.env.MEZCIEMS_CHAT_ID,
        CRM_ID: process.env.MEZCIEMS_CRM_ID,
        CRM_USERNAME: process.env.MEZCIEMS_CRM_USERNAME,
    },
    VECMILGRAVIS: {
        CHAT_ID: process.env.VECMILGRAVIS_CHAT_ID,
        CRM_ID: process.env.VECMILGRAVIS_CRM_ID,
        CRM_USERNAME: process.env.VECMILGRAVIS_CRM_USERNAME,
    },
    SARKANDAUGAVA: {
        CHAT_ID: process.env.SARKANDAUGAVA_CHAT_ID,
        CRM_ID: process.env.SARKANDAUGAVA_CRM_ID,
        CRM_USERNAME: process.env.SARKANDAUGAVA_CRM_USERNAME,
    },
    PRIVATI: {
        CHAT_ID: process.env.PRIVATI_CHAT_ID,
        CRM_ID: process.env.PRIVATI_CRM_ID,
        CRM_USERNAME: process.env.PRIVATI_CRM_USERNAME,
    },
    CHESKIN: {
        CHAT_ID: process.env.CHESKIN_CHAT_ID,
        CRM_ID: process.env.CHESKIN_CRM_ID,
        CRM_USERNAME: process.env.CHESKIN_CRM_USERNAME,
    },
    BERDNIK: {
        CHAT_ID: process.env.BERDNIK_CHAT_ID,
        CRM_ID: process.env.BERDNIK_CRM_ID,
        CRM_USERNAME: process.env.BERDNIK_CRM_USERNAME,
    },
    SEMJONOV: {
        CHAT_ID: process.env.SEMJONOV_CHAT_ID,
        CRM_ID: process.env.SEMJONOV_CRM_ID,
        CRM_USERNAME: process.env.SEMJONOV_CRM_USERNAME,
    },
    ZAHAROV: {
        CHAT_ID: process.env.ZAHAROV_CHAT_ID,
        CRM_ID: process.env.ZAHAROV_CRM_ID,
        CRM_USERNAME: process.env.ZAHAROV_CRM_USERNAME,
    },
    MURAVJEV: {
        CHAT_ID: process.env.MURAVJEV_CHAT_ID,
        CRM_ID: process.env.MURAVJEV_CRM_ID,
        CRM_USERNAME: process.env.MURAVJEV_CRM_USERNAME,
    },
});

const findCrmEmployeeIdByChatId = (chatId) => {
    const crmId = Object.values(EMPLOYEE_ENUM).find(obj => obj.CHAT_ID == chatId);
    return crmId ? crmId.CRM_ID : null;
};

const isEmployeeExist = (chatId) => {
    return Object.values(EMPLOYEE_ENUM).some(obj => parseInt(obj.CHAT_ID) === chatId);
};

module.exports = {
    findCrmEmployeeIdByChatId,
    isEmployeeExist
};