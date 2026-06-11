<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <Navbar />
    <main class="flex-1">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

// Update HTML direction for RTL support
watch(locale, (newLocale) => {
  document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr'
  document.documentElement.lang = newLocale
}, { immediate: true })
</script>