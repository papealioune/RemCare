<template>
<v-row justify="center">
    <v-dialog v-model="$store.state.donateModal" height="600">
        <v-card height="600">
            <v-card-title class="headline">Donation Form</v-card-title>

            <v-form height="600" ref="form" v-model="valid" lazy-validation>
                <v-text-field v-model="tokenAmount" :rules="tokenAmountRules" label="Amount" required></v-text-field>
                <v-select v-model="selectedToken" :hint="`${selectedToken.tokenName}, ${selectedToken.tokenAddress}`" :items="$store.state.tokens" item-text="tokenName" item-value="tokenName" label="Select Token" persistent-hint return-object single-line></v-select>
                <v-label> Donation Start Date </v-label>
                <datetime type="datetime" v-model="startDate" title="Donation Start Date"></datetime>
                <v-label> Donation End Date </v-label>
                <datetime type="datetime" v-model="endDate" title="Donation End Date"></datetime>
            </v-form>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="orange" text @click="$store.state.donateModal = false">
                    Close
                </v-btn>
                <v-btn v-if="valid" color="orange" text @click="donate()">
                    Donate
                </v-btn>
            </v-card-actions>
        </v-card>
        <loading :active.sync="isLoading" :can-cancel="false" :is-full-page="true"></loading>
    </v-dialog>
</v-row>
</template>

