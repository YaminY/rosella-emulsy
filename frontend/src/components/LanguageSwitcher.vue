<template>
  <div class="relative" ref="dropdownRef">
    <button
      @click="open = !open"
      class="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors rounded-lg hover:bg-gray-100"
    >
      <span class="text-base leading-none">{{ currentFlag }}</span>
      <span>{{ currentLabel }}</span>
      <svg class="w-3 h-3 transition-transform" :class="{ 'rotate-180': open }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      leave-active-class="transition-all duration-150 ease-in"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="open" class="absolute right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 py-1 min-w-[160px] z-50">
        <button
          v-for="lang in languages"
          :key="lang.code"
          @click="switchLanguage(lang.code)"
          class="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
          :class="{ 'bg-gray-50 text-primary font-semibold': locale === lang.code }"
        >
          <span class="text-base">{{ lang.flag }}</span>
          <span>{{ lang.label }}</span>
          <span v-if="locale === lang.code" class="ml-auto">
            <svg class="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale, t } = useI18n()
const open = ref(false)
const dropdownRef = ref(null)

const languages = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
]

const currentLang = computed(() => languages.find(l => l.code === locale.value) || languages[0])
const currentLabel = computed(() => currentLang.value.label)
const currentFlag = computed(() => currentLang.value.flag)

function switchLanguage(code) {
  locale.value = code
  localStorage.setItem('locale', code)
  document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr'
  document.documentElement.lang = code
  open.value = false
}

function handleClickOutside(e) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    open.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  const saved = localStorage.getItem('locale')
  if (saved) {
    document.documentElement.dir = saved === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = saved
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>