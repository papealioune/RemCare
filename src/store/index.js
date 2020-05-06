import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
    state:{
        parcels: [],
        showOnMap: false,
        registeredVendor: [],
        selectedVendor: {},
        centerToRegister:{},
        ethAddressModal: false,
        vendorMapPopup: false,
        parcelsListPopup: false
    }
})