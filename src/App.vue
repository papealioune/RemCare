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
            <!-- If using vue-router -->
            <router-view></router-view>
            <v-bottom-navigation :value="activeBtn" fixed color="orange lighten-2" absolute  hide-on-scroll scroll-threshold="500" horizontal>
                <v-btn v-for="(option,i) in options" :key="i" :to="option.to">
                    <span>{{ option.text }}</span>
                </v-btn>

            </v-bottom-navigation>
        </v-container>
    </v-content>
</v-app>
</template>

<script>
//import PatientView from 'component/PatientView';

export default {
    data() {
        return {
            activeBtn: 0,
            options: [{
                    text: "Center",
                    to: "/center"
                },
                {
                    text: "Community Centers",
                    to: "/communitycenters"
                },
                {
                    text: "Vendor",
                    to: "/vendor"
                },
                {
                    text: "History",
                    to: "/history"
                }
            ]
        }
    },
}
</script>

<style>
#appName {
    font-size: 30px;
    color: coral;
}
</style>
