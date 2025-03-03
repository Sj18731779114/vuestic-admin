import './scss/main.scss'

import { createApp } from 'vue'
import App from './App.vue'
import i18n from './i18n'
import { createVuestic } from 'vuestic-ui'
import { createGtm } from '@gtm-support/vue-gtm'

import stores from './stores'
import router from './router'
import vuesticGlobalConfig from './services/vuestic-ui/global-config'

import axios from 'axios'

declare global {
  interface Window {
    baseUrl: string
  }
}

// 加载 config.json 文件
axios
  .get('/config.json')
  .then((response) => {
    const config = response.data
    window.baseUrl = process.env.NODE_ENV === 'production' ? config.baseUrl.production : config.baseUrl.development

    const app = createApp(App)

    app.use(stores)
    app.use(router)
    app.use(i18n)
    app.use(createVuestic({ config: vuesticGlobalConfig }))

    if (import.meta.env.VITE_APP_GTM_ENABLED) {
      app.use(
        createGtm({
          id: import.meta.env.VITE_APP_GTM_KEY,
          debug: false,
          vueRouter: router,
        }),
      )
    }

    app.mount('#app')
  })
  .catch((error) => {
    console.error('Failed to load config.json:', error)
  })
