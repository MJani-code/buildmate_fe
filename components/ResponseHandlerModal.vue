<template>
  <div data-app v-if="show" :value="show">
    <v-app>
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
            <v-btn v-for="(button, index) in buttons" :key="index" :color="button.color" @click="handleOption(button)"
              :style="`color: ${colorByType.text}`">
              {{ button.label }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-app>
  </div>
</template>

<script>
export default {
  name: 'ResponseHandlerModal',
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
      return this.$store.state.responseHandler.type;
    },
    colorByType() {
      switch (this.$store.state.responseHandler.type) {
        case 'success':
          return { bg: '#359756', text: 'black' };
        case 'warning':
          return { bg: 'warning', text: 'black' };
        case 'error':
          return { bg: 'error', text: 'black' };
        case 'confirm':
          return { bg: '#359756', text: 'black' };
      }
    },
    buttons() {
      switch (this.$store.state.responseHandler.type) {
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
        case 'confirm':
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
      }
    },
  },
  methods: {
    handleOption(button) {
      this.$store.commit('TOGGLE_RESPONSEHANDLER');
      if (button.action) {
        this.$store.dispatch(button.action);
        this.$store.commit('SET_CLICKED_BUTTON', button.action);
      }
    },
  },
};
</script>

<style scoped>
/* Stílusok a komponenshez */
</style>




<!-- use responsHandler store to set data of dialog
<template>
  <v-dialog :value="show" width="500">
    <v-card>
      <v-card-title>
        <span class="headline" >{{ title }}</span>
      </v-card-title>
      <v-card-text >
        {{ message }}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn v-for="(option, index) in options" :key="index" :color=colorByType.bg @click="handleOption(option)"
          >
          {{ option }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ResponseHandlerModal',
  beforeMount() {

  },
  computed: {
    show() {
      return this.$store.state.responseHandler.show
    },
    title() {
      return this.$store.state.responseHandler.title
    },
    message() {
      return this.$store.state.responseHandler.message
    },
    type() {
      return this.$store.state.responseHandler.type
    },
    colorByType() {
      switch (this.$store.state.responseHandler.type) {
        case 'success':
          return { bg: '#359756', text: 'black' };
        case 'warning':
          return { bg: 'warning', text: 'black' };
        case 'error':
          return { bg: 'error', text: 'black' };
        case 'confirmLogout':
          return { bg: '#359756', text: 'black' };
      }
    },
    options() {
      return this.$store.state.responseHandler.options;
    },
  },
  methods: {
    close() {
      this.$store.commit('TOGGLE_RESPONSEHANDLER')
    }
  }
}
</script>

<style scoped></style> -->
