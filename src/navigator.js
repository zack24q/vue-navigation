import Routes from './routes'

const development = process.env.NODE_ENV === 'development'

export default (bus, store, moduleName) => {
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
    let from, to
    if (store) {
      const r = store.state.routes
      from = r[r.length - 1]
      store.commit('navigation/FORWARD', name)
      to = r[r.length - 1]
    } else {
      from = Routes[Routes.length - 1]
      Routes.push(name)
      to = Routes[Routes.length - 1]
    }
    window.sessionStorage.VUE_NAVIGATION = JSON.stringify(Routes)
    // if from does not exist, it will be set null
    bus.$emit('forward', from || null, to)
    development ? console.info(`navigation: forward from ${from} to ${to}`) : null
  }
  const back = count => {
    let from, to
    if (store) {
      const r = store.state.routes
      from = r[r.length - 1]
      store.commit('navigation/BACK', count)
      to = r[r.length - 1]
    } else {
      from = Routes[Routes.length - 1]
      Routes.splice(Routes.length - count, count)
      to = Routes[Routes.length - 1]
    }
    window.sessionStorage.VUE_NAVIGATION = JSON.stringify(Routes)
    bus.$emit('back', from, to)
    development ? console.info(`navigation: back from ${from} to ${to}`) : null
  }
  const refresh = () => {
    let current
    if (store) {
      const r = store.state.routes
      current = r[r.length - 1]
      store.commit('navigation/REFRESH')
    } else {
      current = Routes[Routes.length - 1]
    }
    bus.$emit('refresh', current)
    development ? console.info(`navigation: refresh ${current}`) : null
  }
  const reset = () => {
    store ? store.commit('navigation/RESET') : Routes.splice(0, Routes.length)
    window.sessionStorage.VUE_NAVIGATION = JSON.stringify([])
    bus.$emit('reset')
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
