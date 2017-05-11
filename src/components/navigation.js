import Routes from '../routes'

export default {
  name: 'navigation',
  abstract: true,
  props: {},
  data: () => ({
    routes: Routes
  }),
  computed: {
    historyStr () {
      return this.routes.join(',')
    }
  },
  render (createElement) {
    return createElement(
      'keep-alive',
      {props: {include: this.historyStr}},
      this.$slots.default
    )
  },
}
