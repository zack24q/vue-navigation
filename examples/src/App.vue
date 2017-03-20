<template>
  <div id="app">
    <div class="header">
      <div class="left" @click="back">back</div>
      <div class="center">title</div>
      <div class="right"></div>
    </div>
    <div class="content">
      <navigation>
        <router-view></router-view>
      </navigation>
    </div>
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

  p{
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

  .header {
    background-color: #fff;
    height: 48px;
    border-bottom: 1px solid #e0e0e0;
    display: flex;
    line-height: 48px;
  }

  .left, .right {
    width: 40px;
    padding: 0 10px;
    cursor: pointer;
  }

  .center {
    flex: 1;
    text-align: center;
  }

  .content {
    padding: 0 10px;
  }
</style>
