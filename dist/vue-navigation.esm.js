/**
* vue-navigation v0.3.0
* https://github.com/zack24q/vue-navigation
* Released under the MIT License.
*/

var routes = [];

if (window.sessionStorage.VUE_NAVIGATION) {
  routes = JSON.parse(window.sessionStorage.VUE_NAVIGATION);
}

var Routes = routes;

var development = process.env.NODE_ENV === 'development';

var Navigator = function (bus, store, moduleName) {
  if (store) {
    store.registerModule(moduleName, {
      state: {
        routes: Routes
      },
      mutations: {
        'navigation/FORWARD': function (state, name) {
          state.routes.push(name);
        },
        'navigation/BACK': function (state, count) {
          state.routes.splice(state.routes.length - count, count);
        },
        'navigation/REFRESH': function (state, count) {
        },
        'navigation/RESET': function (state) {
          state.routes = [];
        }
      }
    });
  }

  var forward = function (name) {
    var from, to;
    if (store) {
      var r = store.state.routes;
      from = r[r.length - 1];
      store.commit('navigation/FORWARD', name);
      to = r[r.length - 1];
    } else {
      from = Routes[Routes.length - 1];
      Routes.push(name);
      to = Routes[Routes.length - 1];
    }
    window.sessionStorage.VUE_NAVIGATION = JSON.stringify(Routes);
    // if from does not exist, it will be set null
    bus.$emit('forward', from || null, to);
    development ? console.info(("navigation: forward from " + from + " to " + to)) : null;
  };
  var back = function (count) {
    var from, to;
    if (store) {
      var r = store.state.routes;
      from = r[r.length - 1];
      store.commit('navigation/BACK', count);
      to = r[r.length - 1];
    } else {
      from = Routes[Routes.length - 1];
      Routes.splice(Routes.length - count, count);
      to = Routes[Routes.length - 1];
    }
    window.sessionStorage.VUE_NAVIGATION = JSON.stringify(Routes);
    bus.$emit('back', from, to);
    development ? console.info(("navigation: back from " + from + " to " + to)) : null;
  };
  var refresh = function () {
    var current;
    if (store) {
      var r = store.state.routes;
      current = r[r.length - 1];
      store.commit('navigation/REFRESH');
    } else {
      current = Routes[Routes.length - 1];
    }
    bus.$emit('refresh', current);
    development ? console.info(("navigation: refresh " + current)) : null;
  };
  var reset = function () {
    store ? store.commit('navigation/RESET') : Routes.splice(0, Routes.length);
    window.sessionStorage.VUE_NAVIGATION = JSON.stringify([]);
    bus.$emit('reset');
    development ? console.info('navigation: reset') : null;
  };

  var record = function (name) {
    var toIndex = Routes.lastIndexOf(name);
    if (toIndex === -1) {
      forward(name);
    } else if (toIndex === Routes.length - 1) {
      refresh();
    } else {
      back(Routes.length - 1 - toIndex);
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
    router.afterEach(function (to) {
      var matched = to.matched[0];
      if (matched && matched.components) {
        var component = matched.components.default;
        navigator.record(component.name);
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
