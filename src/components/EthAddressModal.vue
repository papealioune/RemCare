<template>
  <v-row justify="center">
    <v-dialog
      v-model="$store.state.ethAddressModal"
      persistent
    >
      <v-card>
        <v-card-title class="headline">
          Your Eth Address
        </v-card-title>
        <v-card-text>
          <h2>0x6239ff1040e412491557a7a02b2cbcc5ae85dc8f</h2>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="green darken-1"
            text
            @click="$store.state.ethAddressModal = false"
          >
            Noted
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
    
}
</script>