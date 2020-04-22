import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
    state:{
        selectedCenter: "",
        registredPatients: [],
        patientDataToRequest: {},
        showPatientDataModal: false,
    }
})