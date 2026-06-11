<template>
  <footer class="bg-secondary-dark text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
        <!-- Brand -->
        <div>
          <div class="flex items-center gap-3 mb-4">
            <img src="/logo-icon.png" alt="Rosella Emulsy" class="h-12 w-12 rounded-full" />
            <span class="text-2xl font-bold text-secondary-gold">Rosella Emulsy</span>
          </div>
          <p class="text-gray-300 text-sm leading-relaxed">{{ $t('footer.description') }}</p>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-lg font-semibold text-secondary-gold mb-4">{{ $t('footer.quickLinks') }}</h3>
          <ul class="space-y-2">
            <li>
              <router-link to="/" class="text-gray-300 hover:text-white transition-colors text-sm">{{ $t('nav.home') }}</router-link>
            </li>
            <li>
              <router-link to="/products" class="text-gray-300 hover:text-white transition-colors text-sm">{{ $t('nav.products') }}</router-link>
            </li>
            <li>
              <router-link to="/admin" class="text-gray-300 hover:text-white transition-colors text-sm">{{ $t('nav.admin') }}</router-link>
            </li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h3 class="text-lg font-semibold text-secondary-gold mb-4">{{ $t('footer.contact') }}</h3>
          <ul class="space-y-3">
            <li class="flex items-center gap-2 text-gray-300 text-sm">
              <svg class="w-5 h-5 text-secondary-gold shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {{ $t('footer.email') }}
            </li>
            <li class="flex items-center gap-2 text-gray-300 text-sm">
              <svg class="w-5 h-5 text-secondary-gold shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {{ $t('footer.phone') }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Divider -->
      <div class="border-t border-white/10 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-gray-400 text-sm">{{ $t('footer.rights', { year: new Date().getFullYear() }) }}</p>
        <p class="text-gray-400 text-sm">{{ $t('footer.madeWith') }}</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>