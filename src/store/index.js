import Vue from 'vue'
import Vuex from 'vuex'

import token from '../json/token.json'
import web3 from 'web3'
Vue.use(Vuex)
export default new Vuex.Store({
    state:{
        tokens: token,
        donateModal: false,
        communityCenters: [],
        confirmDonationRevoke: false,
        myDonations:[],
        embarkJs:require('../../embarkArtifacts/embarkjs').default,
        centerToDonate:{},
        sablier: require('../../embarkArtifacts/contracts/Sablier').default,
        remCare: require('../../embarkArtifacts/contracts/RemCare').default,
        erc20: require('../json/erc20ABI.json'),
        web3:new web3('http://localhost:8546'),
        streams:[]
    }
})