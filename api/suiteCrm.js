require('dotenv').config();

const axios = require('axios');
const { logger } = require('../log/logger');

const fetchData = async () => {
    try {
        let resp = await axios.get(process.env.OAS_FETCH_ENDPOINT, {
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

const updateDataInCrm = async (data) => {
    try {
        const res = await axios.post(
            process.env.OAS_UPDATE_ENDPOINT,
            data,
            {
                auth: {
                    username: process.env.OAS_USERNAME,
                    password: process.env.OAS_PASS
                },

                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );

        return res.status.code;
    } catch (err) {
        logger.error(err.message);
        logger.error(err.response.status);
    }
};

module.exports = {
    fetchData,
    updateDataInCrm
};