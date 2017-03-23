# vue-navigation

## ！目前只支持最简单的路由方式（路由地址必须与组件一一对应），复杂的路由方式正在支持中

> 必须配合 [vue](https://github.com/vuejs/vue)`2.x` 与 [vue-router](https://github.com/vuejs/vue-router)`2.x` 一起使用

导航默认行为类似手机APP的页面导航（A、B、C为页面）：

1. A前进到B，再前进到C
2. C返回到B时，B的状态从缓存中恢复
3. B返回到A时，A的状态从缓存中恢复
4. A再次前进到B时，B重新生成，不从缓存中恢复

### 在线演示

[地址](https://zack24q.github.io/vue-navigation/examples/)

## 安装

```bash
npm i -S vue-navigation
```

## 使用

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

在全局环境中调用`Vue.navigation.getRoutes()`或在Vue实例中调用`this.$navigation.getRoutes()`都可以获取页面导航路径

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

传入`store`后，`vue-navigation`会向`store`注册一个Module（默认名称为`navigation`），并在`routes`中存储页面导航路径，同时在页面跳转时会提交`navigation/FORWARD`或`navigation/BACK`

你可以自己设置Module的名称

```javascript
Vue.use(Navigation, {router, store, moduleName: 'name'})
```

## 完整示例
使用vue-cli的官方webpack模板生成 [地址](https://github.com/zack24q/vue-navigation/tree/master/examples)
