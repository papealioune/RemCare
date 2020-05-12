require('dotenv').config({
    path: 'config/vars.env',
    encoding: 'utf8'
})
const db = require('../databases/index').postGresDB
const fs = require('fs');
const path = require('path')
const uuid = require('crypto-random-string');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
var twoFactor = require('node-2fa');
var web3 = require('web3')
web3 = new web3(process.env.NodeAddress)
const numberLib = require('libphonenumber-js')
var cache = require('node-cache')
cache = new cache({
    stdTTL: 600
});

const citiesAPI = require('full-countries-cities')
const request = require('request')
const morgan = require('morgan')
const express = require('express')
const countriesAPI = require('countries-api')
var countriesAfrica = countriesAPI.findByRegion("Africa");
var countries=[]
countriesAfrica.data.forEach(country => {
    countries.push({
        "name": country.name.common,
        "code": country.callingCode[0]
    })
})
const utils = require('web3-utils')
console.log('process.env.RemCareAddress',process.env.RemCareAddress)
const remCare = new web3.eth.Contract(require('../contract-abis/RemCare.json'), process.env.RemCareAddress)
module.exports = {
    secret: process.env.SECRET,
    "defaultAccount": process.env.defaultAccount,
    "messagingServiceSid": process.env.messagingServiceSid,
    accountSid: process.env.accountSid,
    authToken: process.env.authToken,
    citiesAPI,
    uuid,
    path,
    fs,
    jwt,
    bcrypt,
    twoFactor,
    db,
    remCare,
    numberLib,
    cache,
    request,
    morgan,
    express,
    countries,
    utils
};