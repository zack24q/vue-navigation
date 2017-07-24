<template>
  <page>
    <div class="detail">
      <p>This is the <b>detail</b> page, detail id is {{id}}</p>
      <p>random number: {{random}}</p>
      <a href="javascript:void(0)" @click="goToNextDetail">go to next detail</a>
      <br>
      <a href="javascript:void(0)" @click="resetToIndex">reset to index</a>
    </div>
  </page>
</template>

<script>
  import Page from '../components/Page.vue'

  export default {
    name: 'detail',
    components: {Page},
    data() {
      return {
        id: Number(this.$route.params.id),
        random: Math.random().toFixed(4)
      }
    },
    activated() {
      // console.log('detail activated')
    },
    deactivated() {
      // console.log('detail deactivated')
    },
    beforeRouteUpdate(to, from, next) {
      this.id = Number(to.params.id)
      next()
    },
    methods: {
      goToNextDetail() {
        this.$router.push(`/list/${this.id >= 30 ? 30 : this.id + 1}`)
      },
      resetToIndex() {
        // clean the routes
        this.$navigation.cleanRoutes()
        // jump to index
        this.$router.push('/')
      }
    }
  }
</script>
