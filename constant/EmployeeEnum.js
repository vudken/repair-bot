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
    MURAJEV: {
        CHAT_ID: process.env.MURAJEV_CHAT_ID,
        CRM_ID: process.env.MURAJEV_CRM_ID,
        CRM_USERNAME: process.env.MURAJEV_CRM_USERNAME,
    },
});

const findCrmUserById = (username) => {
    const user = Object.values(data).find(obj => obj.username === username);
    return user ? user.chatId : null; // Return null or handle the case when username is not found
};

module.exports = findCrmUserById;