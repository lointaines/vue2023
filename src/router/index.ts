import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/Main',
    name: 'Main',
   // redirect:'/Home',
    component:  () =>import("@/components/Main.vue"),
    meta: {
      title: "西藏文化"
    },
    children: [
      {
        path: '/Home',
        name: 'Home',
        component: () => import('@/components/Home.vue'),
      },
    ]
  },
  {
    path: '/',
    redirect: '/Main',
  },
  // {
  //   path: '/:catchAll(.*)',
  //   name: '404',
  //   component: () => import('@/components/404.vue')
  // }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
