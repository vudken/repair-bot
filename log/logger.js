'use strict';

const log4js = require('log4js');

log4js.configure({
    appenders: {
        out: {
            type: 'stdout',
            layout: {
                type: 'pattern',
                pattern: '%d{dd/MM/yyyy hh:mm} - %[%m%]'
            }
        },
        app: {
            type: 'file',
            filename: './log/app.log',
            layout: {
                type: 'pattern',
                pattern: '%d{dd/MM/yy hh:mm} [%p] - %m'
            }
        }
    },
    categories: {
        default: { appenders: ['out', 'app'], level: 'debug' },
        app: { appenders: ['app'], level: 'debug' }
    }
});

const logger = log4js.getLogger();
const logToFile = log4js.getLogger('app');
module.exports = {
    logger,
    logToFile
}