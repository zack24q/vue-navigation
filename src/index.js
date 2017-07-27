import Routes from './routes'
import Navigator from './navigator'
import NavComponent from './components/navigation'
import {genKey} from './utils'

export default {
  install: (Vue, {router, store, moduleName = 'navigation', keyName = 'VNK'} = {}) => {
    if (!router) {
      console.error('vue-navigation need options: router')
      return
    }

    const bus = new Vue()
    const navigator = Navigator(bus, store, moduleName, keyName)

    // init router`s keyName
    router.beforeEach((to, from, next) => {
      if (!to.query[keyName]) {
        const query = {...to.query}
        query[keyName] = genKey()
        next({path: to.path, query, replace: !from.query[keyName]})
      } else {
        next()
      }
    })

    // record router change
    router.afterEach((to, from) => {
      navigator.record(to, from)
      // router.push({path: to.path, query: to.query})
    })

    Vue.component('navigation', NavComponent(keyName))

    Vue.navigation = Vue.prototype.$navigation = {
      on: (event, callback) => {
        bus.$on(event, callback)
      },
      once: (event, callback) => {
        bus.$once(event, callback)
      },
      off: (event, callback) => {
        bus.$off(event, callback)
      },
      getRoutes: () => Routes.slice(),
      cleanRoutes: () => navigator.reset()
    }
  }
}
