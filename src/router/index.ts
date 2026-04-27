import { createRouter, createWebHistory } from 'vue-router'

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
      path: '/picture/add_picture',
      name: '添加图片',
      component: () => import('@/views/picture/AddPictureView.vue'),
    },
    {
      path: '/add_picture/batch',
      name: '批量添加图片',
      component: () => import('@/views/picture/BatchAddPictureView.vue'),
    },
    {
      path: '/admin/pictureManage',
      name: '图片管理',
      component: () => import('@/views/admin/PictureManageView.vue'),
    },
    {
      path: '/picture/:id',
      name: '图片详情',
      component: () => import('@/views/picture/PictureDetailView.vue'),
      props: true,
    },
    {
      path: '/admin/spaceManage',
      name: '空间管理',
      component: () => import('@/views/admin/SpaceManageView.vue'),
    },
    {
      path: '/space/add_space',
      name: '添加空间',
      component: () => import('@/views/space/AddSpaceView.vue'),
    },
    {
      path: '/my_space',
      name: '我的空间',
      component: () => import('@/views/space/MySpaceView.vue'),
    },
    {
      path: '/space/:id',
      name: '空间详情',
      component: () => import('@/views/space/SpaceDetailView.vue'),
      props: true,
    },
    {
      path: '/search_picture',
      name: '搜索图片',
      component: () => import('@/views/picture/SearchPictureView.vue'),
    },
    {
      path: '/space_analyze',
      name: '空间分析',
      component: () => import('@/views/space/SpaceAnalyzeView.vue'),
    },
    {
      path: '/spaceUserManage/:id',
      name: '空间用户管理',
      component: () => import('@/views/admin/SpaceUserManageView.vue'),
      props: true,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
    },
  ],
})

export default router
