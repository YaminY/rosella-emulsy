<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Banner -->
    <section class="relative bg-gradient-to-br from-primary/5 via-white to-primary-light/5 overflow-hidden py-16 lg:py-24">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6">
          {{ $t('home.about.title') }}
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          {{ $t('home.about.story.0') }}
        </p>
      </div>
      <div class="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-primary-light/5 rounded-full blur-3xl"></div>
    </section>

    <!-- Story -->
    <section class="py-16 lg:py-20">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="space-y-8">
          <p
            v-for="(paragraph, index) in storyParagraphs"
            :key="index"
            class="text-lg text-gray-700 leading-relaxed"
            :class="{ 'text-xl font-medium text-primary': paragraph.highlight }"
          >
            {{ paragraph.text }}
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'

const { t, tm } = useI18n()

const story = tm('home.about.story')

// Highlight the 4th paragraph (index 3) as a key moment - "Rosella Cream was born"
const storyParagraphs = story.map((text, index) => ({
  text,
  highlight: index === 3,
}))

useHead({
  title: () => `${t('nav.about')} - Rosella Emulsy`,
  meta: [
    { name: 'description', content: story[0] },
  ],
})
</script>