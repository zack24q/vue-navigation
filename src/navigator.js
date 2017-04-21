import Routes from './routes'

var development = process.env.NODE_ENV === 'development'

export default (store, moduleName) => {
  if (store) {
    store.registerModule(moduleName, {
      state: {
        routes: Routes
      },
      mutations: {
        'navigation/FORWARD': (state, name) => {
          state.routes.push(name)
        },
        'navigation/BACK': (state, count) => {
          state.routes.splice(state.routes.length - count, count)
        },
        'navigation/REFRESH': (state, count) => {
        },
        'navigation/RESET': (state) => {
          state.routes = []
        }
      }
    })
  }

  var forward = name => {
    store ? store.commit('navigation/FORWARD', name) : Routes.push(name)
    window.sessionStorage.VUE_NAVIGATION = JSON.stringify(Routes)
    development ? console.info('navigation: forward') : null
  }
  var back = count => {
    store ? store.commit('navigation/BACK', count) : Routes.splice(Routes.length - count, count)
    window.sessionStorage.VUE_NAVIGATION = JSON.stringify(Routes)
    development ? console.info('navigation: back') : null
  }
  var refresh = () => {
    store ? store.commit('navigation/REFRESH') : null
    development ? console.info('navigation: refresh') : null
  }
  var reset = () => {
    store ? store.commit('navigation/RESET') : Routes.splice(0, Routes.length)
    window.sessionStorage.VUE_NAVIGATION = JSON.stringify([])
    development ? console.info('navigation: reset') : null
  }

  var record = name => {
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
    record, reset
  }
}
