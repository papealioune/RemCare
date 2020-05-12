
let jwt = require('jsonwebtoken');
const config = require('../config/config.js');
const twoFactor = config.twoFactor;
const tokenGenerator = require('./token-generator')


function checkToken (req, res, next) {
    let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
    if (token) {
      if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
      }
      jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
          return res.json({
            success: false,
            message: 'Token is not valid'
          });
        } else {
          req.decoded = token;
          console.log('decoded Token: ', token)
          next();
        }
      });
    } else {
      return res.json({
        success: false,
        message: 'Auth token is not supplied'
      });
    }
  };

  async function verifyVerificationCode(user) {
    return new Promise(async (resolve) => {
      var secret = await Promise.resolve(tokenGenerator.getSecret(user.phone_number))
      var valid = twoFactor.verifyToken(secret.secret, user.code,60);
      console.log('valid twoFactor: ', valid)
      console.log('secret: ', secret, ' code: ', user.code)
      var validated = {}
      switch (valid.delta) {
        case -1:
          validated = {
            "error": "Verfication Code already expired",
            "message": "",
            valid: false,
            code:200
          }
          break
        case 1:
          validated = {
            "error": "Verfication Code already sent",
            "message": "",
            valid: false,
            code:200
          }
          break
        case 0:
          validated = {
            "message": "Verfication Code valid",
            "error": "",
            valid: true,
            code:200
          }
          break
      }
      resolve(validated)
    })
  }
module.exports={
    checkToken,
    verifyVerificationCode
}