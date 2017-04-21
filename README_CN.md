# vue-navigation

[![npm](https://img.shields.io/npm/v/vue-navigation.svg)](https://www.npmjs.com/package/vue-navigation)
[![npm](https://img.shields.io/npm/dm/vue-navigation.svg)](https://www.npmjs.com/package/vue-navigation)

> 必须配合 [vue](https://github.com/vuejs/vue) `2.x` 与 [vue-router](https://github.com/vuejs/vue-router) `2.x` 一起使用

导航默认行为类似手机APP的页面导航（A、B、C为页面）：

1. A前进到B，再前进到C；
2. C返回到B时，B的状态从缓存中恢复；
3. B返回到A时，A的状态从缓存中恢复；
4. A再次前进到B时，B重新生成，不从缓存中恢复。

**！重要：因为浏览器不提供页面前进与后退事件，所以本库需要维护一份路由记录来判断前进后退行为，所以目前路由记录中不允许包含重复的路由，现在前进到存在的路由将被识别为返回行为**

### 在线演示

[演示地址](https://zack24q.github.io/vue-navigation/examples/)

[代码地址](https://github.com/zack24q/vue-navigation/tree/master/examples)

## 安装

```bash
npm i -S vue-navigation
```

## 使用

### 基础使用

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

### 搭配vuex2使用

main.js

```javascript
import Vue from 'vue'
import router from './router' // vue-router instance
import store from './store' // vuex store instance
import Navigation from 'vue-navigation'

Vue.use(Navigation, {router, store})
// bootstrap your app...
```

传入 `store` 后，`vue-navigation` 会向 `store` 注册一个Module（Module的默认名称为 `navigation`），同时在页面跳转时会提交 `navigation/FORWARD` 或 `navigation/BACK` 或 `navigation/REFRESH`。

你可以自己设置Module的名称：

```javascript
Vue.use(Navigation, {router, store, moduleName: 'name'})
```
## 方法

在全局环境中使用 `Vue.navigation` 或在Vue实例中使用 `this.$navigation`

- `getRoutes()` 获取路由记录
- `cleanRoutes()` 清空路由记录
