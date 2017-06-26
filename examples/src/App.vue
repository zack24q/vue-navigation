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
    created(){
      // bind event
      this.$navigation.on('forward', (from, to) => {
        console.log(`forward from ${from} to ${to}`)
      })
      this.$navigation.on('back', (from, to) => {
        console.log(`back from ${from} to ${to}`)
      })
      this.$navigation.on('refresh', (current) => {
        console.log(`refresh ${current}`)
      })
      this.$navigation.on('reset', () => {
        console.log(`reset`)
      })
      // and use [once, off] methods
      this.$navigation.once('forward', (from, to) => {
        console.log('once')
      })
      const off = () => {
        console.log('off')
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
    transition: opacity .3s
  }

  .fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */
  {
    opacity: 0
  }
</style>
