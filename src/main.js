import Vue from 'vue'
import App from './App.vue'
import 'vuetify/dist/vuetify.min.css' // Ensure you are using css-loader
import vuetify from '@/plugins/vuetify' // path to vuetify export
import store from './store/'
import route from "./routes/"
import { Datetime } from 'vue-datetime'
// You need a specific loader for CSS files
import 'vue-datetime/dist/vue-datetime.css'
<<<<<<< HEAD

Vue.use(Datetime)
Vue.component('datetime', Datetime);
=======
 
Vue.use(Datetime)
Vue.component('datetime', Datetime);

>>>>>>> b4335c250f50c1b362815c7ada9402677a41ab96
Vue.config.productionTip = false
new Vue({
  router: route,
  vuetify,
  store,
  //i18n,
  render: h => h(App)
}).$mount('#app')