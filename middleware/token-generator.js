require('dotenv').config({
    path: '../config/vars.env',
    encoding: 'utf8'
})
const config = require('../config/config');
const jwt = config.jwt
const db = config.db
const secret = config.secret
const bcrypt = config.bcrypt
const saltRounds = 15;
var twoFactor = config.twoFactor;

function encryptPassword(password) {
    bcrypt.hash(password, saltRounds, function (err, hash) {
        return hash
    });
}

function generateToken(username) {
    let token = jwt.sign({
            username: username
        },
        secret, {
            expiresIn: '1h' // expires in 1 hour
        }
    );
    return token
}
async function storeSecret(phone_number, secret) {
    return new Promise((resolve) => {
        const query = {
            "text": 'UPDATE secret_table SET secret=$1 WHERE user_phone_number=$2',
            "values": [secret, phone_number]
        }
        db.query(query, async (error, results) => {
            console.log('error storing secret: ', error)
            console.log('results of storing secret: ', results)
            resolve(true)
        })
    })
}

async function generateCode(phone_number) {
    var secretTemp = twoFactor.generateSecret({
        name: secret,
        account: phone_number
    });
    var code = twoFactor.generateToken(secretTemp.secret);
    console.log('generated secret: ', secretTemp.secret)
    await Promise.resolve(storeSecret(phone_number, secretTemp.secret))
    console.log('generated verfication code: ', code.token)
    return code.token;
}

async function getSecret(phone_number) {
    return new Promise((resolve) => {
        const query = {
            "text": 'SELECT secret FROM password_table WHERE user_phone_number=$1',
            "values": [phone_number]
        }
        db.query(query, (error, results) => {
            console.log('error getting secret: ', error)
            console.log('results of secret: ', secret)
            if (error) {
                resolve({
                    "error": "Something went wrong",
                    "code": 500,
                    "message": "",
                    "secret": ""
                })
            }
            if (results && results.rowCount > 0) {
                resolve({
                    "error": "",
                    "code": 200,
                    "message": "Found user secret",
                    "secret": results.rows[0].secret
                })
            }
        })
    })
}
module.exports = {
    encryptPassword,
    generateToken,
    storeSecret,
    generateCode,
    getSecret
}