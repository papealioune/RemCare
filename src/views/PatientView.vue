<template>
  <v-container
    fluid
    >
    <v-app-bar
      color="#ff954f"
    >
      <v-toolbar-title>Patients</v-toolbar-title>
    </v-app-bar>
      <div class="text-center">
        <v-sheet color="#82cdff">At this section you can manage your patients</v-sheet>
      </div>
    <v-col
      align
    >
      <v-row
        justify="center"
      >
        <v-card
          v-for="(choice,i) in choices"
          :key="i"
          :to="choice.to"
          class="ma-3 pa-6"
          color="#ff954f"
          max-width="400"
        >
          <v-card-title>
            <span class="title font-weight-light">{{ choice.title }}</span>
          </v-card-title>

          <v-card-text class="headline font-weight-bold">
            {{ choice.text }}
          </v-card-text>

          <v-card-actions>
            <v-col class="text-center">
              <v-btn
                color="#82cdff"
                :ripple="{ center: true }"
              >
                {{ choice.btn }}
              </v-btn>
            </v-col>
          </v-card-actions>
        </v-card>
      </v-row>
    </v-col>
  </v-container>
</template>
<script>
  export default {
    data: () => ({
      choices: [
        {
          title: "Request Data",
          text:"You need to request data for a patient you want to cure",
          btn: "Request",
          to: "/patientdatarequest"
        },
        {
          title: "View Data",
          text:"You can see all informations related to the patient data",
          btn: "View",
          to: "/patientdataview"
        }
      ],
    })
  }
</script>

<style scoped>
</style>