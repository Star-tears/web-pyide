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
      component: () => import('@/views/VmIde.vue'),
      meta: { title: 'Vm Web IDE' }
    },
    {
      path: '/components-test',
      component: () => import('@/views/ComponentsTest.vue')
    }
  ]
});

export default router;
