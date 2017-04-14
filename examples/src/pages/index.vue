<template>
  <page>
    <div class="index">
      <p>This is the <b>index</b> page</p>
      <p>random number: {{random}}</p>
      <router-link to="list">go to list page</router-link>
    </div>
  </page>
</template>

<script>
  import Page from '../components/Page.vue'
  export default{
    components: {Page},
    data(){
      return {
        random: Math.random().toFixed(4)
      }
    },
    activated() {
      console.log('index activated')
    },
    deactivated() {
      console.log('index deactivated')
    }
  }
</script>
