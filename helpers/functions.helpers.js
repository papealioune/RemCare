require('dotenv').config({
    path: './vars.env',
    encoding: 'utf8'
})
const config = require('../config/config')
const cache = config.cache
const messageCenter = require('../message-center/messagecenterfunctions.helpers')
const schema = require('../schemas/schemas')
const functions = require('./index')
const numberLib = config.numberLib
const citiesAPI = config.citiesAPI
const countries = config.countries
const request = config.request
console.log('env: ', process.env.DEVELOPMENT)
/*============================================================ API calls Functions ============================================================ */
async function getRegisteredCenter(city) {
    return new Promise(async (resolve) => {
        var centers = await Promise.resolve(functions.getRegisteredCenters({
            "name": city
        }))
        console.log('centers: ', centers)
        resolve({
            "centers": centers
        })
    })
}
async function requestParcel(center, userPhoneNumber) {
    var centerDets = await Promise.resolve(functions.getCenter(center))
    console.log('centerDets: ', centerDets)
    centerDets = centerDets.centerDets
    centerDets.phone_number = userPhoneNumber
    console.log('centerDetsNew', centerDets)
    var token = await Promise.resolve(functions.requestParcel(centerDets))
    return token
}
async function redeemToken(token) {
    return new Promise(async (resolve) => {
        console.log('redeeming token: ',token)
        var redeemResults = await Promise.resolve(functions.redeemParcel(token))
        resolve(redeemResults)
    })
}
/*============================================================ Text Message Functions ============================================================ */
function extractUserNumber(data) {
    console.log('data: ', data)
    return data.From.split('whatsapp:')[1]
}


function sendError(userPhoneNumber, message) {
      messageCenter.sendMessageWhatsApp(userPhoneNumber,message)
}

function showMenu(userPhoneNumber) {
    var message = `
   Hello 😃 Welcome to RemCare ↔️
   \nPlease note our platform is still in beta
   \n\n1. Continue ➡
   \n2. Language Selection 🌍\n
  `
      messageCenter.sendMessageWhatsApp(userPhoneNumber,message)

    return message
}

function saveCache(key, object) {
    console.log('saving user cache: ', cache.set(key, object))
}

function getCache(userPhoneNumber) {
    console.log('cache: ', cache.get(userPhoneNumber))
    return cache.get(userPhoneNumber)
}

function showMainMenu(userPhoneNumber) {
    console.log(`redirecting ${userPhoneNumber} to main menu`)
    var menu = `
    Welcome to RemCare ↔️
    \n1. Nearest Center  🤲🏻 
    \n2. Redeem Parcel ✍️
    \n3. Register Center 🏠
    \n0. back ↩
    `
      messageCenter.sendMessageWhatsApp(userPhoneNumber,menu)
    return menu
}

function showRedeemMenu(userPhoneNumber) {
    var message = `
    Redeem Parcel Token ↔️\n
    Please enter the token your received earlier 😃
    \n0. back ↩
    `
      messageCenter.sendMessageWhatsApp(userPhoneNumber,message)
    return message
}

function showReportMenu(userPhoneNumber) {
    var message = `
    Report Symptoms of COVID19 😷\n
    If you feel like you have developed symptooms of COIVD19 after having collected a parcel this feature allowas you to notify the center and everyone who was there during collection
    \n1. Report
    \n0. back ↩
    `
      messageCenter.sendMessageWhatsApp(userPhoneNumber,message)
    return message
}

function showLangugageSelection(userPhoneNumber) {
    var menu = `
     This option is still under development 🙆 
    `
    sendError(userPhoneNumber, menu)
    reset(userPhoneNumber)
    return menu
}

function sendNearestCenterMenu(userPhoneNumber, options) {
    var countryCode = getCountryCode(userPhoneNumber)
    console.log('countryCode: ', countryCode)
    var selectedCountry = countries.filter((country) => {
        return country.code === countryCode
    })
    console.log('countries: ', countries)
    var country = selectedCountry[0].name
    var cities = citiesAPI.getCities(country);  //Returns an array of city names of the 
    var message = "Please Select a City 🏠\n"
    var length = cities.length>10?10:cities.length
    for (var i = 0, k = 1; i < length; i++, k++) {
        message += `${k}. ${cities[i]} \n`
    }
    options.cities = cities
    saveCache(userPhoneNumber, options)
    message += '0. back ↩'
      messageCenter.sendMessageWhatsApp(userPhoneNumber,message)
    return message
}

function sendParcelRequestTokenMenu(userPhoneNumber) {
    var menu = `
    Parcel Request 🥘\n
    1. Request Parcel
    0.back ↩ 
    `
    messageCenter.sendMessageWhatsApp(userPhoneNumber,menu)
    return menu
}

async function sendUserParcelToken(userPhoneNumber, center) {
    console.log('center to request from: ', center)
    var token = await Promise.resolve(requestParcel(center, userPhoneNumber))
    console.log('token: ', token.parcelToken, ' parcel: ', token)
    var message = `Please use the token when to redeem your parcel at the community center \n\n
    ${token.parcelToken}
    `
    messageCenter.sendMessageWhatsApp(userPhoneNumber,message)
    return message
}

function reset(userPhoneNumber) {
    var actions = {
        "user": userPhoneNumber,
        "actions": [],
        "processing": false,
        "currentOption": "start",
        "lastOption": "start",
        cities: [],
        center: "",
        token: ""
    }
    console.log('reseting to start menu')
    showMenu(userPhoneNumber)
    saveCache(userPhoneNumber, actions)
}

async function sendCityCenters(userPhoneNumber, options) {
    var centers = await Promise.resolve(getRegisteredCenter({
        name: options.city
    }))
    options.centers = centers.centers.centers
    saveCache(userPhoneNumber, options)
    console.log('centers found: ', centers.centers.centers.length)
    var message = `
    Please Select a center nearest to you \n
    `
    var count = 1;
    if (centers.centers.centers.length) {
        centers.centers.centers.map((center) => {
            console.log('center: ', center)
            message += `${count}. ${center.center_name}\n`
            count++
        })
    }
    message += '\n0. 0.back ↩'
      messageCenter.sendMessageWhatsApp(userPhoneNumber,message)
    return message
}

/*============================================================ Schema  Functions ============================================================ */


function getCountryCode(userPhoneNumber) {
    var no = numberLib.parsePhoneNumberFromString('Phone: ' + userPhoneNumber)
    return no.countryCallingCode

}
module.exports = {
    extractUserNumber,
    sendError,
    showMenu,
    saveCache,
    getCache,
    showMainMenu,
    showLangugageSelection,
    getCountryCode,
    showRedeemMenu,
    sendNearestCenterMenu,
    showReportMenu,
    sendParcelRequestTokenMenu,
    requestParcel,
    sendCityCenters,
    reset,
    sendUserParcelToken,
    redeemToken
}