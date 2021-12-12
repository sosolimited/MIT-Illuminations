import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home.vue'
import Preview from '../views/Preview.vue'

Vue.use(Router)

const router = new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/illuminationsPreview/:id',
            name: 'preview',
            component: Preview
        }
    ]
})

export default router
