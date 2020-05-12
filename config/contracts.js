require("dotenv").config({
    path: "config/testnet/vars.env",
    encoding: "utf8"
})
const bigNumber = require('bignumber.js')
module.exports = {
    // default applies to all environments
    default: {
        // order of connections the dapp should connect to
        dappConnection: [
            "$EMBARK",
            "$WEB3", // uses pre existing web3 object if available (e.g in Mist)
            "ws://localhost:8546",
            "http://localhost:8546"
        ],
        "dappAutoEnable": true,
        "warnIfMetamask": true,
        // Automatically call `ethereum.enable` if true.
        // If false, the following code must run before sending any transaction: `await EmbarkJS.enableEthereum();`
        // Default value is true.
        // dappAutoEnable: true,

        gas: "auto",

        // Strategy for the deployment of the contracts:
        // - implicit will try to deploy all the contracts located inside the contracts directory
        //            or the directory configured for the location of the contracts. This is default one
        //            when not specified
        // - explicit will only attempt to deploy the contracts that are explicitly specified inside the
        //            contracts section.
        // strategy: 'implicit',

        // minimalContractSize, when set to true, tells Embark to generate contract files without the heavy bytecodes
        // Using filteredFields lets you customize which field you want to filter out of the contract file (requires minimalContractSize: true)
        // minimalContractSize: false,
        // filteredFields: [],
        deploy: {
            ERC20: {
                args: ["Test", "T", 18, new bigNumber(50000000000000000000000000000).toFixed()]
            },
            CTokenManager: {
                args: []
            },
            Sablier: {
                args: ["$CTokenManager"]
            },
            RemCare: {
                args: ["$Sablier"]
            }
        },
        afterDeploy: async (deps) => {
            var receipt = deps.contracts.RemCare.methods.initialize().send({
                gas: 8000000
            })
            await deps.contracts.ERC20.methods.approve(deps.contracts.Sablier.options.address,new bigNumber(50000000000000000000000000000).toFixed()).send({gas:8000000})
            console.log('receipt: ', receipt)
        },
        development: {
            deploy: {
                ERC20: {
                    args: ["Test", "T", 18, new bigNumber(50000000000000000000000000000).toFixed()]
                },
                CTokenManager: {
                    args: []
                },
                Sablier: {
                    args: ["$CTokenManager"]
                },
                onDeploy: async ({
                    contracts,
                    web3,
                    logger
                }) => {


                }
            }
        }
    },
    infura: {
        strategy: 'explicit',
        gas: "8000000",
        contracts: {

            onDeploy: async ({
                contracts,
                web3,
                logger
            }) => {

            }
        },
        "dappAutoEnable": true,
        "warnIfMetamask": true,
    },
    // merges with the settings in default
    // used with "embark run privatenet"
    privatenet: {},

    // you can name an environment with specific settings and then specify with
    // "embark run custom_name" or "embark blockchain custom_name"
    // custom_name: {}
}