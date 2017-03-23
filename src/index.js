import Routes from './routes'
import Navigator from './navigator'
import NavComponent from './components/navigation'

export default {
  install: function (Vue, options) {
    if (!options) {
      console.error('navigation need options')
      return
    }
    if (!options.router) {
      console.error('navigation need options.router')
      return
    }
    var router = options.router
    var store = options.store
    var moduleName = options.moduleName || 'navigation'

    var navigator = new Navigator(store, moduleName)

    // init page name
    router.beforeEach(function (to, from, next) {
      var matched = to.matched[to.matched.length - 1]
      if (matched) {
        var component = matched.components.default
        component.name = component.name || 'anonymous-component-' + matched.path
      }
      next()
    })

    // handle router change
    router.afterEach(function (to, from) {
      var matched = to.matched[to.matched.length - 1]
      if (matched) {
        var component = to.matched[to.matched.length - 1].components.default
        navigator.jumpTo(component.name)
      }
    })

    Vue.component('navigation', NavComponent)

    Vue.navigation = Vue.prototype.$navigation = {
      getRoutes: function () {
        return Routes.slice()
      }
    }
  }
}
