/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
    './app.vue'
  ],
  darkMode: 'class',
  variants: {
    extend: {
      borderStyle: ['responsive', 'hover'],
      borderWidth: ['responsive', 'hover']
    }
  },
  plugins: [
    require('postcss-import'),
    require('tailwindcss'),
    require('autoprefixer')
  ],
  theme: {
    screens: {
      xs: '375px',
      ss: '540px',
      sm: '769px',
      md: '1024px',
      lg: '1216px',
      'lg+': '1440px',
      xl: '1616px',
      '2xl': '1890px'
    },
    extend: {
      blur: {
        xs: '1px'
      },
      width: {
        130: '130px'
      },
      gridTemplateRows: {
        'xs-card': '160px'
      },
      gridTemplateColumns: {
        'xs-card': '90px 1fr',
        'ss-card': '120px 1fr',
        'sm-card': '160px 1fr'
      },
      colors: {
        'rd-green': '#B9FF6E',
        'rd-border-purple': '#2C2634',
        'rd-new-divider': '#424245',
        'rd-new-won': '#FFDC7E',
        'rd-main': '#f7f0ff',
        'rd-pelati': '#FE2F2F',
        'rd-anon': '#bdbdc9',
        'rd-charlotte': '#A6F2F9',
        'rd-midnight': '#030229',
        'rd-main-dark': '#000024',
        'rd-trusted-purple': '#6909C6',
        'rd-prune-plum': 'rgba(31, 28, 63, 0.2)',
        'rd-dark-horizon': {
          500: 'rgba(98, 103, 149, 0.5)',
          700: 'rgba(98, 103, 149, 0.7)'
        },
        'rd-hadopelagic-water': 'rgba(0, 0, 36, 0.5)',
        'rd-highlight': 'rgba(116, 85, 239, 1)',
        'rd-highlight-dark': 'rgba(182, 123, 238, 1)',
        'rd-high': 'rgba(51, 47, 101, 1)',
        'rd-high-dark': 'rgba(166, 242, 249, 1)',
        'rd-subtext': 'rgba(98, 103, 149, 1)',
        'rd-subtext-dark': '#626795',
        'rd-cosmic': '#b9bbce',
        'rd-nightin-manchester': '#2d53b2',
        'rd-signbutton-1': '#7A27CB',
        'rd-signbutton-2': '#E387C1',
        'rd-border-fancy-table': 'rgba(98, 103, 149, 0.2)',
        'rd-border-fancy': 'rgba(98, 103, 149, 0.2)',
        'rd-border-fancy-dark': '#33375F',
        'rd-title-white-dark': '#A7A9BA',
        'rd-card-title-dark': '#332f65',
        'rd-aconite-violet': '#a14ff0',
        'rd-dark-lavender': '#7D569F',
        'rd-border-card': '#403988',
        'rd-white-opacity': {
          100: 'rgba(255, 255, 255, 0.1)',
          120: 'rgba(255, 255, 255, 0.2)',
          150: 'rgba(255, 255, 255, 0.3)',
          160: 'rgba(255, 255, 255, 0.4)',
          200: 'rgba(255, 255, 255, 0.5)',
          250: 'rgba(255, 255, 255, 0.95)',
          300: 'rgba(255, 255, 255, 1)',
          600: 'rgba(255, 255, 255, 0.6)'
        },
        'rd-black-opacity': {
          100: 'rgba(0, 0, 0, 0)',
          200: 'rgba(0, 0, 0, 0.25)',
          300: 'rgba(0, 0, 36, 0.25)',
          250: 'rgba(0, 0, 0, 0.2)',
          400: 'rgba(0, 0, 0, 0.3)'
        },
        'rd-hadopelagic-water': 'rgba(0, 0, 36, 0.2)',
        'rd-blue-charcoal': '#010022',
        'rd-footer': '#d8dbf1',
        'rd-highpurple': '#9e68ff',
        'rd-border-card-special': '#8d42c3',
        'rd-border-card-special-dark': '#a56cd5',
        'rd-border-white': {
          100: 'rgba(255, 255, 255, 0.3)'
        },
        'rd-silver-opacity': {
          100: 'rgba(185, 187, 205, 0.5)'
        },
        'rd-dark-slate-blue': '#403988',
        'rd-separator-card': 'rgba(64, 57, 136, 0.5)',
        'rd-content-card-dark': '#0E1052',
        'rd-cornflower-blue': '#080b38a8',
        'rd-content-alert-card': '#EDEDF3',
        'rd-transparent-white-card': '#ffffff9e',
        'rd-transparent-dark-card': '#000000c9',
        'rd-transparent-high-white-card': '#ffffffcc',
        'rd-transparent-high-dark-card': '#000000ab',
        'rd-pink': '#FBD0FF',
        'rd-purple': '#6530c6',
        'rd-purple-dark': '#5041fd',
        'rd-dark-blue': '#080b3875',
        'rd-hadopelagic-water': 'rgba(0, 0, 36, 0.8)',
        'rd-majestic-eggplant': '#403984',
        'rd-dark-slate-blue-alpha': {
          100: 'rgba(64, 57, 136, 0.2)'
        },
        'rd-spanish-grey': 'rgba(151, 151, 151, 0.15)',
        'rd-light-gray-opacity': 'rgba(98, 103, 149, 0.4)',
        'rd-light-gray': '#A7A9BA',
        'rd-cyan': '#a6f2fa',
        'rd-bunting': '#121147',
        'rd-cotton-seed': 'rgba(198, 186, 186, 0.1)',
        'rd-wild-trawberry': '#FE2F93',
        'rd-unicorn-dust': 'rgba(254, 47, 147, 0.2)',
        'rd-himalay-balsam': '#ff9ecd',
        'rd-azulado': '#271846',
        'rd-leagues-under-the-sea': {
          100: 'rgba(25, 28, 112, 0.1)',
          500: 'rgba(25, 28, 112, 0.5)'
        },
        'rd-grim-purple': '#411996',
        'rd-light-periwinkle': '#C0C6F7',
        'rd-tulip-tree': '#e7ad3c',
        'rd-lost-in-sadness': 'rgb(23,21,55)',
        'rd-majestic-eggplant': {
          '0-16': 'rgba(64, 57, 132, 0.16)',
          100: 'rgba(64, 57, 136, 1)'
        },
        'rd-dark-moon': '#13132f',
        'rd-blue-magenta-violet': '#502f94'
      },
      backgroundImage: (theme) => { },
      zIndex: {
        1: '-1'
      },
      fill: {
        'rd-dark-horizon': '#626795',
        'rd-fill-dark': '#332f65',
        'purple-dark': '#5041fd',
        dark: 'rgba(25, 28, 112, 1)',
        'rd-charlotte-fill': '#A6F2F9',
        'white-opacity-2': 'rgba(255, 255, 255, 0.2)'
      },
      stroke: {
        white: '#fff',
        'rd-light-gray': '#A7A9BA',
        'rd-dark-horizon': {
          500: 'rgba(98, 103, 149, 0.5)',
          700: 'rgba(98, 103, 149, 0.7)'
        },
        'rd-purple-dark': '#5041fd'
      },
      minWidth: {
        128: '40rem'
      },
      borderWidth: {
        5: '5px'
      },
      boxShadow: {
        'rd-modal-shadow-mod': '0px 28px 124px rgba(67, 27, 105, 0.4)',
        'rd-select-box-shadow-mod': '0px 24px 64px rgba(98, 17, 100, 0.25)',
        'rd-select-list-shadow-mod': '0px 24px 64px rgba(98, 17, 100, 0.25)',
        'rd-card-shadow-mod': '0px 44px 184px rgba(0, 0, 0, 0.25)',
        'rd-mvp-item-shadow-mod': '0px 44px 184px rgba(0, 0, 0, 0.25)'
      }
    }
  }
}
