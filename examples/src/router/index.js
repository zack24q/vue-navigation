import Vue from 'vue'
import Router from 'vue-router'
import Index from '../components/index.vue'
import List from '../components/list.vue'
import Detail from '../components/detail.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
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
