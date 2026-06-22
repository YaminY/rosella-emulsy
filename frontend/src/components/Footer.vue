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
              <router-link to="/about" class="text-gray-300 hover:text-white transition-colors text-sm">{{ $t('nav.about') }}</router-link>
            </li>
            <li>
              <router-link to="/admin" class="text-gray-300 hover:text-white transition-colors text-sm">{{ $t('nav.admin') }}</router-link>
            </li>
          </ul>
        </div>

        <!-- Contact & Social -->
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
            <li>
              <a href="https://www.instagram.com/rosellaemulsy" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 text-gray-300 hover:text-pink-400 transition-colors text-sm">
                <svg class="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
                Instagram
              </a>
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