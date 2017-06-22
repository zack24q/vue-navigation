import Routes from './routes'
import Navigator from './navigator'
import NavComponent from './components/navigation'

export default {
  install: (Vue, {router, store, moduleName = 'navigation'} = {}) => {
    if (!router) {
      console.error('vue-navigation need options: router')
      return
    }

    let navigator = Navigator(store, moduleName)

    // init page name
    router.beforeEach((to, from, next) => {
      let matched = to.matched[0]
      if (matched && matched.components) {
        let component = matched.components.default
        // async component
        if (typeof component === 'function') {
          matched.components.default = (r) => {
            component((c) => {
              c.name = c.name || 'anonymous-component-' + matched.path
              r(c)
            })
          }
        } else {
          component.name = component.name || 'anonymous-component-' + matched.path
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
      getRoutes: () => Routes.slice(),
      cleanRoutes: () => navigator.reset()
    }
  }
}
