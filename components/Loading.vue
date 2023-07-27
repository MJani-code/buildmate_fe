<template>
  <v-progress-linear
    v-if="isLoading"
    indeterminate
    color="cyan"
  ></v-progress-linear>
</template>
<script>
export default {
  name: 'ProcessLoading',
  props: {
    isLoading: {}
  }
}
</script>