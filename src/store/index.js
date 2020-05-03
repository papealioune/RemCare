import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
    state:{
        showOnMap: false,
        selectedVendor: {},
        centerToRegister:{},
        ethAddressModal: false,
    }
})