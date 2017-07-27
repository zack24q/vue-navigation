import Vue from 'vue'
import Router from 'vue-router'
// import Index from '../pages/index.vue'
// import List from '../pages/list.vue'
// import Detail from '../pages/detail.vue'
const Index = r => require.ensure([], () => r(require('../pages/index.vue')), 'Index')
const List = r => require.ensure([], () => r(require('../pages/list.vue')), 'List')
const Detail = r => require.ensure([], () => r(require('../pages/detail.vue')), 'Detail')

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      name: 'index',
      path: '/',
      component: Index
    },
    {
      name: 'list',
      path: '/list',
      component: List
    },
    {
      name: 'detail',
      path: '/list/:id',
      component: Detail
    },
  ]
})

export default router
