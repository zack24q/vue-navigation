<template>
  <page>
    <div class="detail">
      <p>This is the <b>detail</b> page, detail id is {{id}}</p>
      <p>random number: {{random}}</p>
      <a href="javascript:void(0)" @click="resetToIndex">reset to index</a>
    </div>
  </page>
</template>

<script>
  import Page from '../components/Page.vue'
  export default{
    components: {Page},
    data(){
      return {
        id: parseInt(this.$route.params.id),
        random: Math.random().toFixed(4)
      }
    },
    activated() {
      console.log('detail activated')
    },
    deactivated() {
      console.log('detail deactivated')
    },
    methods: {
      resetToIndex(){
        // clean the routes
        this.$navigation.cleanRoutes()
        // jump to index
        this.$router.push('/')
      }
    }
  }
</script>
