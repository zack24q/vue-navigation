import Routes from './routes'

const development = process.env.NODE_ENV === 'development'

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

  const forward = name => {
    store ? store.commit('navigation/FORWARD', name) : Routes.push(name)
    window.sessionStorage.VUE_NAVIGATION = JSON.stringify(Routes)
    development ? console.info('navigation: forward') : null
  }
  const back = count => {
    store ? store.commit('navigation/BACK', count) : Routes.splice(Routes.length - count, count)
    window.sessionStorage.VUE_NAVIGATION = JSON.stringify(Routes)
    development ? console.info('navigation: back') : null
  }
  const refresh = () => {
    store ? store.commit('navigation/REFRESH') : null
    development ? console.info('navigation: refresh') : null
  }
  const reset = () => {
    store ? store.commit('navigation/RESET') : Routes.splice(0, Routes.length)
    window.sessionStorage.VUE_NAVIGATION = JSON.stringify([])
    development ? console.info('navigation: reset') : null
  }

  const record = name => {
    const toIndex = Routes.lastIndexOf(name)
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
