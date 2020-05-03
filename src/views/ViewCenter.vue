<template>
<v-container fluid>
    <v-row>
        <v-col cols="12">
            <v-row style="height: 73vh;">
                <v-toolbar color="#ff954f">
                    <v-toolbar-title>Registered Centers</v-toolbar-title>
                    <v-spacer></v-spacer>
                </v-toolbar>
                <v-map :zoom=10 :center="center" style="z-index:1">
                    <v-icondefault></v-icondefault>
                    <v-tilelayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></v-tilelayer>
                    <v-marker-cluster :options="clusterOptions" @clusterclick="click()">
                        <v-marker v-for="venue in centers" :key="venue.name+venue.position" :lat-lng="venue.position" :icon="icon">
                            <v-popup :content="venue.description" >
                            </v-popup>
                        </v-marker>
                    </v-marker-cluster>
                </v-map>
            </v-row>
        </v-col>
    </v-row>
</v-container>
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
    created() {
        console.log('L', window)
        this.centers = this.initMap(this);
        setTimeout(() => {
            console.log('done')
            this.$nextTick(() => {
                this.clusterOptions = {
                    disableClusteringAtZoom: 11
                }
            });
        }, 5000);
    },
    methods: {
        initMap(_this) {
            var venues = require('../json/centers.json')
            console.log('this.centers ', _this)
            var centers = []
            venues.forEach((venue) => {
                centers.push({
                    name: venue.properties.name,
                    description: "<b>Name:</b> " + venue.properties.name +
                        "</b></br><b>Phone Number:  </b>" + venue.properties.phone_number,
                    position: latLng(
                        venue.geometry.coordinates[1], venue.geometry.coordinates[0]
                    )
                })
            })
            console.log('return centers: ', centers)
            return centers
        },
    }
}
</script>

<style scoped>
@import "~leaflet/dist/leaflet.css";
@import "~leaflet.markercluster/dist/MarkerCluster.css";
@import "~leaflet.markercluster/dist/MarkerCluster.Default.css";

#map {
    height: 100%;
}
</style>
