'use strict';

require('dotenv').config();
const nodemailer = require('nodemailer');
const { logger, logToFile } = require('./log/logger.js');

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.WORKER_EMAIL,
        pass: process.env.WORKER_EMAIL_PASS,
    },
});

const sendMail = async (mailDetails, callback) => {
    try {
        const info = await transporter.sendMail(mailDetails);
        callback(info);
    } catch (error) {
        logger.error(error);
    }
};

const sendEmail = async (work) => {
    sendMail({
        from: {
            name: 'Ремонтные работы',
            address: 'rabotniklep@gmail.com'
        },
        to: 'tamelepenergy@gmail.com',
        subject: `(Ремонтная работа)`,
        text: `Это письмо сгенерировано автоматически в тестовом режиме и отправлено через телеграмм-бот.\n
        Произведена ремонтная работа:
        Адрес: ${work.аddress}
        Где: ${work.where}
        Что: ${work.problemWith}
        Заменено: ${work.cause}`,
        attachments: work.photos
    }, info => {
        logger.debug(`Еmail has been sent successfully to ${info.envelope.to} (msg id: ${info.messageId})`);
    });
};

module.exports = sendEmail;