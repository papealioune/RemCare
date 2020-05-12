<template>
<!-- App.vue -->

<v-app>
    <v-app-bar app>
        <v-toolbar-title id="appName" :ripple="{ center: true }">
            RemCare
        </v-toolbar-title>
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-content>

        <!-- Provides the application the proper gutter -->
        <v-container fluid>
            <template>
                <v-card>
                    <v-tabs background-color="white" color="orange" right>
                        <v-tab>Donate</v-tab>
                        <v-tab>My Donations</v-tab>
                        <v-tab-item>
                            <v-container fluid>
                                <v-row>
                                    <v-col v-for="(center ,$index) in $store.state.communityCenters" :key="$index" cols="12" md="4" :items="$store.state.centerCenters">
                                        <template>
                                            <v-card class="mx-auto" max-width="400">
                                                <v-img class="white--text align-end" height="200px" :src="center.avatar">
                                                    <v-card-title>{{center.center_name}}</v-card-title>
                                                </v-img>
                                                <v-card-subtitle class="pb-0">Phone Number</v-card-subtitle>
                                                <v-card-text class="text--primary">
                                                    <div>{{ center.center_phone_number }}</div>
                                                </v-card-text>
                                                <v-card-subtitle class="pb-0">City</v-card-subtitle>
                                                <v-card-text class="text--primary">
                                                    <div>{{ center.center_city }}</div>
                                                </v-card-text>
                                                <v-card-subtitle class="pb-0">Eth-Address</v-card-subtitle>
                                                <v-card-text class="text--primary">
                                                    <div>{{ center.center_eth_address }}</div>
                                                </v-card-text>
                                                <v-card-subtitle class="pb-0">About</v-card-subtitle>
                                                <v-card-text class="text--primary">
                                                    <div>{{ center.center_description }}</div>
                                                </v-card-text>
                                                <v-card-actions>
                                                    <v-btn color="orange" text @click="donate(center)">
                                                        Donate
                                                    </v-btn>
                                                </v-card-actions>
                                            </v-card>
                                        </template>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-tab-item>
                        <v-tab-item>
                            <v-container fluid>
                                <v-row>
                                    <v-col v-for="(center ,$index) in $store.state.streams" :key="$index" cols="12" md="4" :items="$store.state.centerCenters">
                                        <template>
                                            <v-card class="mx-auto" max-width="400">
                                                <v-img class="white--text align-end" height="200px" :src="center.avatar">
                                                    <v-card-title>{{center.receipient}}</v-card-title>
                                                </v-img>
                                                <v-card-subtitle class="pb-0">Deposit</v-card-subtitle>
                                                <v-card-text class="text--primary">
                                                    <div>{{ center.deposit }}</div>
                                                </v-card-text>
                                                <v-card-subtitle class="pb-0">Token Address</v-card-subtitle>
                                                <v-card-text class="text--primary">
                                                    <div>{{ center.tokenAddress }}</div>
                                                </v-card-text>
                                                <v-card-subtitle class="pb-0">Donation Start Date</v-card-subtitle>
                                                <v-card-text class="text--primary">
                                                    <div>{{ new Date(center.startTime*1000).toString() }}</div>
                                                </v-card-text>
                                                <v-card-subtitle class="pb-0">Donation End Date</v-card-subtitle>
                                                <v-card-text class="text--primary">
                                                    <div>{{ new Date(center.stopTime*1000).toString() }}</div>
                                                </v-card-text>
                                                <v-card-subtitle class="pb-0">Remaining Balance</v-card-subtitle>
                                                <v-card-text class="text--primary">
                                                    <div>{{ center.remainingBalance }}</div>
                                                </v-card-text>
                                                <v-card-subtitle class="pb-0">Per Second</v-card-subtitle>
                                                <v-card-text class="text--primary">
                                                    <div>{{ center.ratePerSecond }}</div>
                                                </v-card-text>
                                                <v-card-actions>
                                                    <v-btn color="orange" text @click="confirm()">
                                                        Revoke Donation
                                                    </v-btn>
                                                </v-card-actions>
                                            </v-card>
                                        </template>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-tab-item>
                    </v-tabs>
                </v-card>
            </template>
            <DonateModal />
            <ConfirmDonationRevoke />
        </v-container>
    </v-content>
</v-app>
</template>

<script>
import DonateModal from './views/DonateModal';
import ConfirmDonationRevoke from './components/ConfirmDonationRevoke'
import request from 'request'
import swal from 'sweetalert2'
import bigNumber from 'bignumber.js'
export default {
    components: {
        DonateModal,
        ConfirmDonationRevoke
    },
    data() {
        return {
            centerCenters: {},
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init: async function () {
            console.log(this.$store.state.onReady)
            this.$store.state.embarkJs.onReady((error) => {
                if (error) {
                    this.error("Metamask not detected")
                } else {
                    let _this = this
                    _this.loadStreams() 
                    request({
                        method: 'GET',
                        uri: 'http://localhost:3000/api/v1/centers'
                    }, function (error, response, body) {
                        console.log('error: ', error, ' response: ', response, ' body: ', body)
                        body = JSON.parse(body)
                        var centers = (body.centers)
                        console.log(centers)
                        centers = centers.map((center) => {
                            center.avatar = `http://identicon-1132.appspot.com/${Math.floor(Math.random()*1000)}`
                            return center
                        })
                        _this.$store.state.communityCenters = centers
                    })
                }
            })

        },
        loadStreams() {
            let This = this
            This.$store.state.streams = []
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
                                    avatar: `http://identicon-1132.appspot.com/${Math.floor(Math.random()*1000)}`,
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
        },
        donate(center) {
            this.$store.state.donateModal = true
            this.$store.state.centerToDonate = center
        },
        confirm() {
            this.$store.state.confirmDonationRevoke = true
        },
        error(message) {
            swal.fire("Error", message, "error")
        },
        success(message) {
            swal.fire("Success", message, "success")
        }
    }
}
</script>

<style>
#appName {
    font-size: 30px;
    color: coral;
}
</style>
