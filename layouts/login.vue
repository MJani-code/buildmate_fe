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
import { APIGET } from '@/api/apiHelper.js'
export default {
  name: 'Login',
  layout: 'login',
  props: {
    //
  },
  async beforeMount() {
    await APIGET('http://build_mate_be/public/index.php/filestorage', null, true)
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        console.log(err)
      })
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
