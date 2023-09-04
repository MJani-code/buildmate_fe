import colors from 'vuetify/es5/util/colors';

export default {
  head: {
    title: 'LastMinute',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/sss' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap',
      },
    ],
  },
  css: ['@/assets/css/main.css', 'aos/dist/aos.css', 'vuetify/dist/vuetify.css'],
  plugins: ['~/plugins/smooth-scroll.js', '~/plugins/mdi.js', '~/mixins/defaultMixin.js', '~/store/index.js'],
  components: true,
  buildModules: ['@nuxt/postcss8', '@nuxtjs/vuetify'],
  modules: [],
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  build: {
    postcss: {
      plugins: {
        tailwindcss: {},
        autoprefixer: {},
      },
    },
  },
  /**
  buildDir: 'nuxt-dist',
   */
}
