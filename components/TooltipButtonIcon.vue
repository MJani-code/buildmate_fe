<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        :class="classes"
        color="primary"
        :rounded="rounded"
        :color="color"
        :target="target"
        :href="href"
        :text="textButton"
        :disabled="disabled"
        v-bind="attrs"
        v-on="on"
        @click="$emit('@click')"
      >
        <Icon :icon="icon"/>
      </v-btn>
    </template>
    <span>{{ text }}</span>
  </v-tooltip>
</template>

<script>
export default {
  name: "TooltipButtonIcon",
  props: {
    icon: {
      type: String,
      default(){
        return 'icon';
      },
    },
    text: {
      type: String,
      default(){
        return 'Tooltip';
      },
    },
    color: {
      type: String,
      default(){
        return '';
      },
    },
    rounded: {
      type: Boolean,
      default(){
        return false;
      },
    },
    target: {
      type: String,
      default(){
        return '';
      },
    },
    href: {
      type: String,
      default(){
        return '';
      },
    },
    classes: {
      type: String,
      default(){
        return '';
      },
    },
    textButton: {
      type: Boolean,
      default(){
        return false;
      },
    },
    disabled: {
      type: Boolean,
      default(){
        return false;
      },
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
