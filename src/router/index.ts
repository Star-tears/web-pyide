import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'VmIndex',
      redirect: '/editor'
    },
    {
      path: '/editor',
      component: () => import('@/components/element/VmIde.vue'),
      meta: { title: 'Vm Web IDE' }
    }
  ]
});

export default router;
