<template>
  <div id="app">
    <transition name="fade">
      <navigation>
        <router-view></router-view>
      </navigation>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'app',
    created() {
      // bind event
      this.$navigation.on('forward', (to, from) => {
        console.log('forward to', to, 'from ', from)
      })
      this.$navigation.on('back', (to, from) => {
        console.log('back to', to, 'from ', from)
      })
      this.$navigation.on('replace', (to, from) => {
        console.log('replace to', to, 'from ', from)
      })
      this.$navigation.on('refresh', (to, from) => {
        console.log('refresh to', to, 'from ', from)
      })
      this.$navigation.on('reset', () => {
        console.log('reset')
      })
      // and use [once, off] methods
      this.$navigation.once('forward', () => {
        console.log('appear once')
      })
      const off = () => {
        console.log('will not appear')
      }
      this.$navigation.on('forward', off)
      this.$navigation.off('forward', off)
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

  .fade-enter-active, .fade-leave-active {
    transition: opacity .25s
  }

  .fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */
  {
    opacity: 0
  }
</style>
