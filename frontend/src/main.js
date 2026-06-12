import { createApp } from 'vue'
import { createHead } from '@unhead/vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import router from './router'
import './assets/main.css'

import en from './locales/en.json'
import ar from './locales/ar.json'
import de from './locales/de.json'
import fr from './locales/fr.json'
import ja from './locales/ja.json'
import zh from './locales/zh.json'
import ko from './locales/ko.json'

const messages = { en, ar, de, fr, ja, zh, ko }

const getInitialLocale = () => {
  const saved = localStorage.getItem('locale')
  if (saved && messages[saved]) return saved
  const browserLang = navigator.language?.split('-')[0]
  if (browserLang && messages[browserLang]) return browserLang
  return 'en'
}

const i18n = createI18n({
  locale: getInitialLocale(),
  fallbackLocale: 'en',
  messages,
  legacy: false,
  globalInjection: true,
})

const head = createHead()

const app = createApp(App)
app.use(head)
app.use(i18n)
app.use(router)
app.mount('#app')