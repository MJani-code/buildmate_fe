<template>
  <v-icon style="display: inline" :color="color" :large="large" @click="$emit('icon-click');">mdi-{{icon}}</v-icon>
</template>

<script>
export default {
  name: "Icon",
  props: {
    icon: {
      type: String,
      default(){
        return '';
      }
    },
    color: {
      type: String,
      default(){
        return '';
      }
    },
    large: {
      type: Boolean,
      default(){
        return false;
      }
    },
  },
  data() {
    return {
      //
    };
  },
  computed: {
    //
  },
  methods: {
    //
  },
  watch: {
    //
  },
}
</script>

<style scoped>

</style>
