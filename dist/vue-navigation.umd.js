/**
* vue-navigation v0.1.4
* https://github.com/zack24q/vue-navigation
* Released under the MIT License.
*/

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.VueNavigation = factory());
}(this, (function () { 'use strict';

var routes = [];

if (window.sessionStorage.VUE_NAVIGATION) {
  routes = JSON.parse(window.sessionStorage.VUE_NAVIGATION);
}

var Routes = routes;

var development = process.env.NODE_ENV === 'development';

var Navigator = function (store, moduleName) {
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
        }
      }
    });
  }

  var forward = function (name) {
    store ? store.commit('navigation/FORWARD', name) : Routes.push(name);
    window.sessionStorage.VUE_NAVIGATION = JSON.stringify(Routes);
    development ? console.info('navigation: forward') : null;
  };
  var back = function (count) {
    store ? store.commit('navigation/BACK', count) : Routes.splice(Routes.length - count, count);
    window.sessionStorage.VUE_NAVIGATION = JSON.stringify(Routes);
    development ? console.info('navigation: back') : null;
  };
  var refresh = function () {
    store ? store.commit('navigation/REFRESH') : null;
    development ? console.info('navigation: refresh') : null;
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
    record: record
  }
};

var NavComponent = {
  name: 'navigation',
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
  },
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

    var navigator = Navigator(store, moduleName);
    var backFlag = false;

    // init page name
    router.beforeEach(function (to, from, next) {
      var matched = to.matched[0];
      if (matched) {
        var component = matched.components.default;
        component.name = component.name || 'anonymous-component-' + matched.path;

        var toIndex = Routes.lastIndexOf(component.name);
        if (toIndex === -1) {
          // forward
          next();
        } else if (toIndex === Routes.length - 1) {
          // refresh
          next();
        } else {
          // back
          if (backFlag) {
            backFlag = false;
            next();
          } else {
            backFlag = true;
            next(false);
            window.history.go(toIndex + 1 - Routes.length);
          }

        }
      } else {
        next();
      }
    });

    // handle router change
    router.afterEach(function (to, from) {
      var matched = to.matched[0];
      if (matched) {
        var component = matched.components.default;
        navigator.record(component.name);
      }
    });

    Vue.component('navigation', NavComponent);

    Vue.navigation = Vue.prototype.$navigation = {
      getRoutes: function () { return Routes.slice(); }
    };
  }
};

return index;

})));
