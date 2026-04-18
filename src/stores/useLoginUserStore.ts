import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getLoginUserUsingGet } from '@/service/api/userController.ts'

export const useLoginUserStore = defineStore('loginUser', () => {
  const loginUser = ref<API.LoginUserVO>({
    userName: '未登录',
  })
  async function fetchLoginUser() {
    const res = await getLoginUserUsingGet()
    if (res.data.code === 200 && res.data.data) {
      loginUser.value = res.data.data
    }
    // setTimeout(() => {
    //   loginUser.value = { userName: '张三', id: '1' }
    // }, 3000)
  }

  function setLoginUser(newLoginUser: any) {
    loginUser.value = newLoginUser
  }

  return { loginUser, fetchLoginUser, setLoginUser }
})
