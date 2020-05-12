require('dotenv').config({
    path: "./config/vars.env",
    encoding: "utf8"
})

/**==============================API initialisation Start==============================*/
const generalPort = process.env.PORT

const config = require('../config/config')
const morgan = config.morgan
const express = config.express
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ // Middleware
    extended: true
}));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
app.use(bodyParser.json())

/**==============================Function initialisation Start==============================*/
const tokenVerifier = require('../middleware/token-verifier')
const routes = require('../routes/index.js')
const whatsAppRoutes = require('../routes/whatsApp.routes')
const webRoutes = require('../routes/index')
/**==============================API initialisation Start==============================*/

/**
 * @dev route responsible for preventing random thus forcing the requirment of a token
 * @requirement the user is required to supply an acess token inorder to update the car details
 */

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', tokenVerifier.checkToken)
app.get('/api/v1/centers', webRoutes.getRegisteredCommunityCenters)
app.post('/api/v1/centers/update', webRoutes.updateCenterDonation)
app.post('/', whatsAppRoutes.handleRequest)
app.get('/api/v1/', tokenVerifier.checkToken)
app.listen(generalPort, () => {
    console.log(`==============================App listening on Port ${generalPort}==============================`)
})

module.exports = app