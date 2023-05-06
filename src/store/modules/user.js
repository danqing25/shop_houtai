import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter, asyncRoutes, constantRoutes, anyRoutes } from '@/router'
import router from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    routes: [],
    roles: [],
    buttons: [],
    resAsyncRoutes: [],
    resAllRoutes: []
  }
}

// 筛选需展示的异步路由
const filterRoutes = (asyncRoutes, routes) => {
  return asyncRoutes.filter(element => {
    if (routes.indexOf(element.name) != -1) {
      // 递归筛选子路由
      if (element.children && element.children.length) {
        element.children = filterRoutes(element.children, routes)
      }

      return true
    }
  })
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },

  // 存储用户信息
  SET_USERINFO: (state, userInfo) => {
    state.name = userInfo.name
    // 头像
    state.avatar = userInfo.avatar
    // 菜单权限标记
    state.routes = userInfo.routes
    // 角色
    state.roles = userInfo.roles
    // 按钮权限
    state.buttons = userInfo.buttons    
  },
  // 存储带展示的路由
  SET_RESASYNCROUTES(state, routes) {
    // 异步路由
    state.resAsyncRoutes = routes
    // 存储所有需展示路由
    state.resAllRoutes = constantRoutes.concat(state.resAsyncRoutes, anyRoutes)
    // resetRouter()  // 清空原有路由
    // 给router添加新的routes
    router.addRoutes(state.resAllRoutes)
  }
}

const actions = {
  // user login
  async login({ commit }, userInfo) {
    const { username, password } = userInfo
    const result = await login({ username: username.trim(), password: password })
    if (result.code === 20000) {
      commit('SET_TOKEN', result.data.token)
      setToken(result.data.token)
      return 'ok'
    } else {
      return Promise.reject(new Error('failed'))
    }
  },

  // get user info
  async getInfo({ commit, state }) {
    const result = await getInfo(state.token)
    if (result.code === 20000) {
      if (!result.data) {
        return Promise.reject('Verification failed, please Login again.')
      }

      // result.data除了用户名、头像，还包含 routes--用户菜单权限；roles--用户角色；buttons--按钮权限标记
      commit('SET_USERINFO', result.data)
      // 存储需要展示的异步路由
      commit('SET_RESASYNCROUTES', filterRoutes(asyncRoutes, result.data.routes))
      return 'ok'
    } else {
      return Promise.reject(new Error('failed'))
    }
  },

  // user logout
  async logout({ commit, state }) {
    const result = await logout(state.token)
    if (result.code === 20000) {
      removeToken() // must remove  token  first
      resetRouter()
      commit('RESET_STATE')
      return 'ok'
    } else {
      return Promise.reject(new Error('failed'))
    }
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

