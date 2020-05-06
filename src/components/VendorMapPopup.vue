<template>
<v-row justify="center">
    <v-dialog v-model="$store.state.showOnMap">
        <v-card>
            <v-card-title class="headline">Vendor Map</v-card-title>
            <v-container fluid>
                <v-row>
                    <v-col cols="12">
                        <v-row style="height: 73vh;">
                            <v-map :zoom=10 :vendor="vendor" style="z-index:1">
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
    latLng,
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
            vendor: window.L.latLng(-33.311836, 26.520642),
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
            vendors: []
        }
    },
    watch: {
        map: function () {
            this.$forceUpdate()
        }
    },
    created() {
        console.log('L', window)
        this.vendors = this.initMap(this);
        setTimeout(() => {
            console.log('done')
            this.$nextTick(() => {
                this.clusterOptions = {
                    disableClusteringAtZoom: 11
                }
            });
        }, 5000);
    },
    methods:{
        initMap(_this) {
            var venues = require('../json/vendors.json')
            console.log('this.vendors ', _this)
            var vendors = []
            venues.forEach((venue) => {
                vendors.push({
                    name: venue.properties.name,
                    description: "<b>Name:</b> " + venue.properties.name +
                        "</b></br><b>Phone Number:  </b>" + venue.properties.phone_number,
                    position: latLng(
                        venue.geometry.coordinates[1], venue.geometry.coordinates[0]
                    )
                })
            })
            console.log('return vendors: ', vendors)
            return vendors
        }
    }
}
