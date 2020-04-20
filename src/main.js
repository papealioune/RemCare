import Vue from 'vue'
import App from './App.vue'
import 'vuetify/dist/vuetify.min.css' // Ensure you are using css-loader
import vuetify from '@/plugins/vuetify' // path to vuetify export
import store from './store/'
import route from "./routes/"

import i18n from '@/plugins/i18n';

Vue.config.productionTip = false
new Vue({
  router: route,
  vuetify,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')