<template>
  <div class="page">
    <div class="header">
      <div class="left" @click="back">back</div>
      <div class="center">title</div>
      <div class="right"></div>
    </div>
    <div class="content" @scroll="scroll" ref="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'page',
    data () {
      return {
        scrollTop: 0
      }
    },
    methods: {
      back () {
        window.history.back()
      },
      scroll () {
        this.scrollTop = this.$refs.content.scrollTop
      }
    },
    activated () {
      this.$refs.content.scrollTop = this.scrollTop
    }
  }
</script>

<style>
  .page {
    height: 100%;
    position: relative;
  }

  .header {
    background-color: #fff;
    position: absolute;
    width: 100%;
    top: 0px;
    height: 48px;
    line-height: 48px;
    border-bottom: 1px solid #e0e0e0;
    display: flex;
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
    position: absolute;
    box-sizing: border-box;
    width: 100%;
    top: 49px;
    bottom: 0px;
    overflow: auto;
  }
</style>
