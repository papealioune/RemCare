const config = require('../config/config')
const helper = require('../helpers/index')
var uuid = config.uuid;
const fs = config.fs
const helpers = require('../helpers/index')

function requestParcel(req, res, next) {

}

function redeemParcel(req, res, next) {

}

function donate(req, res, next) {

}

function stopDonation(req, res, next) {

}
async function updateCenterDonation(req,res,next){
    console.log('here in updating donor')
    var response = await Promise.resolve(helpers.registerDonor(req.body))
    res.status(response.code).json(response)
    next()
}



async function getRegisteredCommunityCenters(req, res, next) {
    var centers = await Promise.resolve(helpers.getRegisteredCentersNoParam())
    console.log('centers: ', centers)
    res.status(centers.code).json(centers)
    next()
}
module.exports = {
    requestParcel,
    redeemParcel,
    donate,
    stopDonation,
    getRegisteredCommunityCenters,
    updateCenterDonation

}