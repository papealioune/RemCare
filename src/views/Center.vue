<template>
<v-container fluid>
    <v-app-bar color="#ff954f">
        <v-toolbar-title>Menu</v-toolbar-title>
    </v-app-bar>
    <v-card>
        <v-tabs background-color="white" color="#ff954f accent-4" right>
            <v-tab key="0">Register Center</v-tab>
            <v-tab key="1">Donate</v-tab>
            <v-tab-item key="0">
                <v-stepper v-model="register" horizontal>
                    <v-row>
                        <v-col cols="12" md="4">
                            <v-stepper-step :complete="register > 1" step="1">Enter your phone number</v-stepper-step>
                            <v-stepper-content step="1">
                                <v-card color="grey lighten-1" class="mb-12" height="200px">
                                    <v-card-text>
                                        <v-row>
                                            <v-col cols="4">
                                                <v-select :items="countryCodes" :rules="countryCodeRules" label="Code" v-model="countryCode" />
                                            </v-col>
                                            <v-col cols="8">
                                                <v-text-field label="Phone Number" v-model="cellNumber" :rules="centerPhoneRules" />
                                            </v-col>
                                        </v-row>
                                    </v-card-text>
                                </v-card>
                                <v-btn v-if="countryCode && cellNumber" @click="getCityList()">Continue</v-btn>
                            </v-stepper-content>
                        </v-col>

                        <v-col cols="12" md="4">
                            <v-stepper-step :complete="register > 2" step="2">Enter the center name</v-stepper-step>
                            <v-stepper-content step="2">
                                <v-card color="grey lighten-1" class="mb-12" height="200px">
                                    <v-card-text>
                                        <v-text-field label="Name" v-model="centerName" />
                                    </v-card-text>
                                </v-card>
                                <v-btn @click="register = 3">Continue</v-btn>
                            </v-stepper-content>
                        </v-col>

                        <v-col cols="12" md="4">
                            <v-stepper-step :complete="register > 3" step="3">Select Province/City</v-stepper-step>
                            <v-stepper-content step="3">
                                <v-card color="grey lighten-1" class="mb-12" height="200px">
                                    <v-card-text>
                                        <v-select :items="cities" label="Province" v-model="selectedCity" />
                                    </v-card-text>
                                </v-card>
                                <v-btn v-if="selectedCity" @click="register = 4">Continue</v-btn>
                                <v-btn text>Back</v-btn>
                            </v-stepper-content>
                        </v-col>

                        <v-col cols="12" md="4">
                            <v-stepper-step :complete="register > 4" step="4">Enter Verification Code</v-stepper-step>
                            <v-stepper-content step="4">
                                <v-card color="grey lighten-1" class="mb-12" height="200px">
                                    <v-card-text>
                                        <v-text-field label="OTP Code" v-model="verificationCode" :rules="verificationRules" />
                                    </v-card-text>
                                </v-card>
                                <v-btn v-if="verificationCode" @click="verifyCode">Continue</v-btn>
                                <v-btn text>Back</v-btn>
                            </v-stepper-content>
                        </v-col>

                    </v-row>
                </v-stepper>
            </v-tab-item>
            <v-tab-item key="1">
                <v-stepper v-model="donate" vertical>
                    <v-row>

                        <v-col cols="12" md="4">
                            <v-stepper-step :complete="donate > 1" step="1">Select Province/City</v-stepper-step>
                            <v-stepper-content step="1">
                                <v-card color="grey lighten-1" class="mb-12" height="200px">
                                    <v-card-text>
                                        <v-select :items="cities" label="Province" v-model="selectedCity" />
                                    </v-card-text>
                                </v-card>
                                <v-btn v-if="selectedCity" @click="getCityVendors">Continue</v-btn>
                                <v-btn text>Back</v-btn>
                            </v-stepper-content>
                        </v-col>

                        <v-col cols="12" md="4">
                            <v-stepper-step :complete="donate > 2" step="2">Select Vendor</v-stepper-step>
                            <v-stepper-content step="2" width="1000" fluid>
                                <v-card color="grey lighten-1" class="mb-12" height="200px">
                                    <v-card-text>
                                        <v-select :items="vendors" label="Vendor" v-model="selectedVendor" />
                                        <v-select :items="parcels" label="Parcel" v-model="selectedParcel" />
                                        <v-btn v-if="selectedVendor" @click="viewVendor()">View on Map</v-btn>
                                        <v-btn v-if="selectedParcel" @click="viewParcels()">Parcels</v-btn>
                                    </v-card-text>
                                </v-card>
                                <v-btn v-if="selectedParcel && selectedVendor" @click="donate = 3">Continue</v-btn>
                                <v-btn @click="donate > 1">Cancel</v-btn>
                            </v-stepper-content>
                        </v-col>

                        <v-col cols="12" md="4">
                            <v-stepper-step :complete="donate > 3" step="3">Select Community Center</v-stepper-step>
                            <v-stepper-content step="3" width="1000" fluid>
                                <v-card color="grey lighten-1" class="mb-12" height="200px">
                                    <v-card-text>
                                        <v-select :items="centers" label="Center" v-model="selectedCenter" />
                                        <v-btn v-if="selectedCenter">View on Map</v-btn>
                                        <v-btn v-if="selectedCenter">View Parcels</v-btn>
                                    </v-card-text>
                                </v-card>
                                <v-btn v-if="selectedCenter" @click="selectCenter">Continue</v-btn>
                                <v-btn @click="donate > 1">Cancel</v-btn>
                            </v-stepper-content>
                        </v-col>

                        <v-col cols="12" md="4">
                            <v-stepper-step :complete="donate > 4" step="4">Payment</v-stepper-step>
                            <v-stepper-content step="4" width="1000" fluid>
                                <v-card color="grey lighten-1" class="mb-12" height="200px">
                                    <v-card-text>
                                        <v-select :items="vendors" label="Vendors" v-model="selectedVendor" />
                                        <v-btn v-if="selectedVendor">View on Map</v-btn>
                                        <v-btn v-if="selectedVendor">View Parcels</v-btn>
                                    </v-card-text>
                                </v-card>
                                <v-btn v-if="selectedParcel && selectedVendor" @click="selectCenter">Continue</v-btn>
                                <v-btn @click="donate > 1">Cancel</v-btn>
                            </v-stepper-content>
                        </v-col>
                    </v-row>
                </v-stepper>
            </v-tab-item>
        </v-tabs>
    </v-card>
    <ethAddressModal />
    <!-- <vendorMapPopup /> -->
    <parcelsListPopup />
