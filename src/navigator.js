import Routes from './routes'
import {getKey} from './utils'

export default (bus, store, moduleName, keyName) => {
  if (store) {
    store.registerModule(moduleName, {
      state: {
        routes: Routes
      },
      mutations: {
        'navigation/FORWARD': (state, {to, from, name}) => {
          state.routes.push(name)
        },
        'navigation/BACK': (state, {to, from, count}) => {
          state.routes.splice(state.routes.length - count, count)
        },
        'navigation/REFRESH': (state, {to, from}) => {
        },
        'navigation/RESET': (state) => {
          state.routes.splice(0, state.routes.length)
        }
      }
    })
  }

  const forward = (name, toRoute, fromRoute) => {
    const to = {route: toRoute}
    const from = {route: fromRoute}
    const route = store ? store.state[moduleName].routes : Routes
    // if from does not exist, it will be set null
    from.name = route[route.length - 1] || null
    to.name = name
    store ? store.commit('navigation/FORWARD', {to, from, name}) : route.push(name)
    window.sessionStorage.VUE_NAVIGATION = JSON.stringify(route)
    bus.$emit('forward', to, from)
  }
  const back = (count, toRoute, fromRoute) => {
    const to = {route: toRoute}
    const from = {route: fromRoute}
    const route = store ? store.state[moduleName].routes : Routes
    from.name = route[route.length - 1]
    to.name = route[route.length - 1 - count]
    store ? store.commit('navigation/BACK', {to, from, count}) : route.splice(Routes.length - count, count)
    window.sessionStorage.VUE_NAVIGATION = JSON.stringify(route)
    bus.$emit('back', to, from)
  }
  const refresh = (toRoute, fromRoute) => {
    const to = {route: toRoute}
    const from = {route: fromRoute}
    const route = store ? store.state[moduleName].routes : Routes
    to.name = from.name = route[route.length - 1]
    store ? store.commit('navigation/REFRESH', {to, from}) : null
    bus.$emit('refresh', to, from)
  }
  const reset = () => {
    store ? store.commit('navigation/RESET') : Routes.splice(0, Routes.length)
    window.sessionStorage.VUE_NAVIGATION = JSON.stringify([])
    bus.$emit('reset')
  }

  const record = (toRoute, fromRoute) => {
    const name = getKey(toRoute, keyName)
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
