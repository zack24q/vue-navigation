# vue-navigation

[![npm](https://img.shields.io/npm/dm/vue-navigation.svg)](https://www.npmjs.com/package/vue-navigation)
[![npm](https://img.shields.io/npm/v/vue-navigation.svg)](https://www.npmjs.com/package/vue-navigation)<!-- [![npm (tag)](https://img.shields.io/npm/v/vue-navigation/next.svg)](https://www.npmjs.com/package/vue-navigation) -->
[![npm](https://img.shields.io/npm/l/vue-navigation.svg)](https://www.npmjs.com/package/vue-navigation)
[![Github file size](https://img.shields.io/github/size/zack24q/vue-navigation/dist/vue-navigation.esm.min.js.svg)](https://github.com/zack24q/vue-navigation/blob/master/dist/vue-navigation.esm.min.js)

> 需要 [vue](https://github.com/vuejs/vue) `2.x` 与 [vue-router](https://github.com/vuejs/vue-router) `2.x`。


导航默认行为类似手机APP的页面导航（A、B、C为页面）：

1. A前进到B，再前进到C；
2. C返回到B时，B会**从缓存中恢复**；
3. B再次前进到C，C会**重新生成，不会从缓存中恢复**；
4. C前进到A，A会**生成，现在路由中包含2个A实例**。

**！重要：vue-navigation在url中添加了一个key来区分路由。key的名称默认为VNK，可以修改。**

### 在线演示

[演示地址](https://zack24q.github.io/vue-navigation/examples/)

[代码地址](https://github.com/zack24q/vue-navigation/tree/master/examples)

## 安装

```bash
npm i -S vue-navigation
```

或

```bash
yarn add vue-navigation
```

## 使用

### 基础使用

main.js

```javascript
import Vue from 'vue'
import router from './router' // vue-router 实例
import Navigation from 'vue-navigation'

Vue.use(Navigation, {router})
// 启动你的应用...
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
import router from './router' // vue-router 实例
import store from './store' // vuex store 实例
import Navigation from 'vue-navigation'

Vue.use(Navigation, {router, store})
// 启动你的应用...
```

传入 `store` 后，`vue-navigation` 会向 `store` 注册一个Module（Module的默认名称为 `navigation`），同时在页面跳转时会提交 `navigation/FORWARD` 或 `navigation/BACK` 或 `navigation/REFRESH`。

## Options

只有`route`是必须的.

```javascript
Vue.use(Navigation, {router, store, moduleName: 'navigation', keyName: 'VNK'})
```

### 事件
方法: [ `on` | `once` | `off` ]

事件类型: [ `forward` | `back` | `replace` | `refresh` | `reset` ]

参数( `to` | `from` ) 的属性:
- `name`
  - 类型: string
  - 描述: 路由的名称（包含key）
- `route`
  - 类型: object
  - 描述: vue-route的路由信息对象

```javascript
this.$navigation.on('forward', (to, from) => {})
this.$navigation.once('back', (to, from) => {})
this.$navigation.on('replace', (to, from) => {})
this.$navigation.off('refresh', (to, from) => {})
this.$navigation.on('reset', () => {})
```

## 方法

在全局环境中使用 `Vue.navigation` 或在Vue实例中使用 `this.$navigation`

- `getRoutes()` 获取路由记录
- `cleanRoutes()` 清空路由记录
