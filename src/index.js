import Routes from './routes'
import Navigator from './navigator'
import NavComponent from './components/navigation'

export default {
  install: (Vue, {router, store, moduleName = 'navigation'} = {}) => {
    if (!router) {
      console.error('vue-navigation need options: router')
      return
    }

    const bus = new Vue()
    const navigator = Navigator(bus, store, moduleName)

    // init page name
    router.beforeEach((to, from, next) => {
      let matched = to.matched[0]
      if (matched && matched.components) {
        let component = matched.components.default
        if (typeof component === 'function') {
          // async component
          matched.components.default = (r) => {
            component((c) => {
              c.name = c.name || 'AC-' + matched.path
              // for dev environment
              c._Ctor && (c._Ctor[0].options.name = c.name)
              r(c)
            })
          }
        } else {
          component.name = component.name || 'AC-' + matched.path
        }
      }
      next()
    })

    // handle router change
    router.afterEach((to) => {
      let matched = to.matched[0]
      if (matched && matched.components) {
        let component = matched.components.default
        navigator.record(component.name)
      }
    })

    Vue.component('navigation', NavComponent)

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
