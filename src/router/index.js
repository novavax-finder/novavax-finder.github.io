import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/:state(\\w{2})/:city([A-Za-z\\.\\-%20]+)/:page(\\d+)?',
    name: 'search',
    component: () =>
      import(
        /* webpackChunkName: "search" */
        '../views/SearchView.vue'
      ),
  },
  {
    path: '/stats',
    name: 'stats',
    component: () =>
      import(
        /* webpackChunkName: "stats" */
        '../views/StatsView.vue'
      ),
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: HomeView,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
