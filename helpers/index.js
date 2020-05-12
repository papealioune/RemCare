const config = require('../config/config')
const db = config.db
const uid = config.uuid
const remCare = config.remCare
const messageCenter = require('../message-center/messagecenterfunctions.helpers')
async function getCenterEthAddress(user) {
    return new Promise((resolve) => {
        const query = {
            "text": 'SELECT * FROM center_table WHERE center_phone_number=$1',
            "values": [user.center_phone_number]
        }
        db.query(query, (error, results) => {
            console.log('center eth address: ', results)
            if (error) {
                resolve({
                    found: false,
                    "error": "Something went wrong",
                    message: "",
                    code: 500,
                    ethAddress: ""
                })
            } else if (results.rowCount > 0) {
                resolve({
                    found: true,
                    "code": 200,
                    message: "Found user eth address",
                    error: "",
                    ethAddress: results.rows[0].center_eth_address
                })
            } else {
                resolve({
                    found: false,
                    "code": 200,
                    message: "",
                    error: "Eth address not found",
                    ethAddress: results.rows[0].center_eth_address
                })
            }
        })
    })
}
async function getCenter(center) {
    return new Promise((resolve) => {
        const query = {
            "text": 'SELECT * FROM center_table WHERE center_name=$1',
            "values": [center.center_name]
        }
        console.log('searching fr centerName: ', center.center_name)
        db.query(query, (error, results) => {
            console.log('error', error)
            if (error) {
                resolve({
                    found: false,
                    "error": "Something went wrong",
                    message: "",
                    code: 500,
                    centerDets: {}
                })
            }
            if (results.rowCount > 0) {
                resolve({
                    found: true,
                    "error": "",
                    message: "Found center details",
                    code: 200,
                    centerDets: results.rows[0]
                })
            } else {
                resolve({
                    found: false,
                    "error": "",
                    message: "Center details not found",
                    code: 200,
                    centerDets: {}
                })
            }
        })
    })
}
async function requestParcel(parcelRequest) {
    return new Promise((resolve) => {
        var parcelUUID = uid({
            length: 4
        });
        console.log('uuid parcel: ', parcelUUID, ' parcelRequest: ', parcelRequest)
        const query = {
            "text": 'INSERT INTO parcel_table (center_phone_number,receipient_phone_number,parcel_token) VALUES($1,$2,$3)',
            "values": [parcelRequest.center_phone_number, parcelRequest.phone_number, parcelUUID]
        }
        db.query(query, (error, results) => {
            console.log('error', error)
            if (error) {
                resolve({
                    "error": "Something went wrong",
                    code: 500,
                    message: "",
                    parcelToken: null
                })
            } else {
                resolve({
                    "error": "",
                    code: 200,
                    message: "Pracel request success",
                    parcelToken: parcelUUID
                })
            }
        })
    })
}
async function getRegisteredCenters(city) {
    return new Promise((resolve) => {
        const query = {
            "text": 'SELECT * from center_table WHERE center_city=$1',
            "values": [city.name.name]
        }
        console.log('looking for city centers: ', city.name.name)
        db.query(query, async (error, results) => {
            console.log('center city: ', results)
            if (error) {
                resolve({
                    "error": "Something went wrong",
                    code: 500,
                    message: "",
                    centers: []
                })
            }
            if (results.rowCount > 0) {
                results.rows.map((center) => {
                    delete center.center_private_address
                })
                resolve({
                    "error": "",
                    code: 200,
                    message: "Found centers",
                    centers: results.rows
                })
            } else {
                resolve({
                    "error": "",
                    code: 404,
                    message: "Could not find any centers",
                    centers: []
                })
            }
        })
    })
}
async function getRegisteredCentersNoParam() {
    return new Promise((resolve) => {
        const query = {
            "text": 'SELECT * from center_table',
            "values": []
        }
        //console.log('looking for city centers: ', city.name.name)
        db.query(query, async (error, results) => {
            console.log('center city: ', results)
            if (error) {
                resolve({
                    "error": "Something went wrong",
                    code: 500,
                    message: "",
                    centers: []
                })
            }
            if (results.rowCount > 0) {
                results.rows.map((center) => {
                    delete center.center_private_address
                })
                resolve({
                    "error": "",
                    code: 200,
                    message: "Found centers",
                    centers: results.rows
                })
            } else {
                resolve({
                    "error": "",
                    code: 404,
                    message: "Could not find any centers",
                    centers: []
                })
            }
        })
    })
}
async function redeemParcel(parcelToken) {
    return new Promise((resolve) => {
        console.log('redeeming token insde redeemparcel function')
        const query = {
            "text": 'SELECT * from parcel_table WHERE parcel_token=$1',
            "values": [parcelToken]
        }
        db.query(query, async (error, results) => {
            console.log('found parcelToken: ', parcelToken, ' results: ', results, ' error: ', error)
            if (error) {
                resolve({
                    "error": "Something went wrong",
                    message: "",
                    code: 500,
                    redeemed: false
                })
            }
            if (results.rowCount > 0) {
                console.log('results.rows[0]: ', results.rows[0])
                if (results.rows[0].redeemed) {
                    resolve({
                        message: "",
                        code: 200,
                        redeemed: true,
                        error: "Parcel already redeemed"
                    })
                } else {
                    console.log('remCareMethods: ', remCare.methods)
                    var centerEth = await Promise.resolve(getCenterEthAddress({
                        "center_phone_number": results.rows[0].center_phone_number
                    }))
                    console.log('center-eth: ', centerEth)
                    var id = await Promise.resolve(getDonationId(centerEth.ethAddress))
                    console.log('iddddd',id.donationId.donation_id, config.utils.toHex(parcelToken))
                    var receipt =  remCare.methods.redeemParcel(id.donationId.donation_id, config.utils.toHex(parcelToken)).send({
                        gas: 8000000,
                        from: config.defaultAccount
                    }).then(async(receipt,error)=>{
                        await Promise.resolve(updateParcelDetails(receipt.transactionHash, parcelToken))
                        resolve({
                            message: "Succesfully redeemed parcel",
                            code: 200,
                            redeemed: false,
                            error: ""
                        })
                    }).catch((error)=>{
                        console.log('error',error)
                    })
                  
                }
            }
        })

    })
}
async function updateParcelDetails(thash, parcelToken) {
    return new Promise((resolve) => {
        const query = {
            "text": 'UPDATE parcel_table SET transaction_hash=$1, parcel_redeemed=$2  WHERE parcel_token=$3',
            "values": [thash, true, parcelToken]
        }
        db.query(query, async (error, results) => {
            if (error) {
                resolve({
                    "error": "Something went wrong",
                    message: "",
                    code: 500,
                    updated: false
                })
            } else {
                resolve({
                    "error": "",
                    message: "Updated parcel status",
                    code: 200,
                    updated: true
                })
            }
        })
    })
}
async function registerDonor(donor) {
    return new Promise((resolve) => {
        const query = {
            "text": 'INSERT INTO donor_table (receipient_eth_address,donor_eth_address,donation_id) VALUES($1,$2,$3)',
            "values": [donor.receipient, donor.eth_address, donor.donationId]
        }
        db.query(query, async (error, results) => {
            console.log('error: ',error)
            if (error) {
                resolve({
                    "error": "Something went wrong",
                    message: "",
                    code: 500,
                    registered: false
                })
            } else {
                resolve({
                    "error": "",
                    message: "Registered Donor",
                    code: 200,
                    registered: true
                })
            }

        })
    })
}
async function getDonationId(center) {
    return new Promise((resolve) => {
        const query = {
            "text": 'SELECT donation_id from donor_table WHERE receipient_eth_address=$1',
            "values": [center]
        }
        console.log('eth-Addresssss: ',center)
        db.query(query, async (error, results) => {
            if (error) {
                resolve({
                    "error": "Something went wrong",
                    message: "",
                    code: 500,
                    found: false,
                    donationId: ''
                })
            }
            if (results.rowCount > 0) {
                console.log('results.rows[0]: ', results.rows[0])
                //@dev we just grab the first 1 to fix later on DB normalisation issue
                var id = results.rows[0]
                console.log('id: ', id)
                resolve({
                    error: "",
                    message: "Found parcel id",
                    found: true,
                    donationId: id,
                    code: 200,
                })
            } else {
                resolve({
                    "error": "",
                    message: "Donation id not found",
                    code: 200,
                    found: false,
                    donationId: ''
                })
            }

        })

    })
}
async function notifyDonorOfParcelCollection(donation) {
    return new Promise((resolve) => {
        var sent = messageCenter.sendMessage(`A parcel you donated to ${donation.center_phone_number} just got redeemed by a receipient https://etherscan.io/tx/${donation.transactionHash}`, donation.donor_phone_number)
        resolve(sent)
    })
}
module.exports = {
    getCenterEthAddress,
    requestParcel,
    redeemParcel,
    registerDonor,
    getRegisteredCenters,
    notifyDonorOfParcelCollection,
    getCenter,
    getRegisteredCentersNoParam,
    getDonationId
}