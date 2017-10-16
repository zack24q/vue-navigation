# vue-navigation

[![npm](https://img.shields.io/npm/dm/vue-navigation.svg)](https://www.npmjs.com/package/vue-navigation)
[![npm](https://img.shields.io/npm/v/vue-navigation.svg)](https://www.npmjs.com/package/vue-navigation)<!-- [![npm (tag)](https://img.shields.io/npm/v/vue-navigation/next.svg)](https://www.npmjs.com/package/vue-navigation) -->
[![npm](https://img.shields.io/npm/l/vue-navigation.svg)](https://www.npmjs.com/package/vue-navigation)
[![Github file size](https://img.shields.io/github/size/zack24q/vue-navigation/dist/vue-navigation.esm.min.js.svg)](https://github.com/zack24q/vue-navigation/blob/master/dist/vue-navigation.esm.min.js)

> require [vue](https://github.com/vuejs/vue) `2.x` and [vue-router](https://github.com/vuejs/vue-router) `2.x`.

[中文文档](https://github.com/zack24q/vue-navigation/blob/master/README_CN.md)

vue-navigation default behavior is similar to native mobile app (A、B、C are pages):

1. A forward to B, then forward to C;
2. C back to B, B will **recover from cache**;
3. B forward to C again, C will **rebuild, not recover from cache**;
4. C forward to A, A will **build, now the route contains two A instance**.

**!important: vue-navigation adds a key to the url to distinguish the route. The default name of the key is VNK, which can be modified.**

### DEMO

[DEMO](https://zack24q.github.io/vue-navigation/examples/)

[CODE](https://github.com/zack24q/vue-navigation/tree/master/examples)

## Installing

```bash
npm i -S vue-navigation
```

or

```bash
yarn add vue-navigation
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

## Options

Only `router` is required.

```javascript
Vue.use(Navigation, {router, store, moduleName: 'navigation', keyName: 'VNK'})
```

## Events
functions: [ `on` | `once` | `off` ]

event types: [ `forward` | `back` | `replace` | `refresh` | `reset` ]

parameter( `to` | `from` ) properties:
- `name`
  - type: string
  - desc: name of the route(contains the key)
- `route`
  - type: object
  - desc: vue-route`s route object

```javascript
this.$navigation.on('forward', (to, from) => {})
this.$navigation.once('back', (to, from) => {})
this.$navigation.on('replace', (to, from) => {})
this.$navigation.off('refresh', (to, from) => {})
this.$navigation.on('reset', () => {})
```

## Methods

Use `Vue.navigation` in global environment or use `this.$navigation` in vue instance.

- `getRoutes()` get the routing records
- `cleanRoutes()` clean the routing records
