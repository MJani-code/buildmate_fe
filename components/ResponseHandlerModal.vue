<!-- use responsHandler store to set data of dialog -->
<template>
  <v-dialog :value="show" width="500">
    <v-card :color="colorByType.bg">
      <v-card-title>
        <span class="headline" :style="`color: ${colorByType.text}`">{{ title }}</span>
      </v-card-title>
      <v-card-text :style="`color: ${colorByType.text}`">
        {{ message }}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue darken-1"
          @click="close"
          :style="`color: ${colorByType.text}`"
        >
          Bezár
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ResponseHandlerModal',
  beforeMount() {
    console.log(this.$store.state)
  },
  computed: {
    show(){
      return this.$store.state.responseHandler.show
    },
    title(){
      return this.$store.state.responseHandler.title
    },
    message(){
      return this.$store.state.responseHandler.message
    },
    type(){
      return this.$store.state.responseHandler.type
    },
    colorByType(){
      switch(this.$store.state.responseHandler.type) {
        case 'success':
          return {bg: 'success', text: 'white'};
        case 'warning':
          return {bg: 'warning', text: 'white'};
        case 'error':
          return {bg: 'error', text: 'white'};
      }
    }
  },
  methods: {
    close() {
      this.$store.commit('TOGGLE_RESPONSEHANDLER')
    }
  }
}
</script>

<style scoped>

</style>
