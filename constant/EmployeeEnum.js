require('dotenv').config();

const EMPLOYEE_ENUM = Object.freeze({
	TEIKA_PURVCIEMS: {
        CHAT_ID: process.env.TEIKA_PURVCIEMS_CHAT_ID,
        CRM_ID: process.env.TEIKA_PURVCIEMS_CRM_ID,
    },
	PURVCIEMS_A: {
        CHAT_ID: process.env.PURVCIEMS_A_CHAT_ID,
        CRM_ID: process.env.PURVCIEMS_A_CRM_ID,
    },
	PURVCIEMS_B: {
        CHAT_ID: process.env.PURVCIEMS_B_CHAT_ID,
        CRM_ID: process.env.PURVCIEMS_B_CRM_ID,
    },
    JUGLA: {
        CHAT_ID: process.env.JUGLA_CHAT_ID,
        CRM_ID: process.env.JUGLA_CRM_ID,
    },
    MEZCIEMS: {
        CHAT_ID: process.env.MEZCIEMS_CHAT_ID,
        CRM_ID: process.env.MEZCIEMS_CRM_ID,
    },
    VECMILGRAVIS: {
        CHAT_ID: process.env.VECMILGRAVIS_CHAT_ID,
        CRM_ID: process.env.VECMILGRAVIS_CRM_ID,
    },
    SARKANDAUGAVA: {
        CHAT_ID: process.env.SARKANDAUGAVA_CHAT_ID,
        CRM_ID: process.env.SARKANDAUGAVA_CRM_ID,
    },
    PRIVATI: {
        CHAT_ID: process.env.PRIVATI_CHAT_ID,
        CRM_ID: process.env.PRIVATI_CRM_ID,
    },
});

module.exports = SCENE_ID;