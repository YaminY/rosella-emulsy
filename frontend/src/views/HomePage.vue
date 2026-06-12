<template>
  <div>
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-primary/5 via-white to-primary-light/5 overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div class="max-w-3xl mx-auto text-center">
          <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold text-primary mb-6 leading-tight">
            {{ $t('home.hero.title') }}
          </h1>
          <p class="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed">
            {{ $t('home.hero.subtitle') }}
          </p>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <router-link to="/products" class="btn-primary text-lg px-10 py-4">
              {{ $t('home.hero.cta') }}
            </router-link>
            <a href="#about" class="btn-outline text-lg px-10 py-4">
              {{ $t('home.hero.learnMore') }}
            </a>
          </div>
        </div>
      </div>
      <div class="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-primary-light/5 rounded-full blur-3xl"></div>
    </section>

    <!-- Backend status banner (only shows when Render is waking up) -->
    <div v-if="!backendAvailable && !loading" class="bg-secondary-amber/10 border-b border-secondary-amber/20 text-center py-2 text-xs text-gray-600">
      Admin panel changes may take up to 30s to sync. The site works instantly with local data.
    </div>

    <!-- Featured Products -->
    <section class="py-16 lg:py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="section-title">{{ $t('home.featured.title') }}</h2>
        <p class="section-subtitle">{{ $t('home.featured.subtitle') }}</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          <ProductCard v-for="product in featuredProducts" :key="product.id" :product="product" />
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section id="about" class="py-16 lg:py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="section-title">{{ $t('home.about.title') }}</h2>
        <p class="section-subtitle">{{ $t('home.about.description') }}</p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
          <div v-for="(value, index) in $tm('home.about.values')" :key="index" class="text-center p-8 rounded-2xl bg-gray-50 hover:bg-primary/5 transition-colors duration-300">
            <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <svg v-if="index === 0" class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <svg v-else-if="index === 1" class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <svg v-else class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-primary mb-2">{{ value.title }}</h3>
            <p class="text-gray-600 text-sm">{{ value.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter -->
    <section class="py-16 lg:py-20 bg-gradient-to-r from-primary to-secondary-dark">
      <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">{{ $t('home.newsletter.title') }}</h2>
        <p class="text-white/80 mb-8">{{ $t('home.newsletter.subtitle') }}</p>
        <form @submit.prevent="handleSubscribe" class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            v-model="email"
            type="email"
            :placeholder="$t('home.newsletter.placeholder')"
            class="flex-1 px-5 py-3.5 rounded-xl border-0 focus:ring-2 focus:ring-secondary-amber text-gray-900"
            required
          />
          <button type="submit" class="bg-secondary-amber hover:bg-secondary-amber/90 text-white px-8 py-3.5 rounded-xl font-semibold transition-all duration-200 whitespace-nowrap">
            {{ $t('home.newsletter.button') }}
          </button>
        </form>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import ProductCard from '@/components/ProductCard.vue'
import { useProducts } from '@/composables/useProducts'

const { t } = useI18n()

const { featuredProducts, backendAvailable } = useProducts()

const email = ref('')

// SEO meta tags
useHead({
  title: 'Rosella Emulsy - Natural Skincare',
  meta: [
    { name: 'description', content: 'Handcrafted natural skincare products made with love from nature\'s finest ingredients.' },
    { name: 'keywords', content: 'natural skincare, organic, handmade, Rosella Emulsy, jordan skincare' },
    { property: 'og:title', content: 'Rosella Emulsy - Natural Skincare' },
    { property: 'og:description', content: 'Discover our handcrafted natural skincare products.' },
    { property: 'og:type', content: 'website' },
  ],
})

function handleSubscribe() {
  // TODO: Implement newsletter subscription
  alert('Newsletter subscription - coming soon!')
  email.value = ''
}
</script>