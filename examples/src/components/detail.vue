<template>
  <div class="detail">
    <p>This is the <b>detail</b> page, detail id is {{id}}</p>
    <p>random number: {{random}}</p>
  </div>
</template>

<script>
  export default{
    data(){
      return {
        id: this.$route.params.id,
        random: Math.random().toFixed(4)
      }
    }
  }
</script>
