import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    app: 'examples'
  },
  mutations: {
    // 'navigation/FORWARD': (state, {to, from}) => {
    //   console.log('navigation/FORWARD', to, from)
    // },
    // 'navigation/BACK': (state, {to, from}) => {
    //   console.log('navigation/BACK', to, from)
    // },
    // 'navigation/REPLACE': (state, {to, from}) => {
    //   console.log('navigation/REPLACE', to, from)
    // },
    // 'navigation/REFRESH': (state, {to, from}) => {
    //   console.log('navigation/REFRESH', to, from)
    // },
    // 'navigation/RESET': () => {
    //   console.log('navigation/RESET')
    // }
  }
})

export default store
