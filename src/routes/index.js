import Vue from 'vue'
import Router from 'vue-router'

import Vendor from '../views/Vendor'
import Center from '../views/Center'
import ViewCenter from '../views/ViewCenter'
import CenterDataRequest from '../components/CenterDataRequest'
import CentersView from '../components/CentersView'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: "/",
            redirect: "center"
        },
        {
            path: "/center",
            name: "center",
            component: Center
        },
        {
            path: "/communitycenters",
            name: "viewcenter",
            component: ViewCenter
        },
        {
            path: "/vendor",
            name: "vendor",
            component: Vendor
        },
        {
            path: "/centerDataRequest",
            name: "centerDataRequest",
            component: CenterDataRequest
        },
        {
            path: "/centerview",
            name: "centerview",
            component: CentersView
        },
    ],
    mode: "history"
})