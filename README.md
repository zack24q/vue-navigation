# vue-navigation

[![npm](https://img.shields.io/npm/v/vue-navigation.svg)](https://www.npmjs.com/package/vue-navigation)
[![npm](https://img.shields.io/npm/dm/vue-navigation.svg)](https://www.npmjs.com/package/vue-navigation)

> require [vue](https://github.com/vuejs/vue) `2.x` and [vue-router](https://github.com/vuejs/vue-router) `2.x`.

[中文文档](https://github.com/zack24q/vue-navigation/blob/master/README_CN.md)

vue-navigation default behavior is similar to native mobile app (A、B、C are pages):

1. A forward to B，then forward to C;
2. C back to B，B will **recover from cache**;
3. B back to A，A will **recover from cache**;
4. A forward to B again，B will **rebuild, not recover from cache**.

### DEMO

[DEMO](https://zack24q.github.io/vue-navigation/examples/)

[CODE](https://github.com/zack24q/vue-navigation/tree/master/examples)

## Installing

```bash
npm i -S vue-navigation
```

## Usage

### Basic Usage

main.js

```javascript
import Vue from 'vue'
import router from './router' // vue-router instance
import Navigation from 'vue-navigation'

Vue.use(Navigation, {router})
// bootstrap your app...
```
App.vue

```vue
<template>
  <navigation>
    <router-view></router-view>
  </navigation>
</template>
```

Call `Vue.navigation.getRoutes()` in global environment or call `this.$navigation.getRoutes()` in vue instance can get the page navigation path.

### Use with vuex2

main.js

```javascript
import Vue from 'vue'
import router from './router' // vue-router instance
import store from './store' // vuex store instance
import Navigation from 'vue-navigation'

Vue.use(Navigation, {router, store})
// bootstrap your app...
```

After passing in `store`, `vue-navigation` will register a module in `store` (default module name is `navigation`), and commit `navigation/FORWARD` or `navigation/BACK` or `navigation/REFRESH` when the page jumps.

You can set the name of the module yourself:

```javascript
Vue.use(Navigation, {router, store, moduleName: 'name'})
```
