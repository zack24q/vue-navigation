/**
* vue-navigation v0.5.0
* https://github.com/zack24q/vue-navigation
* Released under the MIT License.
*/

var routes = [];

if (window.sessionStorage.VUE_NAVIGATION) {
  routes = JSON.parse(window.sessionStorage.VUE_NAVIGATION);
}

var Routes = routes;

// const development = process.env.NODE_ENV === 'development'

var Navigator = function (bus, store, moduleName) {
  if (store) {
    store.registerModule(moduleName, {
      state: {
        routes: Routes
      },
      mutations: {
        'navigation/FORWARD': function (state, ref) {
          var to = ref.to;
          var from = ref.from;
          var name = ref.name;

          state.routes.push(name);
        },
        'navigation/BACK': function (state, ref) {
          var to = ref.to;
          var from = ref.from;
          var count = ref.count;

          state.routes.splice(state.routes.length - count, count);
        },
        'navigation/REFRESH': function (state, ref) {
          var to = ref.to;
          var from = ref.from;

        },
        'navigation/RESET': function (state) {
          state.routes.splice(0, state.routes.length);
        }
      }
    });
  }

  var forward = function (name, toRoute, fromRoute) {
    var to = {route: toRoute};
    var from = {route: fromRoute};
    var route = store ? store.state[moduleName].routes : Routes;
    // if from does not exist, it will be set null
    from.name = route[route.length - 1] || null;
    to.name = name;
    store ? store.commit('navigation/FORWARD', {to: to, from: from, name: name}) : route.push(name);
    window.sessionStorage.VUE_NAVIGATION = JSON.stringify(route);
    bus.$emit('forward', to, from);
  };
  var back = function (count, toRoute, fromRoute) {
    var to = {route: toRoute};
    var from = {route: fromRoute};
    var route = store ? store.state[moduleName].routes : Routes;
    from.name = route[route.length - 1];
    to.name = route[route.length - 1 - count];
    store ? store.commit('navigation/BACK', {to: to, from: from, count: count}) : route.splice(Routes.length - count, count);
    window.sessionStorage.VUE_NAVIGATION = JSON.stringify(route);
    bus.$emit('back', to, from);
  };
  var refresh = function (toRoute, fromRoute) {
    var to = {route: toRoute};
    var from = {route: fromRoute};
    var route = store ? store.state[moduleName].routes : Routes;
    to.name = from.name = route[route.length - 1];
    store ? store.commit('navigation/REFRESH', {to: to, from: from}) : null;
    bus.$emit('refresh', to, from);
  };
  var reset = function () {
    store ? store.commit('navigation/RESET') : Routes.splice(0, Routes.length);
    window.sessionStorage.VUE_NAVIGATION = JSON.stringify([]);
    bus.$emit('reset');
  };

  var record = function (name, toRoute, fromRoute) {
    var toIndex = Routes.lastIndexOf(name);
    if (toIndex === -1) {
      forward(name, toRoute, fromRoute);
    } else if (toIndex === Routes.length - 1) {
      refresh(toRoute, fromRoute);
    } else {
      back(Routes.length - 1 - toIndex, toRoute, fromRoute);
    }
  };

  return {
    record: record, reset: reset
  }
};

var NavComponent = {
  name: 'navigation',
  abstract: true,
  props: {},
  data: function () { return ({
    routes: Routes
  }); },
  computed: {
    historyStr: function historyStr () {
      return this.routes.join(',')
    }
  },
  render: function render (createElement) {
    return createElement(
      'keep-alive',
      {props: {include: this.historyStr}},
      this.$slots.default
    )
  }
};

var index = {
  install: function (Vue, ref) {
    if ( ref === void 0 ) ref = {};
    var router = ref.router;
    var store = ref.store;
    var moduleName = ref.moduleName; if ( moduleName === void 0 ) moduleName = 'navigation';

    if (!router) {
      console.error('vue-navigation need options: router');
      return
    }

    var bus = new Vue();
    var navigator = Navigator(bus, store, moduleName);

    // init page name
    router.beforeEach(function (to, from, next) {
      var matched = to.matched[0];
      if (matched && matched.components) {
        var component = matched.components.default;
        if (typeof component === 'function') {
          // async component
          matched.components.default = function (r) {
            component(function (c) {
              c.name = c.name || 'AC-' + matched.path;
              // for dev environment
              c._Ctor && (c._Ctor[0].options.name = c.name);
              r(c);
            });
          };
        } else {
          component.name = component.name || 'AC-' + matched.path;
        }
      }
      next();
    });

    // handle router change
    router.afterEach(function (to, from) {
      var matched = to.matched[0];
      if (matched && matched.components) {
        var component = matched.components.default;
        navigator.record(component.name, to, from);
      }
    });

    Vue.component('navigation', NavComponent);

    Vue.navigation = Vue.prototype.$navigation = {
      on: function (event, callback) {
        bus.$on(event, callback);
      },
      once: function (event, callback) {
        bus.$once(event, callback);
      },
      off: function (event, callback) {
        bus.$off(event, callback);
      },
      getRoutes: function () { return Routes.slice(); },
      cleanRoutes: function () { return navigator.reset(); }
    };
  }
};

export default index;
