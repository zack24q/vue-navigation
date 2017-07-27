import Routes from '../routes'
import {getKey, matches} from '../utils'

export default (keyName) => {
  return {
    name: 'navigation',
    abstract: true,
    props: {},
    data: () => ({
      routes: Routes
    }),
    computed: {},
    watch: {
      routes(val) {
        for (const key in this.cache) {
          if (!matches(val, key)) {
            const vnode = this.cache[key]
            vnode && vnode.componentInstance.$destroy()
            delete this.cache[key]
          }
        }
      },
    },
    created() {
      this.cache = {}
    },
    destroyed() {
      for (const key in this.cache) {
        const vnode = this.cache[key]
        vnode && vnode.componentInstance.$destroy()
      }
    },
    render() {
      const vnode = this.$slots.default ? this.$slots.default[0] : null
      if (vnode) {
        const key = getKey(this.$route, keyName)
        // prevent vue-router reuse component
        vnode.key += key
        if (this.cache[key]) {
          vnode.componentInstance = this.cache[key].componentInstance
        } else {
          this.cache[key] = vnode
        }
        vnode.data.keepAlive = true
      }
      return vnode
    }
  }
}
