import { createRouter, createWebHistory } from 'vue-router';
// import home from '@/views/home.vue';
const routes = [
  {
    path: '/',
    name: 'home',
    meta: {
      requireAuth: false,
      title: 'home',
    },
    component: () => import(/* webpackChunkName: "home" */ '@/views/home.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
