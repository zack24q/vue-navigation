import Routes from './routes'

var development = process.env.NODE_ENV === 'development'

export default function (store, moduleName) {
  if (store) {
    store.registerModule(moduleName, {
      state: {routes: Routes},
      mutations: {
        'navigation/FORWARD': function (state, name) {
          state.routes.push(name)
        },
        'navigation/BACK': function (state, count) {
          state.routes.splice(state.routes.length - count, count)
        },
        'navigation/REFRESH': function (state, count) {
        }
      }
    })
  }

  var forward = function (name) {
    store ? store.commit('navigation/FORWARD', name) : Routes.push(name)
    window.sessionStorage.VUE_NAVIGATION = JSON.stringify(Routes)
    development ? console.info('navigation: forward') : null
  }
  var back = function (count) {
    store ? store.commit('navigation/BACK', count) : Routes.splice(Routes.length - count, count)
    window.sessionStorage.VUE_NAVIGATION = JSON.stringify(Routes)
    development ? console.info('navigation: back') : null
  }
  var refresh = function () {
    store ? store.commit('navigation/REFRESH') : null
    development ? console.info('navigation: refresh') : null
  }

  var jumpTo = function (name) {
    var toIndex = Routes.lastIndexOf(name)
    if (toIndex === -1) {
      forward(name)
    } else if (toIndex === Routes.length - 1) {
      refresh()
    } else {
      back(Routes.length - 1 - toIndex)
    }
  }

  return {
    jumpTo: jumpTo
  }
}
