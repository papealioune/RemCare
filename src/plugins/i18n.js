import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

//const messages = {'en': {welcomeMsg: 'Welcome to Your Vue.js App'}, 'fr': {welcomeMsg: 'Bienvenu dans votre application VueJs'}};

export default new VueI18n({
    locale: 'en',
    fallbackLocale: 'fr'
})