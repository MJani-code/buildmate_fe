<template>
  <v-dialog v-if="show" :value="show" width="500" persistent>
    <v-card>
      <v-card-title>
        <span class="headline" :style="`color: ${colorByType.text}`">{{ title }}</span>
      </v-card-title>
      <v-card-text :style="`color: ${colorByType.text}`">
        {{ message }}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          v-for="(button, index) in buttons"
          :key="index"
          :color="button.color"
          @click="handleOption(button)"
          :style="`color: ${colorByType.text}`"
        >
          {{ button.label }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      color: "black"
    }
  },
  name: 'ResponseHandlerModal',
  watch:{
    '$vuetify.theme.isDark': {
      immediate: true, // Azonnali kiváltás a komponens létrehozásakor
      handler(isDark) {
        this.color = isDark ? 'white' : 'black';
      },
    },
  },
  computed: {
    show() {
      return this.$store.state.responseHandler.show;
    },
    title() {
      return this.$store.state.responseHandler.title;
    },
    message() {
      return this.$store.state.responseHandler.message;
    },
    type() {
      return this.$store.state.responseHandler.type.action;
    },
    colorByType() {
      switch (this.$store.state.responseHandler.type.action) {
        case 'success':
          return { bg: '#359756', text: this.color };
        case 'warning':
          return { bg: 'warning', text: this.color };
        case 'error':
          return { bg: 'error', text: this.color };
        case 'confirmLogout':
          return { bg: '#359756', text: this.color };
        case 'confirmPoll':
          return { bg: '#359756', text: this.color };
      }
    },
    buttons() {
      switch (this.$store.state.responseHandler.type.action) {
        case 'success':
        case 'warning':
        case 'error':
          return [
            {
              label: 'Bezár',
              color: this.colorByType.bg,
              action: null,
            },
          ];
        case 'confirmLogout':
          return [
            {
              label: 'Mégsem',
              color: 'grey',
              action: null,
            },
            {
              label: 'Igen',
              color: '#359756',
              action: 'confirmLogout',
            }
          ];
          case 'confirmPoll':
          return [
            {
              label: 'Mégsem',
              color: 'grey',
              action: null,
            },
            {
              label: 'Igen',
              color: '#359756',
              action: 'confirmPoll',
            }
          ];
      }
    },
  },
  methods: {
    handleOption(button) {
      this.$store.commit('TOGGLE_RESPONSEHANDLER');
      if (button.action) {
        this.$emit('response-handled', button.action);
        this.$store.dispatch(button.action);
        this.$store.commit('SET_CLICKED_BUTTON', button.action);
      }
    },
  },
};
</script>