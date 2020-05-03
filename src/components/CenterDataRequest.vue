<template>
  <container fluid>
    <v-app-bar
      color="#ff954f"
    >
      <v-toolbar-title>Register Center</v-toolbar-title>
    </v-app-bar>
    <v-stepper v-model="e6" vertical>
      <v-row>
        <v-col
          cols="12"
          md="4"
        >
        <v-stepper-step :complete="e6 > 1" step="1">Enter center id</v-stepper-step>
        <v-stepper-content step="1">
          <v-card color="grey lighten-1" class="mb-12" height="200px">
            <v-card-text>
              <v-text-field
                :rules="patientIdRules"
                :counter="20"
                label="Patient Id"
                required
              >
              </v-text-field>
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
        <v-stepper-step :complete="e6 > 2" step="2">Center Phone Number</v-stepper-step>
        <v-stepper-content step="2">
          <v-card color="grey lighten-1" class="mb-12" height="200px">
            <v-card-text>
              <v-text-field
                :rules="patientPhoneRules"
                label="Phone Number"
                required
              >
              </v-text-field>
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
        <v-stepper-step :complete="e6 > 3" step="3">Why do you need the data</v-stepper-step>
        <v-stepper-content step="3">
          <v-card color="grey lighten-1" class="mb-12" height="200px">
            <v-card-text>
              <v-select
                :items="reasons"
                label="Reason"
                outlined
              >
              </v-select>
            </v-card-text>
          </v-card>
          <v-btn @click="e6 = 4">Continue</v-btn>
          <v-btn text>Cancel</v-btn>
        </v-stepper-content>
        </v-col>
      </v-row>
    </v-stepper>
    <div class="text-center">
        <v-sheet>Set the center id to request data related to your donation</v-sheet>
    </div>
  </container>
</template>

<script>
  export default {
    data () {
      return {
        e6: 1,
        centerIdRules: [
          value => !!value || 'Required.',
          value => (value || '').length <= 20 || 'Max 20 characters',
        ],
        centerPhoneRules: [
          value => !!value || 'Required.',
          value => (value || '').length <= 13 || 'Max 20 characters',
        ],
        reasons: ['Monitoring', 'Tracking'],
      }
    },
  }
</script>