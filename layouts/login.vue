<template>
  <v-app>
    <v-main class="background">
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'Login',
  layout: 'login',
  props: {
    //
  },
  data () {
    return {
      //
    }
  },
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}

body {
  background-color: #359756;
}
.background{
  background-color: #359756;
}

</style>
