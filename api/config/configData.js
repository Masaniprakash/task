require('dotenv').config();

const env = process.env.CLIENT_URL || 'localclienturl';  
const clientUrl = require('./config.json')[env];

let CONFIG = {};

CONFIG.port = process.env.PORT || '6300';
CONFIG.jwt_encryption = process.env.JWT_ENCRYPTION || 'jwt_please_change';
CONFIG.jwt_expiration = process.env.JWT_EXPIRATION || '28800';

module.exports.CONFIG = CONFIG;
