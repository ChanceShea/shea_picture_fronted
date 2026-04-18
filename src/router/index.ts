import { createRouter, createWebHistory } from 'vue-router'

// @ts-ignore
// @ts-ignore
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/user/login',
      name: '用户登录',
      component: () => import('@/views/user/UserLoginView.vue'),
    },
    {
      path: '/user/register',
      name: '用户注册',
      component: () => import('@/views/user/UserRegisterView.vue'),
    },
    {
      path: '/admin/userManage',
      name: '用户管理',
      component: () => import('@/views/admin/UserManageView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
    },
  ],
})

export default router
