import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from '@/plugins/vuetify'

Vue.config.productionTip = false
// TODO(Anna): We want this off for production-version
// console logging from within p5 only. Find a more targeted
// way to de-activate.
Vue.config.silent = window.estore || false;

window.vueApplication = new Vue({
    router,
    store,
    vuetify,
    render: (h) => h(App)
}).$mount('#app')

// If the electron window closes, we want to explicitly
// destroy the Vue app (this doesn't happen by default).
// Doing so allows us to use Vue's beforeDestroy() on electron
// window close. Especially useful for handling Vuex store behaviors.
window.addEventListener('beforeunload', () => window.vueApplication.$destroy());
