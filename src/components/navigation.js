import Routes from '../routes'
import { getKey, matches } from '../utils'

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
        vnode.key = vnode.key || (vnode.isComment
          ? 'comment'
          : vnode.tag)
        // prevent vue-router reuse component
        const key = getKey(this.$route, keyName)
        if (vnode.key.indexOf(key) === -1) {
          vnode.key = `__navigation-${key}-${vnode.key}`
        }
        if (this.cache[key]) {
          if (vnode.key === this.cache[key].key) {
            // restore vnode from cache
            vnode.componentInstance = this.cache[key].componentInstance
          } else {
            // replace vnode to cache
            this.cache[key].componentInstance.$destroy()
            this.cache[key] = vnode
          }
        } else {
          // cache new vnode
          this.cache[key] = vnode
        }
        vnode.data.keepAlive = true
      }
      return vnode
    }
  }
}
