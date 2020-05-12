var RemCare = artifacts.require('RemCare')
var Token = artifacts.require('ERC20')
var Sablier = artifacts.require('Sablier')
const cryptoRandomString = require('crypto-random-string');


let accounts, donationId, tokenAmount, startDate, balance, endDate, deposit, streamId, keys;
const bigNumber = require('bignumber.js')
config({
    contracts: {
        deploy: {
            ERC20: {
                args: ["Test", "T", 18, new bigNumber(100000000000000000000000000000).toFixed()]
            },
            CTokenManager: {
                args: []
            },
            Sablier: {
                args: ["$CTokenManager"]
            },
            RemCare: {
                args: []
            }
        }
    }
}, (err, accs) => {
    accounts = accs;
});
contract("ERC720", async () => {
    it('should approve the sablier token', async () => {
        var receipt = await Token.methods.approve(Sablier.options.address, new bigNumber(100000000000000000000000000000)).send({
            gas: 8000000
        })
        // console.log('receipt: ', receipt.events.Approval.returnValues)
    })
})
contract("RemCare", async () => {

    it('should init remcare', async () => {
        var receipt = await RemCare.methods.initialize().send({
            gas: 8000000
        })
        // console.log('receipt init: ', receipt)
    })

    it('should create a stream', async () => {
        var tokenAmount = new bigNumber(5000)
        var decimals = await Token.methods.decimals().call({
            gas: 8000000
        })
        tokenAmount = tokenAmount.multipliedBy(new bigNumber(10).pow(decimals))
        startDate = new bigNumber(new Date((new Date().setSeconds(new Date().getSeconds() + 220))).getTime()).toFixed()
        endDate = new bigNumber(new Date(new Date().setDate(new Date().getDate() + 5)).getTime()).toFixed() //5 days from now
        startDate = Math.round(startDate / 1000)
        endDate = Math.round(endDate / 1000)
        console.log('startDate: ', startDate)
        console.log('endDate: ', endDate)
        var timeDelta = new bigNumber(endDate - startDate).toFixed()
        deposit = calculateDeposit(timeDelta, tokenAmount)
        console.log('deposit: ', deposit)
    })

    it('should start a new stream', async function () {
        var receipt = await Sablier.methods.createStream(accounts[1], deposit, Token.options.address, startDate, endDate).send({
            gas: 8000000,
            from: accounts[0]
        });
        console.log('startStream: ', receipt.events.CreateStream.returnValues.streamId)
        streamId = receipt.events.CreateStream.returnValues.streamId
    })
    it('should create a new dontaion', async () => {
        var parcelCount =Math.round(Math.random() * 1000213)
        console.log("parcelCount: ",parcelCount)
        var receipt = await RemCare.methods.donate(accounts[1], Token.options.address, deposit, streamId, parcelCount).send({
            gas: 8000000
        })
          console.log('receipt: ', receipt.events.NewDonation.returnValues)
        donationId = receipt.events.NewDonation.returnValues.id
    })
    it('should redeem a new parcel', async () => {
       var id= cryptoRandomString({length: 10});

        var receipt = await RemCare.methods.redeemParcel(donationId, web3.utils.toHex(id)).send({
            gas: 8000000
        })
        console.log('receipt: ', receipt)
    })
    it('should get donation balance', async () => {
        balance = await Sablier.methods.balanceOf(streamId, accounts[1]).call({
            gas: 8000000,
            from: accounts[0]
        });
        console.log('balance: ', balance)
    })
    it('should stop donation streaming', async () => {
        var stoped = await Sablier.methods.cancelStream(streamId).send({
            gas: 800000
        })
    })

    it('should get all donation keys', async () => {
        keys = await RemCare.methods.getDonationKeys().call({
            gas: 8000000
        })
        console.log('keys: ', keys)
        assert.strictEqual(keys.length > 0, true)
    })
    it('should get all donations based on keys', async () => {
        keys.map(async (key) => {
            var donation = await RemCare.methods.getDonation(key).call({
                gas: 8000000
            })
            console.log('donation: ', donation)
            assert.strictEqual(donation !== null, true)
        })
    })
    it('should get all receipient keys', async () => {
        keys = await RemCare.methods.getReceipientKeys().call({
            gas: 8000000
        })
        console.log('keys receipients: ', keys)
        assert.strictEqual(keys.length > 0, true)
    })
    it('should get all receipient based on keys', async () => {
        keys.map(async (key) => {
            var receipient = await RemCare.methods.v(key).call({
                gas: 8000000
            })
            console.log('receipient: ', receipient)
            assert.strictEqual(receipient !== null, true)
        })
    })

})

function calculateDeposit(delta, deposit) {
    var diff = deposit.minus(deposit.minus(deposit.mod(delta)))
    deposit = new bigNumber(deposit).minus(diff)
    console.log("deposit.toFixed(): ", deposit.toFixed())
    return deposit.toFixed()
}