// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// import Navigation from '../../src'
import Navigation from '../../dist/vue-navigation.umd'

Vue.config.productionTip = false
Vue.use(Navigation, {router})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App}
})
