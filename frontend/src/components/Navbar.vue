<template>
  <nav class="bg-white shadow-sm sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 lg:h-20">
        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-3 shrink-0">
          <img src="/logo-icon.png" alt="Rosella Emulsy" class="h-10 w-10 rounded-full object-cover" />
          <span class="text-xl font-bold text-primary hidden sm:block">Rosella Emulsy</span>
        </router-link>

        <!-- Desktop Nav Links -->
        <div class="hidden md:flex items-center gap-8">
          <router-link to="/" class="nav-link" :class="{ 'text-primary font-semibold': $route.name === 'home' }">
            {{ $t('nav.home') }}
          </router-link>
          <router-link to="/products" class="nav-link" :class="{ 'text-primary font-semibold': $route.name === 'products' }">
            {{ $t('nav.products') }}
          </router-link>
          <a href="#about" class="nav-link">{{ $t('nav.about') }}</a>
        </div>

        <!-- Right Actions -->
        <div class="flex items-center gap-2">
          <!-- Language Switcher -->
          <LanguageSwitcher />

          <!-- Cart -->
          <router-link to="/checkout" class="relative p-2 text-gray-700 hover:text-primary transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            <span v-if="cartCount > 0" class="absolute -top-0.5 -right-0.5 bg-secondary-amber text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {{ cartCount > 99 ? '99+' : cartCount }}
            </span>
          </router-link>

          <!-- Mobile Menu Toggle -->
          <button @click="mobileOpen = !mobileOpen" class="md:hidden p-2 text-gray-700 hover:text-primary">
            <svg v-if="!mobileOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <Transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0 max-h-0"
        enter-to-class="opacity-100 max-h-96"
        leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="opacity-100 max-h-96"
        leave-to-class="opacity-0 max-h-0"
      >
        <div v-if="mobileOpen" class="md:hidden pb-4 overflow-hidden">
          <div class="flex flex-col gap-2">
            <router-link @click="mobileOpen = false" to="/" class="px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700" :class="{ 'text-primary font-semibold bg-gray-50': $route.name === 'home' }">
              {{ $t('nav.home') }}
            </router-link>
            <router-link @click="mobileOpen = false" to="/products" class="px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700" :class="{ 'text-primary font-semibold bg-gray-50': $route.name === 'products' }">
              {{ $t('nav.products') }}
            </router-link>
            <a @click="mobileOpen = false" href="#about" class="px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700">{{ $t('nav.about') }}</a>
          </div>
        </div>
      </Transition>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import LanguageSwitcher from './LanguageSwitcher.vue'
import { useCart } from '@/composables/useCart'

const { cartCount } = useCart()
const mobileOpen = ref(false)
</script>