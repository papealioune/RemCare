<template>
    <v-row justify="center">
        <v-dialog v-model="$store.state.donateModal" max-width="500">
            <v-card>
                <v-card-title class="headline">Donation Form</v-card-title>

                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-text-field v-model="amount" :rules="tokenAmountRules" label="Amount" required></v-text-field>
                    <v-select v-model="selectedToken" :hint="`${selectedToken.tokenName}, ${selectedToken.abbr}`" :items="$store.state.tokens" item-text="tokenName" item-value="tokenAddress" label="Select Token" persistent-hint return-object single-line></v-select>
                    <datetime type="datetime" label="Start Date" v-model="startDate"></datetime>
                    <datetime type="datetime" label="End Date" v-model="endDate"></datetime>
                </v-form>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="orange" text @click="$store.state.donateModal = false">
                        Close
                    </v-btn>
                    <v-btn color="orange" text @click="donate()">
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


export default {
     components: {
        Loading
    },
    data() {
        return {
            donateModal: false,
            isLoading: false,
            startDate: '',
            endDate: '',
            selectedToken: {},
            valid: true,
            amount: 0,
            tokenAmountRules: [
                v => !!v || 'Amount is required',
                v => (v && !isNaN(v) && parseInt(v) > 0) || 'Amount  must be a valid number and greater than 0'
            ],
            tokenAddressRules: [
                v => !!v || 'Token address is required',
                v => (v && utils.isAddress(v)) || 'Invalid token address'
            ]
        }
    },
    // computed() {
    //     this.donate();
    // },
    methods: {
        donate() {
            //@dev create token object list on the store with the following format {tokenName: xDAI,tokenAddress: 0x01923kljslkdj}
            this.selectedToken = require('../json/token.json').map((token) => {
                return {
                    name: token.tokenName,
                    tokens:[]
                }
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
        }
    },
}
</script>
