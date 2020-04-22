<template>
<!-- App.vue -->

<v-app>
  <v-app-bar app>
    <v-toolbar-title
      id="appName"
      :ripple="{ center: true }"
    >
      RemCare
    </v-toolbar-title>
  </v-app-bar>

  <!-- Sizes your content based upon application components -->
  <v-content>

    <!-- Provides the application the proper gutter -->
    <v-container fluid>
      <!-- If using vue-router -->
      <router-view></router-view>
    <v-bottom-navigation
      :value="activeBtn"
      grow
      color="orange lighten-2"
      absolute
    >
        <v-btn
          v-for="(option,i) in options"
          :key="i"
          :to="option.to"
        >
          <span>{{ option.text }}</span>
          <v-icon>{{ option.icon }}</v-icon>
        </v-btn>

      </v-bottom-navigation>
    </v-container>
  </v-content>
</v-app>
</template>

<script>
//import PatientView from 'component/PatientView';

  export default {
    data () {
      return {
        activeBtn: 0,
        options: [
          {
            text: "Patients",
            icon: "mdi-account",
            to: "/patient"
          },
          {
            text: "Map",
            icon: "mdi-map",
            to: "/map"
          },
          {
            text: "History",
            icon: "mdi-history",
            to: "/map"
          }
        ]
      }
    },
  }
</script>

<style>
#appName {
  font-size: 30px;
  color:coral;
}
</style>