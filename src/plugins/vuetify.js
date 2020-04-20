import '@fortawesome/fontawesome-free/css/all.css';
import '@mdi/font/css/materialdesignicons.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import Vue from 'vue';
import Vuetify from 'vuetify';
//import { colors } from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
    icons: {
        iconfont: 'md' || 'fa'
    },
    theme: {
        themes: {
            light: {
            primary: "#4682b4",
            secondary: "#b0bec5",
            accent: "#8c9eff",
            error: "#b71c1c"
        }
        }

    }
});
