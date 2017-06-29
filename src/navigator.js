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

  const forward = (name, toRoute, fromRoute) => {
    const to = {
      route: toRoute
    }
    const from = {
      route: fromRoute
    }
    if (store) {
      const r = store.state.routes
      from.name = r[r.length - 1]
      store.commit('navigation/FORWARD', name)
      to.name = r[r.length - 1]
    } else {
      from.name = Routes[Routes.length - 1]
      Routes.push(name)
      to.name = Routes[Routes.length - 1]
    }
    // if from does not exist, it will be set null
    from.name = from.name || null
    window.sessionStorage.VUE_NAVIGATION = JSON.stringify(Routes)
    bus.$emit('forward', to, from)
    development ? console.info('navigation: forward to ', to, ' from ', from) : null
  }
  const back = (count, toRoute, fromRoute) => {
    const to = {
      route: toRoute
    }
    const from = {
      route: fromRoute
    }
    if (store) {
      const r = store.state.routes
      from.name = r[r.length - 1]
      store.commit('navigation/BACK', count)
      to.name = r[r.length - 1]
    } else {
      from.name = Routes[Routes.length - 1]
      Routes.splice(Routes.length - count, count)
      to.name = Routes[Routes.length - 1]
    }
    window.sessionStorage.VUE_NAVIGATION = JSON.stringify(Routes)
    bus.$emit('back', to, from)
    development ? console.info('navigation: back to ', to, ' from ', from) : null
  }
  const refresh = (toRoute, fromRoute) => {
    const to = {
      route: toRoute
    }
    const from = {
      route: fromRoute
    }
    if (store) {
      const r = store.state.routes
      from.name = to.name = r[r.length - 1]
      store.commit('navigation/REFRESH')
    } else {
      from.name = to.name = Routes[Routes.length - 1]
    }
    bus.$emit('refresh', to, from)
    development ? console.info('navigation: refresh to ', to, ' from ', from) : null
  }
  const reset = () => {
    store ? store.commit('navigation/RESET') : Routes.splice(0, Routes.length)
    window.sessionStorage.VUE_NAVIGATION = JSON.stringify([])
    bus.$emit('reset')
    development ? console.info('navigation: reset') : null
  }

  const record = (name, toRoute, fromRoute) => {
    const toIndex = Routes.lastIndexOf(name)
    if (toIndex === -1) {
      forward(name, toRoute, fromRoute)
    } else if (toIndex === Routes.length - 1) {
      refresh(toRoute, fromRoute)
    } else {
      back(Routes.length - 1 - toIndex, toRoute, fromRoute)
    }
  }

  return {
    record, reset
  }
}