</v-container>
</template>

<script>
import countriesApi from "countries-api";
import ethAddressModal from '../components/EthAddressModal'
//import vendorMapPopup from '../components/VendorMapPopup'
import parcelsListPopup from '../components/ParcelsListPopup'
import citiesAPI from 'full-countries-cities'
export default {
    components: {
        ethAddressModal,
        //vendorMapPopup,
        parcelsListPopup
    },
    data: () => ({
        register: 1,
        donate: 1,
        centerName: "",
        tab: null,
        cities: [],
        parcels:[],
        centers: [],
        vendors: [],
        countries: [],
        cellNumber: "",
        countryCodes: [],
        countryCode: "",
        selectedCity: "",
        selectedParcel: "",
        selectedCenter: "",
        selectedVendor: "",
        selectedCountry: "",
        countriesInfos: [],
        registeredVendor: [],
        countryCodeRules: [
            v => !!v || "Country Code Required",
            v => (v && v.length > 0) || "Country Code cannot be empty"
        ],
        amountRules: [],
        verificationRules: [value => !!value || 'Required.',
            value => (value || '').length <= 6 || 'Verifcation code is 6 characters long',
        ],
        centerPhoneRules: [
            value => !!value || 'Required.',
            value => (value || '').length <= 13 || 'Max 20 characters',
        ],
        nearestCity: '',
        verificationCode: ''
    }),
    beforeMount() {
        this.getCountryList();
    },
    methods: {
        getCityList() {
            if (this.countryCode) {
                var country = this.countriesInfos.filter((country) => {
                    return country.code === this.countryCode
                })
                this.selectedCountry = country[0].name
                var cities = citiesAPI.getCities(this.selectedCountry); // Returns an array of city names of the 
                this.cities = cities
                this.register++
            }
        },
        getCityVendors() {
            this.vendors = require('../json/vendors.json').map((vendor) => {
                return {
                    name: vendor.properties.city,
                    parcels: []
                }
            })
        },
        getCountryList() {
            var countries = countriesApi.findByRegion("Africa");
            countries.data.forEach(country => {
                this.countriesInfos.push({
                    "name": country.name.common,
                    "code": "+" + country.callingCode[0]
                })
                this.countries.push(country.name.common);
                this.countryCodes.push("+" + country.callingCode[0]);
            })
        },
        selectCountryUsingCode(code) {
            this.selectedCountry = this.countries[this.countryCodes.indexOf(code)];
        },
        selectCodeUsingCountry(country) {
            this.countryCode = this.countryCodes[this.countries.indexOf(country)];
        },
        showEthAddress(center) {
            this.centerToRegister = center
            this.$store.state.ethAddressModal = true
        },
        verifyCode() {
            this.register++
        },
        viewVendor(vendors) {
            //@dev use selectedVendor to show 
            this.selectedVendor = vendors
            this.$store.state.vendorMapPopup = true
        },
        viewParcels(parcels) {
            //@dev show parcel popup 
            // must show a list of card with parcle info eg. name and picture and price
            // allow user to select quatity and update the total cost and estimated cost of delivery to center
            this.selectedParcel = parcels
            this.$store.state.parcelsListPopup = true
        },
        vendorListByCity() {}
    }
}
</script>
