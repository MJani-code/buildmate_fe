<!-- use responsHandler store to set data of dialog -->
<template>
  <v-dialog :value="show" width="500">
    <v-card>
      <v-card-title>
        <span class="headline">{{ title }}</span>
      </v-card-title>
      <v-card-text>
        {{ message }}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue darken-1"
          @click="close"
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
