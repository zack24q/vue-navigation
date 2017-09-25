import Vue from 'vue'
import Router from 'vue-router'
// import Index from '../pages/Index.vue'
// import List from '../pages/List.vue'
// import Detail from '../pages/Detail.vue'
const Index = r => require.ensure([], () => r(require('../pages/Index.vue')), 'Index')
const List = r => require.ensure([], () => r(require('../pages/List.vue')), 'List')
const Detail = r => require.ensure([], () => r(require('../pages/Detail.vue')), 'Detail')

Vue.use(Router)

const router = new Router({
  mode: 'hash',
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
