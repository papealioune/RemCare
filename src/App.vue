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
                        <v-tab-item >
                            <v-container fluid>
                                <v-row>
                                    <v-col v-for="(community ,$index) in communityCenter" :key="$index" cols="12" md="4" :items="$store.state.communityCenter">
                                        <template>
                                            <v-card class="mx-auto" max-width="400">
                                                <v-img class="white--text align-end" height="200px" src="https://cdn.vuetifyjs.com/images/cards/docks.jpg">
                                                    <v-card-title>{{ community.name }}</v-card-title>
                                                </v-img>
                                                <v-card-subtitle class="pb-0">Phone Number</v-card-subtitle>
                                                <v-card-text class="text--primary">
                                                    <div>{{ community.phoneNumber }}</div>
                                                </v-card-text>
                                                 <v-card-subtitle class="pb-0">City</v-card-subtitle>
                                                <v-card-text class="text--primary">
                                                    <div>{{ community.city }}</div>
                                                </v-card-text>
                                                    <v-card-subtitle class="pb-0">About</v-card-subtitle>
                                                <v-card-text class="text--primary">
                                                    <div>{{ community.about }}</div>
                                                </v-card-text>
                                                <v-card-actions>
                                                    <v-btn color="orange" text @click="donate()">
                                                        Donate
                                                    </v-btn>
                                                </v-card-actions>
                                            </v-card>
                                        </template>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-tab-item>
                        <v-tab-item >
                            <v-container fluid>
                                <v-row>
                                    <v-col v-for="(community ,$index) in communityCenter" :key="$index" cols="12" md="4" :items="$store.state.communityCenter">
                                        <template>
                                            <v-card class="mx-auto" max-width="400">
                                                <v-img class="white--text align-end" height="200px" src="https://cdn.vuetifyjs.com/images/cards/docks.jpg">
                                                    <v-card-title>Community center name</v-card-title>
                                                </v-img>
                                                <v-card-subtitle class="pb-0">Phone Number</v-card-subtitle>
                                                <v-card-text class="text--primary">
                                                    <div>{{ community.phoneNumber }}</div>
                                                </v-card-text>
                                                 <v-card-subtitle class="pb-0">City</v-card-subtitle>
                                                <v-card-text class="text--primary">
                                                    <div>{{ community.city }}</div>
                                                </v-card-text>
                                                    <v-card-subtitle class="pb-0">About</v-card-subtitle>
                                                <v-card-text class="text--primary">
                                                    <div>{{ community.about }}</div>
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
            <DonateModal/>
            <ConfirmDonationRevoke />
        </v-container>
    </v-content>
</v-app>
</template>

<script>
import DonateModal from './views/DonateModal';
import ConfirmDonationRevoke from './components/ConfirmDonationRevoke'

export default {
    components:{
        DonateModal,
        ConfirmDonationRevoke
    },
    data() {
        return {
            communityCenter: {},
        }
    },
    beforeMount() {
        this.filterCommunity();
    },
    methods: {
        filterCommunity($state) {
            this.communityCenter = this.$store.state.communityCenter
            $state.complete();
        },
        donate() {
            this.$store.state.donateModal = true
        },
        confirm() {
            this.$store.state.confirmDonationRevoke = true
        },
    }
}
</script>

<style>
#appName {
    font-size: 30px;
    color: coral;
}
</style>
