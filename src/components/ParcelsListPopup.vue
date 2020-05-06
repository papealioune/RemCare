<template>
  <v-row justify="center">
    <v-dialog
      v-model="$store.state.parcelsListPopup"
      persistent
    >
      <v-card>
        <v-card-title class="headline">
          My Parcels
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-data-table
              :headers="headers"
              :items="$store.state.parcels"
              class="elevation-0"
              hide-default-footer
            >
              <template
                slot="items"
                slot-scope="parcels"
              >
                <tr>
                  <td>{{ parcels.parcels_id }}</td>
                  <td>{{ parcels.quantity }}</td>
                  <td>{{ parcels.price }}</td>
                  <td>
                    <v-btn color="error">
                      DELETE
                    </v-btn>
                    <v-btn color="primary">
                      EDIT
                    </v-btn>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-container>
        </v-card-text>
        <v-card-text>
          <p>
            Total :
            <input v-model="total">
          </p>
          <p>{{ total }}</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            text
          >
            Back
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
    data() {
        return {
            total:'',
            headers: [
                {
                    text: 'id',
                    value: 'parcels_id'
                },
                {
                    text: 'Quantity',
                    value: 'quantity'
                },
                {
                    text: 'Price',
                    value: 'price'
                },
                {
                    text: 'Actions',
                    value: 'action'
                }
            ]
        }
    },

    computed() {},

    methods: {}
}
</script>