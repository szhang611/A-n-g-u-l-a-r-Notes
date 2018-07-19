import axios from 'axios'
import store from '../store/store'
import * as types from '../store/types'
import router from '../router/index'

// axios 配置
axios.defaults.timeout = 5000
axios.defaults.baseURL = 'http://localhost:8808/api'

// http request 拦截器
axios.interceptors.request.use(
  config => {
    if (store.state.token) {
      config.headers = {
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${store.state.token}`
      }
    }
    return config
  },
  err => {
    return Promise.reject(err)
  },
)

// http response 拦截器
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 401 清除token信息并跳转到登录页面
          store.commit(types.LOGOUT)

          if (router.currentRoute.path !== 'login') {
            router.replace({
              path: 'login',
              query: { redirect: router.currentRoute.path },
            })
          }

      }
    }
    return Promise.reject(error.response.data.msg)
  },
)

export default axios
