import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || '')

  const isLoggedIn = computed(() => !!token.value)
  const username = computed(() => user.value?.username || '')

  // 模拟用户数据
  const mockUsers = [
    { id: 1, username: 'admin', password: '123456', role: 'user', avatar: '', nickname: '草莓爱好者' },
    { id: 2, username: 'user', password: '123456', role: 'user', avatar: '', nickname: '普通用户' }
  ]

  function login(username, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const foundUser = mockUsers.find(
          u => u.username === username && u.password === password
        )
        if (foundUser) {
          const { password: _, ...userData } = foundUser
          user.value = userData
          token.value = `mock_token_${Date.now()}`
          localStorage.setItem('token', token.value)
          localStorage.setItem('user', JSON.stringify(userData))
          resolve(userData)
        } else {
          reject(new Error('用户名或密码错误'))
        }
      }, 500)
    })
  }

  function logout() {
    user.value = null
    token.value = ''
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  function initUser() {
    const savedUser = localStorage.getItem('user')
    if (savedUser && token.value) {
      user.value = JSON.parse(savedUser)
    }
  }

  // 初始化
  initUser()

  return {
    user,
    token,
    isLoggedIn,
    username,
    login,
    logout
  }
})
