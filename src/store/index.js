import Vue from 'vue'
import Vuex from 'vuex'
<<<<<<< HEAD
=======

import token from '../json/token.json'
import community from '../json/community.json'

Vue.use(Vuex)
>>>>>>> b4335c250f50c1b362815c7ada9402677a41ab96

import token from '../json/token.json'
import web3 from 'web3'
Vue.use(Vuex)
export default new Vuex.Store({
    state:{
        tokens: token,
        donateModal: false,
<<<<<<< HEAD
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
=======
        communityCenter: community,
        confirmDonationRevoke: false,
>>>>>>> b4335c250f50c1b362815c7ada9402677a41ab96
    }
})