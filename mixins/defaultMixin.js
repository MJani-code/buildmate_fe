import Vue from 'vue'
const mixin = {
  name: 'defaultMixin',
  beforeMount() {
    //
  },
  computed: {
    isMobileView() {
      return this.$vuetify.breakpoint.xsOnly
    }
  },
  methods: {
    checkError(response, config = {
      show: true,
      title: 'Hiba',
      message: 'Hiba történt a kérés során.',
      options: [],
      type: 'error'
    })
    {
      this.$store.state.responseHandler = config;
      if (response.status !== 200) {
        this.$store.dispatch('setDefaultResponseHandler')
        this.$store.dispatch('setResponseHandler', config)
      }
    }
  }
}

Vue.mixin(mixin)
