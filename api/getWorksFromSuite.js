require('dotenv').config();

const { default: axios } = require('axios');
const { logger } = require('../log/logger');

(async () => {
    try {
        let resp = await axios.get(process.env.OAS_DB_ENDPOINT, {
            auth: {
                username: process.env.OAS_USERNAME,
                password: process.env.OAS_PASS
            }
        });

        console.log(resp.data);
    } catch (error) {
        logger.error(error);
    }
})();