<script>
import utils from 'web3-utils'
import bigNumber from 'bignumber.js'
import swal from 'sweetalert2'
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import request from 'request'
export default {
    components: {
        Loading
    },
    data() {
        return {
            donateModal: false,
            isLoading: false,
            startDate: new Date().toISOString().substr(0, 10),
            endDate: new Date().toISOString().substr(0, 10),
            selectedToken: {
                "tokenName": "xDAI",
                "tokenAddress": "0x02e0c2F0F34cBC6A752630C8C46239D7986f3789"
            },
            valid: true,
            tokenAmount: 0,
            tokenAmountRules: [
                v => !!v || 'Amount is required',
                v => (v && !isNaN(v) && parseInt(v) > 0) || 'Amount  must be a valid number and greater than 0'
            ],
            tokenAddressRules: [
                v => !!v || 'Token address is required',
                v => (v && utils.isAddress(v)) || 'Invalid token address'
            ],
            parcelCount: Math.round(Math.random() * 1000) + 10
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {

        },
        donate: async function () {
            //@dev create token object list on the store with the following format {tokenName: xDAI,tokenAddress: 0x01923kljslkdj}
            this.isLoading = true
            var receipt = await this.approve()
            await this.startDonationStream()
            console.log('receipt: ', receipt)
        },
        calculateDeposit(delta, deposit) {
            console.log('delta: ', delta)
            let diff = deposit.minus(deposit.minus(deposit.mod(delta)))
            deposit = new bigNumber(deposit).minus(diff)
            console.log('deposit after: ', deposit.toFixed())
            return deposit.toFixed()
        },
        approve: async function () {
            this.isLoading = true
            let This = this
            console.log('tokenAddress: ', web3.eth.defaultAccount)
            this.startDate = new bigNumber((parseInt(new Date(this.startDate).getTime()) / 1000)).toFixed()
            this.endDate = new bigNumber((parseInt(new Date(this.endDate).getTime()) / 1000)).toFixed()
            if (this.endDate <= this.startDate) {
                this.error('Start and end date must differ, start date must be earlier than end date')
            } else {
                var timedelta = new bigNumber(this.endDate - this.startDate)
                console.log('timeDelata: ', timedelta)
                var newToken = new web3.eth.Contract(this.$store.state.erc20, this.selectedToken.tokenAddress, {
                    from: web3.eth.defaultAccount,
                    gasPrice: 1000000000000
                })
                var userBalance = await newToken.methods.balanceOf(web3.eth.defaultAccount).call({
                    gas: 8000000
                })
                userBalance = new bigNumber(userBalance).toFixed()
                var decimals = await newToken.methods.decimals().call({
                    gas: 8000000
                })
                console.log('token decimals: ', decimals, ' tokenAount: ', this.tokenAmount)
                this.tokenAmount = new bigNumber(this.tokenAmount).multipliedBy(new bigNumber(10).pow(decimals))
                console.log('tokenAmount: ', this.tokenAmount)
                this.tokenAmount = this.calculateDeposit(timedelta, this.tokenAmount)
                console.log('timedelta: ', timedelta, ' tokenAmount: ', this.tokenAmount)
                console.log('endDate: ', this.endDate, ' startDate: ', this.startDate)
                console.log('selected end datetime: ', this.endDate)
                console.log('tokenAmount: ', this.tokenAmount)
                console.log('userBalance: ', userBalance, ' this.$store.state.sablier.options.address: ', this.$store.state.sablier.options.address)
                if (userBalance >= this.tokenAmount) {
                    newToken.methods.approve(this.$store.state.sablier.options.address, this.tokenAmount).send({
                        gas: 800000
                    }).then((results, error) => {
                        console.log('results: ', results, ' error: ', error)
                        if (error) {
                            This.error(
                                'Something went wrong whilst approving sablier contract to spend tokens'
                            )
                            This.isLoading = false;
                        } else {
                            this.isLoading = false
                            this.e6++
                        }
                    })
                } else {
                    this.error('Seems like you dont have enough tokens')
                    this.isLoading = false
                }
                console.log('newToken: ', newToken)
            }
        },
        startDonationStream() {
            this.isLoading = true
            let This = this
            console.log('startDate: ', this.startDate, ' endDate: ', this.endDate)
            this.$store.state.sablier.methods.createStream(this.$store.state.centerToDonate.center_eth_address.trim(), This.tokenAmount, This.selectedToken.tokenAddress.trim(),
                This.startDate, This.endDate).send({
                gas: 8000000
            }).then(async (results, error) => {
                if (error) {
                    This.error('Something went wrong whilst creating stream')
                    this.isLoading = false
                } else {
                    console.log('streamId: ', results.events.CreateStream.returnValues.streamId)
                    await this.logDonation(results.events
                        .CreateStream.returnValues.streamId)
                    console.log('receipt: ', results)
                }
            }).catch((error) => {
                console.log('Error whilst creating stream: ', error)
                This.error('Something went wrong whilst creating stream')
                This.isLoading = false;
            })
        },
        logDonation: async function (streamId) {
            this.$store.state.remCare.methods.donate(this.$store.state.centerToDonate.center_eth_address.trim(), this.selectedToken.tokenAddress.trim(), this.tokenAmount, streamId, this.parcelCount).send({
                gas: 8000000
            }).then(async (results, error) => {
                if (error) {
                    this.isLoading = false;
                } else {
                    await this.storeOnServer(results.events.NewDonation.returnValues.id)
                    await this.loadStreams()
                    this.isLoading = false;
                    this.success('Succesfully Donated :)')

                }
            }).catch((error) => {
                console.log('Error whilst adding to stream manager', error)
                this.error('Something went wrong whilst loggin donation')
                this.isLoading = false
            })
        },
        storeOnServer: async function (donationId) {
            request({
                method: 'POST',
                uri: 'http://localhost:3000/api/v1/centers/update',
                json: {
                    "receipient": this.$store.state.centerToDonate.center_eth_address.trim(),
                    "eth_address": web3.eth.defaultAccount,
                    "donationId": donationId
                }
            }, function (error, response, body) {
                console.log('error: ', error, ' response: ', response, ' body: ', body)
            })
        },
        setEndDate() {
            this.endDate = new bigNumber((parseInt(new Date(this.endDate).getTime()) / 1000)).toFixed()
            if (!this.checkDate(this.endDate)) {
                this.error("End Date must be greater than the current time and date")
            } else if (this.startDate === this.endDate) {
                this.error("Start and End Date must not be equal")
            } else {
                this.e6++
            }
        },
        toPrecision(number) {
            var preciseNumber = (number).toLocaleString('fullwide', {
                useGrouping: false
            })
            console.log('preciseNumber: ', preciseNumber)
            return preciseNumber
        },
        errorBlock(message) {
            swal.fire({
                title: 'Error',
                icon: 'error',
                text: message,
                showCloseButton: false,
                showCancelButton: false
            })
        },
        checkDate(date) {
            var now = new bigNumber(new Date().getTime() / 1000).toFixed()
            console.log("date>now: ", date > now, " now: ", now, " date: ", date)
            if (date > now) {
                return true
            } else {
                return false
            }
        },
        error(message) {
            swal.fire("Error", message, "error")
        },
        success(message) {
            swal.fire("Success", message, "success")
        },
        setStartDate() {
            this.startDate = new bigNumber((parseInt(new Date(this.startDate).getTime()) / 1000)).toFixed()
            if (this.checkDate(this.startDate)) {
                console.log('selected start datetime: ', this.startDate)
                this.e6++
            } else {
                this.error("Start Date must be greater than the current time and date")
            }
        },
        loadStreams: async function () {
            let This = this
            this.$store.state.streams = []
            this.$store.state.remCare.methods.getDonorStreamKeys().call({
                gas: 8000000
            }).then((ids, error) => {
                if (!error && ids && ids.length > 0) {
                    ids.map((id) => {
                        This.$store.state.sablier.methods.getStream(id).call({
                            gas: 8000000
                        }).then((stream, error) => {
                            if (!error) {
                                console.log('stream: ', stream)
                                This.$store.state.streams.push({
                                    "receipient": stream.recipient,
                                    "sender": stream.sender,
                                    "deposit": new bigNumber(stream.deposit).div(
                                        new bigNumber(10).pow(18)),
                                    "tokenAddress": stream.tokenAddress,
                                    "startTime": stream.startTime,
                                    "stopTime": stream.stopTime,
                                    "remainingBalance": new bigNumber(stream
                                        .remainingBalance).div(new bigNumber(10)
                                        .pow(18)),
                                    "ratePerSecond": stream.ratePerSecond,
                                    "id": id
                                })
                            }
                        })
                    })
                }
            })
        }
    },
}
</script>
