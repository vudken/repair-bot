require('dotenv').config();

const axios = require('axios');
const { logger } = require('../log/logger');

const fetchData = async () => {
    try {
        let resp = await axios.get(process.env.OAS_DB_ENDPOINT, {
            auth: {
                username: process.env.OAS_USERNAME,
                password: process.env.OAS_PASS
            }
        });

        return (resp.data);
    } catch (error) {
        logger.error(error);
    }
};

module.exports = fetchData;