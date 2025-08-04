import { createRouter, createWebHistory,  } from 'vue-router';

const routes: any[] = [
  {
    path: '/',
    name: 'layout',
    component: () => import('@/views/layout.vue'),
  },
  
  // 这里可以继续添加其他页面路由
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

