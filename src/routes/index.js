import Vue from 'vue'
import Router from 'vue-router'

import PatientView from '../views/PatientView';
import ViewCenter from '../views/ViewCenter';
import PatientDataRequest from '../components/PatientDataRequest'
import PatientDataView from '../components/PatientDataView'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: "/",
            redirect: "patient"
        },
        {
            path: "/patient",
            name: "patient",
            component: PatientView
        },
        {
            path: "/map",
            name: "viewcenter",
            component: ViewCenter
        },
        {
            path: "/patientdatarequest",
            name: "patientdatarequest",
            component: PatientDataRequest
        },
        {
            path: "/patientdataview",
            name: "patientdataview",
            component: PatientDataView
        },
    ],
    mode: "history"
})