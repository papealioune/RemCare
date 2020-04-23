<template>
    <v-container align-center justify-center row fill-height>
        <v-layout>
            <v-flex>
                <v-toolbar color="#ff954f" dark>
                    <v-toolbar-title>Centers</v-toolbar-title>
                    <v-spacer></v-spacer>
                </v-toolbar>
                <LMap :zoom="zoom" :center="center" style="z-index:1;">
                    <LIconDefault></LIconDefault>
                    <LTileLayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></LTileLayer>
                    <v-marker-cluster :options="clusterOptions" @clusterclick="sheet=true;">
                        <LMarker v-for="venue in venueLocations" :key="venue.name+venue.position" :lat-lng="venue.position" :icon="icon" :color="venue.color">
                            <LPopup :content="venue.description">
                            </LPopup>
                        </LMarker>
                    </v-marker-cluster>
                </LMap>
            </v-flex>
            <v-bottom-sheet v-model="sheet" :inset="true" :hide-overlay="true">
                <v-sheet class="text-center" height="200px" align-center justify-center row fill-height>
                    <v-btn class="my-6" depressed color="error" @click="sheet = !sheet">close</v-btn>
                </v-sheet>
            </v-bottom-sheet>
        </v-layout>
    </v-container>
</template>

<script>
import { L, Icon, icon } from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'
import { LMap, LTileLayer, LMarker, LIconDefault, LPopup } from 'vue2-leaflet';

export default {
    components: {
        LMap,
        LTileLayer,
        LMarker,
        LIconDefault,
        LPopup
    },
    data() {
        return {
            clusterOptions: {},
            center: L.latLng(-33.311836, 26.520642),
            icon: icon(Object.assign({}, Icon.Default.prototype.options, {
                iconUrl,
                shadowUrl
            })),
            map: null,
            sheet: false,
            venueLocations: [],
            zoom: 2,
        }
    },
    mounted() {
        
    },
};
</script>

<style scoped>

</style>