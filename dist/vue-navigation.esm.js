/**
* vue-navigation v1.0.0
* https://github.com/zack24q/vue-navigation
* Released under the MIT License.
*/

var routes = [];

if (window.sessionStorage.VUE_NAVIGATION) {
  routes = JSON.parse(window.sessionStorage.VUE_NAVIGATION);
}

var Routes = routes;

function genKey() {
  var t = 'xxxxxxxx';
  return t.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0;
    var v = c === 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
}

function getKey(route, keyName) {
  return (route.name || route.path) + '?' + route.query[keyName];
}

function matches(pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1;
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1;
  } else if (isRegExp(pattern)) {
    return pattern.test(name);
  }
  return false;
}

var Navigator = (function (bus, store, moduleName, keyName) {
  if (store) {
    store.registerModule(moduleName, {
      state: {
        routes: Routes
      },
      mutations: {
        'navigation/FORWARD': function navigationFORWARD(state, _ref) {
          var to = _ref.to,
              from = _ref.from,
              name = _ref.name;

          state.routes.push(name);
        },
        'navigation/BACK': function navigationBACK(state, _ref2) {
          var to = _ref2.to,
              from = _ref2.from,
              count = _ref2.count;

          state.routes.splice(state.routes.length - count, count);
        },
        'navigation/REFRESH': function navigationREFRESH(state, _ref3) {
          var to = _ref3.to,
              from = _ref3.from;
        },
        'navigation/RESET': function navigationRESET(state) {
          state.routes.splice(0, state.routes.length);
        }
      }
    });
  }

  var forward = function forward(name, toRoute, fromRoute) {
    var to = { route: toRoute };
    var from = { route: fromRoute };
    var route = store ? store.state[moduleName].routes : Routes;

    from.name = route[route.length - 1] || null;
    to.name = name;
    store ? store.commit('navigation/FORWARD', { to: to, from: from, name: name }) : route.push(name);
    window.sessionStorage.VUE_NAVIGATION = JSON.stringify(route);
    bus.$emit('forward', to, from);
  };
  var back = function back(count, toRoute, fromRoute) {
    var to = { route: toRoute };
    var from = { route: fromRoute };
    var route = store ? store.state[moduleName].routes : Routes;
    from.name = route[route.length - 1];
    to.name = route[route.length - 1 - count];
    store ? store.commit('navigation/BACK', { to: to, from: from, count: count }) : route.splice(Routes.length - count, count);
    window.sessionStorage.VUE_NAVIGATION = JSON.stringify(route);
    bus.$emit('back', to, from);
  };
  var refresh = function refresh(toRoute, fromRoute) {
    var to = { route: toRoute };
    var from = { route: fromRoute };
    var route = store ? store.state[moduleName].routes : Routes;
    to.name = from.name = route[route.length - 1];
    store ? store.commit('navigation/REFRESH', { to: to, from: from }) : null;
    bus.$emit('refresh', to, from);
  };
  var reset = function reset() {
    store ? store.commit('navigation/RESET') : Routes.splice(0, Routes.length);
    window.sessionStorage.VUE_NAVIGATION = JSON.stringify([]);
    bus.$emit('reset');
  };

  var record = function record(toRoute, fromRoute) {
    var name = getKey(toRoute, keyName);
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
  };
});

var NavComponent = (function (keyName) {
  return {
    name: 'navigation',
    abstract: true,
    props: {},
    data: function data() {
      return {
        routes: Routes
      };
    },
    computed: {},
    watch: {
      routes: function routes(val) {
        for (var key in this.cache) {
          if (!matches(val, key)) {
            var vnode = this.cache[key];
            vnode && vnode.componentInstance.$destroy();
            delete this.cache[key];
          }
        }
      }
    },
    created: function created() {
      this.cache = {};
    },
    destroyed: function destroyed() {
      for (var key in this.cache) {
        var vnode = this.cache[key];
        vnode && vnode.componentInstance.$destroy();
      }
    },
    render: function render() {
      var vnode = this.$slots.default ? this.$slots.default[0] : null;
      if (vnode) {
        var key = getKey(this.$route, keyName);

        vnode.key += key;
        if (this.cache[key]) {
          vnode.componentInstance = this.cache[key].componentInstance;
        } else {
          this.cache[key] = vnode;
        }
        vnode.data.keepAlive = true;
      }
      return vnode;
    }
  };
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var index = {
  install: function install(Vue) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        router = _ref.router,
        store = _ref.store,
        _ref$moduleName = _ref.moduleName,
        moduleName = _ref$moduleName === undefined ? 'navigation' : _ref$moduleName,
        _ref$keyName = _ref.keyName,
        keyName = _ref$keyName === undefined ? 'VNK' : _ref$keyName;

    if (!router) {
      console.error('vue-navigation need options: router');
      return;
    }

    var bus = new Vue();
    var navigator = Navigator(bus, store, moduleName, keyName);

    router.beforeEach(function (to, from, next) {
      if (!to.query[keyName]) {
        var query = _extends({}, to.query);
        query[keyName] = genKey();
        next({ path: to.path, query: query, replace: !from.query[keyName] });
      } else {
        next();
      }
    });

    router.afterEach(function (to, from) {
      navigator.record(to, from);
    });

    Vue.component('navigation', NavComponent(keyName));

    Vue.navigation = Vue.prototype.$navigation = {
      on: function on(event, callback) {
        bus.$on(event, callback);
      },
      once: function once(event, callback) {
        bus.$once(event, callback);
      },
      off: function off(event, callback) {
        bus.$off(event, callback);
      },
      getRoutes: function getRoutes() {
        return Routes.slice();
      },
      cleanRoutes: function cleanRoutes() {
        return navigator.reset();
      }
    };
  }
};

export default index;
