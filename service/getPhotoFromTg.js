require('dotenv').config();

const { default: axios } = require('axios');

const getPhotoPath = async (photo) => {
    const url = `https://api.telegram.org`,
        length = photo.length,
        res = await axios.get(
            `https://api.telegram.org/bot${process.env.BOT_TOKEN}/getFile?file_id=${length > 1 ? photo[length - 1].file_id : photo[0].file_id}`
        );

    return `${url}/file/bot${process.env.BOT_TOKEN}/${res.data.result.file_path}`;
};

module.exports = getPhotoPath;