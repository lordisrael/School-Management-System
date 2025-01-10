const { config } = require('dotenv')

require('dotenv').config()

const MONGO_URI = process.env.MONGO_URI || null
const JWT_LIFETIME = process.env.JWT_LIFETIME; 
const RJWT_LIFETIME = process.env.RJWT_LIFETIME;
const JWT_SECRET = process.env.JWT_SECRET

const dotenv = {
    MONGO_URI,
    JWT_LIFETIME,
    RJWT_LIFETIME,
    JWT_SECRET
}

module.exports = dotenv