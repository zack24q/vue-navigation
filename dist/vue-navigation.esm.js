/**
* vue-navigation v1.1.4
* https://github.com/zack24q/vue-navigation
* Released under the MIT License.
*/

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

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
  return "".concat(route.name || route.path, "?").concat(route.query[keyName]);
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
function isObjEqual(obj1, obj2) {
  if (obj1 === obj2) {
    return true;
  } else {
    var keys1 = Object.getOwnPropertyNames(obj1);
    var keys2 = Object.getOwnPropertyNames(obj2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = keys1[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var key = _step.value;

        if (obj1[key] !== obj2[key]) {
          return false;
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return true;
  }
}
function typeGenerate(moduleName) {
  return {
    FORWARD: moduleName + "/FOROWRD",
    BACK: moduleName + "/BACK",
    REPLACE: moduleName + "/REPLACE",
    RESET: moduleName + "/RESET",
    REFRESH: moduleName + "/REFRESH"
  };
}

var Navigator = (function (bus, store, moduleName, keyName) {
  var _typeGenerate = typeGenerate(moduleName),
      FORWARD = _typeGenerate.FORWARD,
      BACK = _typeGenerate.BACK,
      REPLACE = _typeGenerate.REPLACE,
      REFRESH = _typeGenerate.REFRESH,
      RESET = _typeGenerate.RESET;

  if (store) {
    var _mutations;

    store.registerModule(moduleName, {
      state: {
        routes: Routes
      },
      mutations: (_mutations = {}, _defineProperty(_mutations, FORWARD, function (state, _ref) {
        var to = _ref.to,
            from = _ref.from,
            name = _ref.name;
        state.routes.push(name);
      }), _defineProperty(_mutations, BACK, function (state, _ref2) {
        var to = _ref2.to,
            from = _ref2.from,
            count = _ref2.count;
        state.routes.splice(state.routes.length - count, count);
      }), _defineProperty(_mutations, REPLACE, function (state, _ref3) {
        var to = _ref3.to,
            from = _ref3.from,
            name = _ref3.name;
        state.routes.splice(Routes.length - 1, 1, name);
      }), _defineProperty(_mutations, REFRESH, function (state, _ref4) {
        var to = _ref4.to,
            from = _ref4.from;
      }), _defineProperty(_mutations, RESET, function (state) {
        state.routes.splice(0, state.routes.length);
      }), _mutations)
    });
  }

  var forward = function forward(name, toRoute, fromRoute) {
    var to = {
      route: toRoute
    };
    var from = {
      route: fromRoute
    };
    var routes = store ? store.state[moduleName].routes : Routes;
    from.name = routes[routes.length - 1] || null;
    to.name = name;
    store ? store.commit(FORWARD, {
      to: to,
      from: from,
      name: name
    }) : routes.push(name);
    window.sessionStorage.VUE_NAVIGATION = JSON.stringify(routes);
    bus.$emit('forward', to, from);
  };

  var back = function back(count, toRoute, fromRoute) {
    var to = {
      route: toRoute
    };
    var from = {
      route: fromRoute
    };
    var routes = store ? store.state[moduleName].routes : Routes;
    from.name = routes[routes.length - 1];
    to.name = routes[routes.length - 1 - count];
    store ? store.commit(BACK, {
      to: to,
      from: from,
      count: count
    }) : routes.splice(Routes.length - count, count);
    window.sessionStorage.VUE_NAVIGATION = JSON.stringify(routes);
    bus.$emit('back', to, from);
  };

  var replace = function replace(name, toRoute, fromRoute) {
    var to = {
      route: toRoute
    };
    var from = {
      route: fromRoute
    };
    var routes = store ? store.state[moduleName].routes : Routes;
    from.name = routes[routes.length - 1] || null;
    to.name = name;
    store ? store.commit(REPLACE, {
      to: to,
      from: from,
      name: name
    }) : routes.splice(Routes.length - 1, 1, name);
    window.sessionStorage.VUE_NAVIGATION = JSON.stringify(routes);
    bus.$emit('replace', to, from);
  };

  var refresh = function refresh(toRoute, fromRoute) {
    var to = {
      route: toRoute
    };
    var from = {
      route: fromRoute
    };
    var routes = store ? store.state[moduleName].routes : Routes;
    to.name = from.name = routes[routes.length - 1];
    store ? store.commit(REFRESH, {
      to: to,
      from: from
    }) : null;
    bus.$emit('refresh', to, from);
  };

  var reset = function reset() {
    store ? store.commit(RESET) : Routes.splice(0, Routes.length);
    window.sessionStorage.VUE_NAVIGATION = JSON.stringify([]);
    bus.$emit('reset');
  };

  var record = function record(toRoute, fromRoute, replaceFlag) {
    var name = getKey(toRoute, keyName);

    if (replaceFlag) {
      replace(name, toRoute, fromRoute);
    } else {
      var toIndex = Routes.lastIndexOf(name);

      if (toIndex === -1) {
        forward(name, toRoute, fromRoute);
      } else if (toIndex === Routes.length - 1) {
        refresh(toRoute, fromRoute);
      } else {
        back(Routes.length - 1 - toIndex, toRoute, fromRoute);
      }
    }
  };

  return {
    record: record,
    reset: reset
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
        vnode.key = vnode.key || (vnode.isComment ? 'comment' : vnode.tag);
        var key = getKey(this.$route, keyName);

        if (vnode.key.indexOf(key) === -1) {
          vnode.key = "__navigation-".concat(key, "-").concat(vnode.key);
        }

        if (this.cache[key]) {
          if (vnode.key === this.cache[key].key) {
            vnode.componentInstance = this.cache[key].componentInstance;
          } else {
            this.cache[key].componentInstance.$destroy();
            this.cache[key] = vnode;
          }
        } else {
          this.cache[key] = vnode;
        }

        vnode.data.keepAlive = true;
      }

      return vnode;
    }
  };
});

var index = {
  install: function install(Vue) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        router = _ref.router,
        store = _ref.store,
        _ref$moduleName = _ref.moduleName,
        moduleName = _ref$moduleName === void 0 ? 'navigation' : _ref$moduleName,
        _ref$keyName = _ref.keyName,
        keyName = _ref$keyName === void 0 ? 'VNK' : _ref$keyName;

    if (!router) {
      console.error('vue-navigation need options: router');
      return;
    }

    var bus = new Vue();
    var navigator = Navigator(bus, store, moduleName, keyName);
    var routerReplace = router.replace.bind(router);
    var replaceFlag = false;

    router.replace = function (location, onComplete, onAbort) {
      replaceFlag = true;
      routerReplace(location, onComplete, onAbort);
    };

    router.beforeEach(function (to, from, next) {
      if (!to.query[keyName]) {
        var query = _objectSpread({}, to.query);

        if (to.path === from.path && isObjEqual(_objectSpread({}, to.query, _defineProperty({}, keyName, null)), _objectSpread({}, from.query, _defineProperty({}, keyName, null))) && from.query[keyName]) {
          query[keyName] = from.query[keyName];
        } else {
          query[keyName] = genKey();
        }

        next({
          name: to.name,
          params: to.params,
          query: query,
          replace: replaceFlag || !from.query[keyName]
        });
      } else {
        next();
      }
    });
    router.afterEach(function (to, from) {
      navigator.record(to, from, replaceFlag);
      replaceFlag = false;
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
