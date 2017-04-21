<template>
  <div id="app">
    <navigation>
      <router-view></router-view>
    </navigation>
  </div>
</template>

<script>
  export default {
    name: 'app',
    methods: {
      back () {
        window.history.back()
      }
    }
  }
</script>

<style>
  html, body, #app {
    height: 100%;
    margin: 0;
  }

  p {
    margin: .5em 0;
  }

  a {
    line-height: 40px;
  }

  #app {
    margin: 0 auto;
    background-color: #f0f0f0;
    max-width: 414px;
    height: 100%;
  }
</style>
