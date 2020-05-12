const helperFunctions = require('../helpers/functions.helpers')
async function handleRequest(req, res, next) {
    var body = req.body.Body
    console.log('here: ', body)
    var responseMessage = ""
    var userPhoneNumber = helperFunctions.extractUserNumber(req.body)
    var userLastOptions = helperFunctions.getCache(userPhoneNumber)
    console.log('user query: ', body)
    switch (body.toLowerCase()) {
        case "menu":
            var menu = helperFunctions.showMenu(userPhoneNumber)
            res.status(200).send(
                formatToTwiml(menu)
            )
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
            helperFunctions.saveCache(userPhoneNumber, actions)
            break
        case "1":
            if (userLastOptions && userLastOptions.processing) {
                responseMessage = "🕛⚠️ Transaction in progress please wait..."
                helperFunctions.sendError(userPhoneNumber, responseMessage)
                res.status(200).send(
                    formatToTwiml(responseMessage)
                )
            }
            if (userLastOptions) {
                await handleOptionOnes(userPhoneNumber, userLastOptions, res, body)
            } else {
                console.log('in else userLastOptions', userLastOptions.currentOption)
                responseMessage = "Oops thats an invalid command ⚠️  Please use the 'menu' command to view menu"
                //sendError(responseMessage)
                res.status(200).send(
                    formatToTwiml(responseMessage)
                )
            }
            break
        case "2":
            if (userLastOptions.processing) {
                responseMessage = "🕛⚠️ Transaction in progress please wait..."
                helperFunctions.sendError(userPhoneNumber, responseMessage)
                res.status(200).send(
                    formatToTwiml(responseMessage)
                )
            }
            if (userLastOptions) {
                handleOptionTwos(userPhoneNumber, userLastOptions, res)
            } else {
                helperFunctions.sendError("Oops thats an invalid option ⚠️ \nPlease ensure you select from the options listed")
            }
            break
        default:
            console.log('in defualt: ', userLastOptions)
            if (userLastOptions && userLastOptions.currentOption) {
                switch (userLastOptions.currentOption) {
                    case "nearest":
                        try {
                            console.log('in selecting user city')
                            var city = userLastOptions.cities[Math.abs(body - 1)]
                            userLastOptions.currentOption = "cityCenters"
                            userLastOptions.lastOption = "nearest"
                            userLastOptions.city = city
                            var centers = await Promise.resolve(helperFunctions.sendCityCenters(userPhoneNumber, userLastOptions))
                            res.status(200).send(
                                formatToTwiml(centers)
                            )
                        } catch (error) {
                            console.log(' nearest error: ', error)
                            responseMessage = "Oops thats an invalid city ⚠️  Please select a city from the list given"
                            helperFunctions.sendError(userPhoneNumber, responseMessage)
                            res.status(200).send(
                                formatToTwiml(responseMessage)
                            )
                        }
                        break
                    case "verifyToken":
                        console.log('in verify token:')
                        var redeemedMessage = await Promise.resolve(helperFunctions.redeemToken(body))
                        if (!redeemedMessage.redeemed) {
                            helperFunctions.reset(userPhoneNumber)
                            res.status(200).send(
                                formatToTwiml(redeemedMessage.message)
                            )
                        } else {
                            userLastOptions.currentOption = "verifyToken"
                            userLastOptions.lastOption = "redeem"
                            helperFunctions.saveCache(userPhoneNumber, userLastOptions)
                            helperFunctions.sendError(userPhoneNumber, formatToTwiml(redeemedMessage.error))
                            res.status(200).send(
                                formatToTwiml(redeemedMessage.error)
                            )
                        }
                        break
                }
            } else {
                responseMessage = "Oops thats an invalid command ⚠️  Please use the 'menu' command to view menu"
                //sendError(responseMessage)
                res.status(200).send(
                    formatToTwiml(responseMessage)
                )
            }
            break
    }
    next()
}

function formatToTwiml(message) {
    return `<Response>
    <Message>${message}</Message>
</Response>`
}

async function handleOptionOnes(userPhoneNumber, userLastOptions, res, index) {
    console.log('handling option 1s\n', userLastOptions.currentOption)
    switch (userLastOptions.currentOption) {
        case "start":
            //helperFunctions.showMainMenu()
            userLastOptions.currentOption = "mainmenu"
            userLastOptions.lastOption = "menu"
            helperFunctions.saveCache(userPhoneNumber, userLastOptions)
            res.status(200).send(
                formatToTwiml(helperFunctions.showMainMenu(userPhoneNumber))
            )
            break
        case "mainmenu":
            userLastOptions.currentOption = "nearest"
            userLastOptions.lastOption = "mainmenu"
            helperFunctions.saveCache(userPhoneNumber, userLastOptions)
            var options = helperFunctions.sendNearestCenterMenu(userPhoneNumber, userLastOptions)
            res.status(200).send(
                formatToTwiml(options)
            )
            break
        case "cityCenters":
            console.log('in requsting token menu')
            userLastOptions.currentOption = "requestParcel"
            userLastOptions.lastOption = "cityCenters"
            helperFunctions.saveCache(userPhoneNumber, userLastOptions)
            console.log('here between')
            var menu = await Promise.resolve(helperFunctions.sendParcelRequestTokenMenu(userPhoneNumber, userLastOptions.city))
            console.log('menu: ', menu)
            res.status(200).send(
                formatToTwiml(menu)
            )
            break
        case "requestParcel":
            console.log('request parcel menu')
            try {
                console.log('center selected: ', userLastOptions.centers)
                var center = userLastOptions.centers[Math.abs(index - 1)]
                userLastOptions.center = center
                console.log('Selected center name: ', center)
                userLastOptions.currentOption = "mainmenu"
                userLastOptions.lastOption = "requestParcel"
                helperFunctions.saveCache(userPhoneNumber, userLastOptions)
                console.log('center before message: ', center)
                var message = await Promise.resolve(helperFunctions.sendUserParcelToken(userPhoneNumber, center))
                console.log('message: ', message)
                res.status(200).send(
                    formatToTwiml(message + '\n\n\n\n\n\n\n\n' + helperFunctions.showMainMenu(userPhoneNumber))
                )
            } catch (error) {
                console.log('error: ', error)
                var responseMessage = "Oops thats an invalid center ⚠️  Please select a center from the list given"
                helperFunctions.sendError(userPhoneNumber, responseMessage)

                res.status(200).send(
                    formatToTwiml(responseMessage)
                )
            }
            break
    }
}

function handleOptionTwos(userPhoneNumber, userLastOptions, res) {
    console.log('handling option 2s\n', userLastOptions)
    switch (userLastOptions.currentOption) {
        case "start":
            //helperFunctions.showMainMenu()
            userLastOptions.currentOption = "mainmenu"
            userLastOptions.lastOption = "menu"
            helperFunctions.saveCache(userPhoneNumber, userLastOptions)
            res.status(200).send(
                formatToTwiml(helperFunctions.showLangugageSelection(userPhoneNumber))
            )
            break
        case "mainmenu" ||"redeem":
            userLastOptions.currentOption = "verifyToken"
            userLastOptions.lastOption = "mainmenu"
            helperFunctions.saveCache(userPhoneNumber, userLastOptions)
            res.status(200).send(
                formatToTwiml(helperFunctions.showRedeemMenu(userPhoneNumber))
            )
            break
    }

}
module.exports = {
    handleRequest

}