// https://v3.nuxtjs.org/api/configuration/nuxt.config
import { NuxtConfig } from '@nuxt/types'

const conf: NuxtConfig = {
  experimental: {
    payloadExtraction: false
  },
  ssr: false,
  target: 'static',
  css: [
    '~/assets/main.scss',
    '@oruga-ui/oruga-next/src/scss/oruga-full-vars.scss'
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },
  modules: ['@vueuse/nuxt', '@nuxtjs/apollo', 'nuxt-aos', '@nuxtjs/i18n'],
  i18n: {
    locales: [
      {
        code: 'en',
        file: 'en-US.json'
      },
      {
        code: 'fr',
        file: 'fr-FR.json'
      }
    ],
    strategy: 'no_prefix',
    langDir: 'lang',
    defaultLocale: 'en',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root' // recommended
    }
  },
  buildModules: ['@nuxt/typescript-build'],
  plugins: ['~/plugins/oruga.js'],
  app: {
    head: {
      title: 'Ridotto - Reinventing the gambling experience',
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }],
      script: [
        {
          async: true,
          src: `https://www.googletagmanager.com/gtag/js?id=${process.env.GOOGLE_ANALYTICS_ID}`
        },
        {
          innerHTML: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.GOOGLE_ANALYTICS_ID}');
          `
        }
      ],
      meta: [
        { charset: 'utf-8' },
        {
          name: 'viewport',
          content:
            'user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height, target-densitydpi=device-dpi'
        },
        {
          name: 'description',
          content:
            'The home of decentralized crypto gaming delivers the best-in-class experience across blockchain. Play games, build games,  bankroll games - and become “The House.” Lotteries, Slot Machines,  Table Games, and more await!'
        },
        { name: 'format-detection', content: 'telephone=no' },
        {
          name: 'og:title',
          content: 'Ridotto - Reinventing the gambling experience'
        },
        {
          name: 'og:description',
          content:
            'The home of decentralized crypto gaming delivers the best-in-class experience across blockchain. Play games, build games,  bankroll games - and become “The House.” Lotteries, Slot Machines,  Table Games, and more await!'
        },
        {
          name: 'og:image',
          content: `${process.env.BASE_URL}/images/twitter/card.jpg`
        },
        {
          name: 'og:type',
          content: 'website'
        },
        {
          name: 'twitter:card',
          content: 'summary_large_image'
        },
        {
          name: 'twitter:site',
          content: '@ridotto_io'
        },
        {
          name: 'twitter:title',
          content: 'Ridotto - Reinventing the gambling experience'
        },
        {
          name: 'twitter:description',
          content:
            'The home of decentralized crypto gaming delivers the best-in-class experience across blockchain. Play games, build games,  bankroll games - and become “The House.” Lotteries, Slot Machines,  Table Games, and more await!'
        },
        {
          name: 'twitter:image',
          content: `${process.env.BASE_URL}/images/twitter/card.jpg`
        }
      ]
    }

  },
  components: {
    global: true,
    dirs: [
      '~/components/atoms',
      '~/components/molecules',
      '~/components/molecules/lottery/',
      '~/components/molecules/profile/',
      '~/components/organisms',
      '~/components/organisms/home/',
      '~/components/organisms/casino/',
      '~/components/organisms/lottery/',
      '~/components/organisms/modals/',
      '~/components/organisms/profile/',
      '~/components/organisms/slot/'
    ]
  },
  runtimeConfig: {
    public: {
      nodeEnv: process.env.NODE_ENV,
      appEnv: process.env.APP_ENV,
      appEnvConfig: process.env.APPLICATION_ENVIRONMENT_CONFIG,
      walletConnectProjectId: process.env.WALLET_CONNECT_PROJECT_ID,
      apiBase: process.env.API_RIDOTTO_BASE,
      walletIcons: process.env.WALLET_ICONS,
      brevoApiKey: process.env.BREVO_API_KEY,
      recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY,
      twitterBaseUrl: process.env.TWITTER_BASE_URL,
      isProduction: process.env.IS_PRODUCTION,
      isHideBankroll: process.env.IS_HIDE_BANKROLL,
      isHideRefferal: process.env.IS_HIDE_REFFERAL,
      azuroLP: process.env.AZURO_LP,
      isHideSports: process.env.IS_HIDE_SPORTS,
      isHideLottery: process.env.IS_HIDE_LOTTERY,
      azuroAffiliate: process.env.AZURO_AFFILIATE,
      strapiURL: process.env.STRAPI_URL,
      strapiApiKey: process.env.STRAPI_APIKEY
    }
  },
  sourceMap: true,
  build: {
    extend(config, { isClient }) {
      if (isClient) {
        config.devtool = 'source-map'
      }
      config.module.rules.push({
        test: /\.(ogg|mp3|wav|mpe?g)$/i,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]'
        }
      })
    }
  },
  apollo: {
    clients: {
      default: {
        httpEndpoint: 'https://api.thegraph.com/subgraphs/name/ridotto-io/ridottolotterybscprod'
      }
    }
  },
  routeRules: {
    '/': { redirect: '/casino/' },
    '/games': { redirect: '/casino/' }
  },
  hooks: {
    'pages:extend'(routes) {
      const Routes = process.env.ROUTE_EXCLUDE_FLAG
      const excludeds = Routes
        ? process.env.ROUTE_EXCLUDE_FLAG!.split(',')
        : console.log(Routes)
      if (excludeds && excludeds.length > 0) {
        excludeds.forEach((excluded) => {
          const index = routes.findIndex(item =>
            item.path.match(new RegExp(excluded, 'i'))
          )
          routes.splice(index, 1)
        })
      }
    }
  }

}

export default conf
