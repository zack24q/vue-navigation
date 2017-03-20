<template>
  <div class="list">
    <p>This is the <b>list</b> page</p>
    <p>random number: {{random}}</p>
    <p v-for="n in 10" :key="n">
      <router-link :to="'list/'+n">go to detail page(id: {{n}})</router-link>
    </p>
  </div>
</template>

<script>
  export default{
    data(){
      return {
        random: Math.random().toFixed(4)
      }
    }
  }
</script>
