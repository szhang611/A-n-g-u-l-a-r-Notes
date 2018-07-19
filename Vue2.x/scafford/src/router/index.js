import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/pages/login/Login'
import Dashboard from '@/pages/dashboard/dashboard'
import store from '../store/store'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      meta: {
        requireAuth: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  // console.log(to);
  if (to.matched.some(r => r.meta.requireAuth)) {
    if (store.state.token) {
      next()
    } else {
      // query 可跳转至授权之前的页面
      next({
        path: '/login',
        // query: {redirect: to.fullPath}
      })
    }
  } else {
    next()
  }
})

export default router
