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
                <v-stepper v-model="e6" vertical>
                    <v-row>
                        <v-col
                        cols="12"
                        md="4"
                        >
                        <v-stepper-step :complete="e6 > 1" step="1">Enter your phone number</v-stepper-step>
                        <v-stepper-content step="1">
                        <v-card color="grey lighten-1" class="mb-12" height="200px">
                            <v-card-text>
                            <v-row>
                                <v-col cols="4">
                                <v-select
                                    :items="countryCodes"
                                    :rules="countryCodeRules"
                                    label="Code"
                                    v-model="countryCode"
                                />
                                </v-col>
                                <v-col cols="8">
                                <v-text-field
                                    label="Phone Number"
                                    v-model="cellNumber"
                                    :rules="centerPhoneRules"
                                />
                                </v-col>
                            </v-row>
                            </v-card-text>
                        </v-card>
                        <v-btn @click="e6 = 2">Continue</v-btn>
                        <v-btn text>Cancel</v-btn>
                        </v-stepper-content>
                        </v-col>

                        <v-col
                        cols="12"
                        md="4"
                        >
                        <v-stepper-step :complete="e6 > 2" step="2">Select Province/City</v-stepper-step>
                        <v-stepper-content step="2">
                        <v-card color="grey lighten-1" class="mb-12" height="200px">
                            <v-card-text>
                            <v-select
                                :items="city"
                                label="Province"
                                v-model="selectedCity"
                            />
                            </v-card-text>
                        </v-card>
                        <v-btn @click="e6 = 3">Continue</v-btn>
                        <v-btn text>Cancel</v-btn>
                        </v-stepper-content>
                        </v-col>

                        <v-col
                        cols="12"
                        md="4"
                        >
                        <v-stepper-step :complete="e6 > 3" step="3">Select Nearest City</v-stepper-step>
                        <v-stepper-content step="3">
                        <v-card color="grey lighten-1" class="mb-12" height="200px">
                            <v-card-text>
                            <v-select
                                :items="countries"
                                label="Country"
                                v-model="selectedCountry"
                            />
                            </v-card-text>
                        </v-card>
                        <v-btn @click="showEthAddress()">Continue</v-btn>
                        <v-btn text>Cancel</v-btn>
                        </v-stepper-content>
                        </v-col>
                    </v-row>
                </v-stepper>
            </v-tab-item>
            <v-tab-item key="1">
                <v-container fluid>
                    <v-row>
                        <v-col v-for="i in 6" :key="i" cols="12" md="4">
                            <v-img :src="`https://picsum.photos/500/300?image=${i * i * 5 + 10}`" :lazy-src="`https://picsum.photos/10/6?image=${i * n * 5 + 10}`" aspect-ratio="1"></v-img>
                        </v-col>
                    </v-row>
                </v-container>
            </v-tab-item>
        </v-tabs>
    </v-card>
    <ethAddressModal />
</v-container>
</template>

<script>
import countriesApi from "countries-api";
import ethAddressModal from '../components/EthAddressModal'

export default {
    components: {
        ethAddressModal
    },
    data: () => ({
        e6: 1,
        tab: null,
        city: [],
        countries: [],
        cellNumber: "",
        countryCodes: [],
        countryCode: "",
        selectedCity: "",
        selectedCountry: "",
        countryCodeRules: [
            v => !!v || "Country Code Required",
            v => (v && v.length > 0) || "Country Code cannot be empty"
        ],
        centerPhoneRules: [
          value => !!value || 'Required.',
          value => (value || '').length <= 13 || 'Max 20 characters',
        ],
        nearestCity: '',
        choices: [{
                title: "Register Center",
                text: "",
                btn: "Register",
                to: "/centerdatarequest"
            },
            {
                title: "Donation",
                text: "",
                btn: "Donate",
                to: "/centersview"
            }
        ],
    }),
    beforeMount() {
        //this.getCityList();
        this.getCountryList();
    },
    methods: {
        // getCityList() {
        //     let city = city.match();
        //     const cities = require('all-the-cities');
        //     cities.filter(city => city.name());
        //     this.city.push(city.name)
        // },
        getCountryList() {
            var countries = countriesApi.findByRegion("Africa");
            countries.data.forEach(country => {
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
    }
}
</script>