'use strict';

require('dotenv').config();

const nodemailer = require('nodemailer');
const { logger } = require('./log/logger.js');
const { getEmailText } = require('./service/util.js');

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
    } catch (err) {
        logger.error(err);
    }
};

let photos;
const sendEmail = async (work, photos) => {
    sendMail({
        from: {
            name: 'Ремонтные работы',
            address: 'rabotniklep@gmail.com'
        },
        to: 'tamelepenergy@gmail.com',
        subject: `${work.address} (Ремонтная работа)`,
        text: getEmailText(work.places),
        attachments: photos
    }, info => {
        logger.debug(`Еmail has been sent successfully to ${info.envelope.to} (msg id: ${info.messageId})`);
    });
};

module.exports = sendEmail;