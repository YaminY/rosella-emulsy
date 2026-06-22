import { createRouter, createWebHistory } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { watch } from 'vue'

import HomePage from '@/views/HomePage.vue'
import AboutPage from '@/views/AboutPage.vue'
import ProductsPage from '@/views/ProductsPage.vue'
import ProductDetail from '@/views/ProductDetail.vue'
import CheckoutPage from '@/views/CheckoutPage.vue'
import AdminDashboard from '@/views/AdminDashboard.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
  {
    path: '/about',
    name: 'about',
    component: AboutPage,
  },
  {
    path: '/products',
    name: 'products',
    component: ProductsPage,
  },
  {
    path: '/products/:slug',
    name: 'product-detail',
    component: ProductDetail,
    props: true,
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: CheckoutPage,
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminDashboard,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router