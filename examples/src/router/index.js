import Vue from 'vue'
import Router from 'vue-router'
import Index from '../pages/index.vue'
import List from '../pages/list.vue'
import Detail from '../pages/detail.vue'

Vue.use(Router)

const router = new Router({
  mode: 'hash',
  routes: [
    {
      name: '',
      path: '/',
      component: Index
    },
    {
      path: '/list',
      component: List
    },
    {
      path: '/list/:id',
      component: Detail
    },
  ]
})

export default router
