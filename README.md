# vue-navigation

> 必须配合 [vue](https://github.com/vuejs/vue)`2.x` 与 [vue-router](https://github.com/vuejs/vue-router)`2.x` 一起使用

导航默认行为类似手机APP的页面导航（A、B、C为页面）：

1. A前进到B，再前进到C
2. C返回到B时，B的状态从缓存中恢复
3. B返回到A时，A的状态从缓存中恢复
4. A再次前进到B时，B重新生成，不从缓存中恢复

## 安装

```bash
npm i -S vue-navigation
```

## 使用

main.js

```javascript
import Vue from 'vue'
import router from './router'
import Navigation from '../../src'

Vue.use(Navigation, {router})
```
App.vue

```vue
<template>
  <navigation>
    <router-view></router-view>
  </navigation>
</template>
```

## 示例
[代码](https://github.com/zack24q/vue-navigation/tree/master/examples)
