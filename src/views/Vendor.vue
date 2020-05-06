<template>
<v-container fluid>
    <v-toolbar color="#ff954f">
        <v-toolbar-title>Registered Vendors</v-toolbar-title>
        <v-spacer></v-spacer>
    </v-toolbar>
    <v-row>
        <v-col cols="12">
            <v-card>
                <v-container fluid>
                    <v-row>
                        <v-col v-for="n in 9" :key="n" class="child-flex" cols="2">
                            <v-card class="mx-auto" max-width="400">
                                <v-img class="black--text align-end" height="200px" src="https://empoweringcpo.com/wp-content/uploads/2017/04/how-to-negotiate-with-courier-and-small-parcel-vendors.jpg">
                                    <v-card-title>Vendor Name</v-card-title>
                                </v-img>
                                <v-card-text class="text--primary">
                                    <v-icon>contact_phone</v-icon> Phone Number: +1029301231 <br>
                                    <v-icon>location_city</v-icon> City: City Name <br>
                                    <v-icon>satellite</v-icon> Country: Country <br>
                                </v-card-text>
                                <v-card-actions>
                                    <v-btn color="orange" text @click="showOnMap(n)">
                                        View On Map
                                    </v-btn>
                                    <v-btn color="orange" text>
                                        Donate
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card>
        </v-col>
    </v-row>
    <popupMap />
</v-container>
</template>

<script>
import popupMap from './MapViewPopup.vue'
export default {
    components: {
        popupMap
    },
    methods: {
        showOnMap(vendor) {
            this.$store.state.selectedVendor.push(vendor)
            this.$store.state.showOnMap = true
        }
    }
}
</script>

<style scoped>

</style>
