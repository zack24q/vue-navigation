/**
* vue-navigation v0.1.1
* https://github.com/zack24q/vue-navigation
* Released under the MIT License.
*/

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.VueNavigation = factory());
}(this, (function () { 'use strict';

var Navigation = {
  install: function (Vue, options) {
    if (!options) {
      console.error('navigation need options');
      return
    }
    var router = options.router;
    if (!router) {
      console.error('navigation need options.router');
      return
    }
    var store = options.store;

    var history = [];
    if (window.sessionStorage.VUE_HISTORY) {
      history = JSON.parse(window.sessionStorage.VUE_HISTORY);
    }

    if (store) {
      var moduleName = options.moduleName || 'navigation';
      store.registerModule(moduleName, {
        state: {history: history},
        mutations: {
          'navigation/FORWARD': function (state, name) {
            state.history.push(name);
          },
          'navigation/BACK': function (state, count) {
            state.history.splice(state.history.length - count, count);
          }
        }
      });
    }

    var forward = function (name) {
      if (store) {
        store.commit('navigation/FORWARD', name);
      } else {
        history.push(name);
      }
      window.sessionStorage.VUE_HISTORY = JSON.stringify(history);
      console.info('navigation: forward');
    };
    var back = function (count) {
      if (store) {
        store.commit('navigation/BACK', count);
      } else {
        history.splice(history.length - count, count);
      }
      window.sessionStorage.VUE_HISTORY = JSON.stringify(history);
      console.info('navigation: back');
    };
    var refresh = function () {
      console.info('navigation: refresh');
    };

    router.afterEach(function (to, from) {
      var matched = to.matched[to.matched.length - 1];
      var component = matched.components.default;
      component.name = component.name || matched.path;
      var toIndex = history.lastIndexOf(component.name);
      if (toIndex === -1) {
        forward(component.name);
      } else if (toIndex !== history.length - 1) {
        back(history.length - 1 - toIndex);
      } else {
        refresh();
      }
    });

    Vue.component('navigation', {
      render: function (createElement) {
        return createElement(
          'keep-alive',
          {props: {include: this.historyStr}},
          this.$slots.default
        )
      },
      data: function () {
        return {
          history: history
        }
      },
      computed: {
        historyStr: function () {
          console.log(this.history);
          return this.history.join(',')
        }
      }
    });

    var navigation = {
      getHistory: function () {
        return history.slice()
      }
    };
    Vue.navigation = navigation;
    Vue.prototype.$navigation = navigation;
  }
};

return Navigation;

})));
