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
    let backFlag = false

    // init page name
    router.beforeEach((to, from, next) => {
      let matched = to.matched[0]
      if (matched) {
        let component = matched.components.default
        component.name = component.name || 'anonymous-component-' + matched.path

        let toIndex = Routes.lastIndexOf(component.name)
        if (toIndex === -1) {
          // forward
          next()
        } else if (toIndex === Routes.length - 1) {
          // refresh
          next()
        } else {
          // back
          if (backFlag) {
            backFlag = false
            next()
          } else {
            backFlag = true
            next(false)
            window.history.go(toIndex + 1 - Routes.length)
          }

        }
      } else {
        next()
      }
    })

    // handle router change
    router.afterEach((to, from) => {
      let matched = to.matched[0]
      if (matched) {
        let component = matched.components.default
        navigator.record(component.name)
      }
    })

    Vue.component('navigation', NavComponent)

    Vue.navigation = Vue.prototype.$navigation = {
      getRoutes: () => Routes.slice()
    }
  }
}
