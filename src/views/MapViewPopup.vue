<template>
<v-row justify="center">
    <v-dialog v-model="$store.state.showOnMap"  >
        <v-card>
            <v-card-title class="headline">Map</v-card-title>
            <v-container fluid>
                <v-row>
                    <v-col cols="12">
                        <v-row style="height: 73vh;">
                            <v-map :zoom=10 :center="center" style="z-index:1">
                                <v-icondefault></v-icondefault>
                                <v-tilelayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></v-tilelayer>
                                <v-marker-cluster :options="clusterOptions" @clusterclick="click()">
                                    <v-marker v-for="venue in $store.state.selectedVendor" :key="venue.name+venue.position" :lat-lng="venue.position" :icon="icon">
                                        <v-popup :content="venue.description">
                                        </v-popup>
                                    </v-marker>
                                </v-marker-cluster>
                            </v-map>
                        </v-row>
                    </v-col>
                </v-row>
            </v-container>
            <v-btn color="green darken-1" text @click="$store.state.showOnMap = false">Close</v-btn>
        </v-card>
    </v-dialog>
</v-row>
</template>

<script>
import * as Vue2Leaflet from 'vue2-leaflet'
import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster'
import {
    Icon,
    icon
} from 'leaflet'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'
export default {
    components: {
        'v-map': Vue2Leaflet.LMap,
        'v-tilelayer': Vue2Leaflet.LTileLayer,
        'v-icondefault': Vue2Leaflet.LIconDefault,
        'v-marker': Vue2Leaflet.LMarker,
        'v-popup': Vue2Leaflet.LPopup,
        'v-marker-cluster': Vue2LeafletMarkerCluster
    },
    data() {
        return {
            url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
            attribution: '&copy; <a href=" http://osm.org/copyright">OpenStreetMap </a> contributors',
            map: null,
            center: window.L.latLng(-33.311836, 26.520642),
            zoom: 18,
            maxBoundsViscosity: 1.0,
            layers: [window.L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                maxZoom: 18,
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, Points &copy 2012 LINZ'
            })],
            icon: icon(Object.assign({}, Icon.Default.prototype.options, {
                iconUrl,
                shadowUrl
            })),
            clusterOptions: {},
            centers: []
        }
    },
    watch: {
        map: function () {
            this.$forceUpdate()
        }
    },
    methods:{
        close(){
             this.$store.state.showOnMap = false
        }
    }
}
