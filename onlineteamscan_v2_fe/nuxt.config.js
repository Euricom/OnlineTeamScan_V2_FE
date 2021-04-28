import colors from 'vuetify/es5/util/colors'
import {defaults} from "@nuxtjs/vuetify/dist/options";

export default {
  ssr: false,
  head: {
    titleTemplate: '%s',
    title: 'Online Team Scan',
    htmlAttrs: {
      lang: 'nl'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  css: [
  ],

  plugins: [
  ],

  components: true,

  buildModules: [
    '@nuxtjs/vuetify',
  ],

  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth-next'
  ],
  //Auth settings
  auth: {
    redirect: {
      login: '/login',
      logout: '/login',
      callback: '/login',
      home: '/dashboard'
    },
    strategies: {
      local: {
        user: {
          property: false,
          autoFetch: true
        },
        endpoints: {
          login: { url: 'authenticate/login', method: 'post', propertyName: 'token' },
          user: { url: 'authenticate/user', method: 'get'},
          logout: false
        }
      },
    }
  },
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      light: true,
      defaultTheme: 'light',
      themes: {
        light: {
          'custom-primary': '#33343A',
          'custom-green': '#71BF42',
          'custom-red': '#F95656',
          'custom-grey': '#A8A8A8',
          primary: '#71BF42',
          secondary: '#424242',
          accent: '#a1ff69',
          error: '#F95656',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFC107',
        }
      }
    }
  },

  build: {
  },

  axios: {
      baseURL: `${process.env.NUXT_ENV_API_BASE_URI}`,
  },
}
