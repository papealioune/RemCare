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
    <v-row
      align="center"
      justify="space-around"
    >
      <template>
        <v-card
            v-for="(patient ,$index) in patients"
            :key="$index"
            class="mx-auto"
            max-width="344"
            outlined
        >
            <v-list-item three-line>
            <v-list-item-content>
                <div class="overline mb-4">{{ patient.patient_name }}</div>
                <v-list-item-title class="headline mb-1">{{ patient.district }}</v-list-item-title>
                <v-list-item-subtitle>{{ patient.patient_id }}</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-avatar
                tile
                size="80"
                color="grey"
            ></v-list-item-avatar>
            </v-list-item>

            <v-card-actions>
            <v-btn
                color="deep-grey lighten-2"
                text
                @click="requestData(patient)"
            >
                Button
            </v-btn>
            </v-card-actions>
        </v-card>
        <!-- <v-card
          
          class="mx-auto my-12"
          width="350"
        >
          <v-card-title>{{ patient.patient_name }}</v-card-title>
          <v-img 
            src=""
            height="100px" 
          />
          <v-card-title>Details</v-card-title>
          <v-card-text>
            <div class="my-4 subtitle-1">
              <b>Country</b> <br> {{ patient.country }} <br>
              <b>ID</b><br>
              <div>{{ patient.patient_id }}</div>
              <b>Number</b> <br> {{ patient.patient_phone_number }}<br>
              <b> Allowed</b> {{ patient.allowed? "Yes":"No" }}
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="deep-grey lighten-2"
              text
              @click="requestData(patient)"
            >
              Request Data
            </v-btn>
          </v-card-actions>
        </v-card> -->
      </template>
    </v-row>

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