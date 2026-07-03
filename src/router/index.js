import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import History from '../pages/History.vue'
import Profile from '../pages/Profile.vue'
import Company from '../pages/Company.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/history', component: History },
  { path: '/profile', component: Profile },
  { path: '/company', component: Company }
]

export default createRouter({
  history: createWebHistory(),
  routes
})