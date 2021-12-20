import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from '@/plugins/vuetify'

Vue.config.productionTip = false;
Vue.config.silent = window.estore || false;

window.vueApplication = new Vue({
    router,
    store,
    vuetify,
    render: (h) => h(App)
}).$mount('#app')

window.addEventListener('beforeunload', () => window.vueApplication.$destroy());
