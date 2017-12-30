'use strict'

const path = require('path')
const { ENV } = require('./configs/env')

module.exports = {
  srcDir: 'app',

  router: {
    base: ENV.BASE_URL,
  },

  render: {
    gzip: false,
  },

  /*
  ** Headers of the page
  */
  head: {
    title: 'Nuxt.js Boilerplate',
    htmlAttrs: {
      lang: 'ja',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
      { hid: 'description', name: 'description', content: 'Nuxt.js Boilerplate' },
    ],
    // link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend (config, ctx) {
      if (ctx.dev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
        })
      }

      config.module.rules
        .find((rule) => rule.loader === 'vue-loader')
        .options.loaders.scss.push({
          loader: 'sass-resources-loader',
          options: {
            resources: [
              path.join(__dirname, 'app', 'assets', 'scss', '_variables.scss'),
              path.join(__dirname, 'app', 'assets', 'scss', '_mixin.scss'),
            ],
          },
        })
    },
  },

  css: [
    'normalize.css/normalize.css',
    '~assets/scss/styles.scss',
  ],
}
