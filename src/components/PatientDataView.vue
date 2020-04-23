<template>
    <v-col>
    <v-app-bar
      color="#ff954f"
    >
      <v-toolbar-title>Patient View</v-toolbar-title>
      <v-spacer />
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search patient by ID"
        single-line
        hide-details
      />
    </v-app-bar>

    <loading
      :active.sync="isLoading"
      :is-full-page="true"
    />
    <infinite-loading @infinite="filterPatients" />
    <requestDataModal />
  </v-col>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading';
import Loading from 'vue-loading-overlay';

import requestDataModal from './RequestDataModal'

export default {
    components: {
        Loading,
        InfiniteLoading,
        requestDataModal
    },
    data() {
        return {
            patients: [],
            isLoading: false,
        }
    },
    // beforeMount() {
    //     this.filterPatients();
    // },
    // methods: {
    //     filterPatients($state) {
    //         $state.loaded();
    //         this.patients = this.$store.state.registeredPatients.filter((patient) => {
    //             return patient.center === this.$store.state.selectedCenter && patient.allowed
    //         })
    //         $state.complete();
    //     },
    //     requestData(patient) {
    //         this.patientDataToRequest = patient
    //         this.$store.state.showPatientDataModal = true
    //     },
    //     search(){

    //     }
    // },
}
</script>