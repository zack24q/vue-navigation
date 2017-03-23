import Routes from '../routes'

export default {
  name: 'navigation',
  props: {},
  data: function () {
    return {
      routes: Routes
    }
  },
  computed: {
    historyStr: function () {
      return this.routes.join(',')
    }
  },
  render: function (createElement) {
    return createElement(
      'keep-alive',
      {props: {include: this.historyStr}},
      this.$slots.default
    )
  },
}
