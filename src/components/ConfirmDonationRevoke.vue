<template>
  <div class="text-center">
    <v-dialog
      v-model="$store.state.confirmDonationRevoke"
      width="500"
    >
      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
          Confirmation
        </v-card-title>

        <v-card-text>
          Are you sure to revoke the stream donation for this center ?
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="Danger"
            text
            @click="$store.state.confirmDonationRevoke = false"
          >
            No
          </v-btn>
          <v-btn
            color="primary"
            text
            @click="revoke()"
          >
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        confirmDonationRevoke: false,
      }
    },
    methods: {
        revoke(){

        }
    },
  }
</script>