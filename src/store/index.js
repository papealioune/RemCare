import Vue from 'vue'
import Vuex from 'vuex'

import token from '../json/token.json'
import community from '../json/community.json'

Vue.use(Vuex)

export default new Vuex.Store({
    state:{
        tokens: token,
        donateModal: false,
        communityCenter: community,
        confirmDonationRevoke: false,
    }
})