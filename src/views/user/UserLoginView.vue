<template>
  <div id="userRegisterView">
    <h2 class="title">智能云图库 - 用户登录</h2>
    <div class="desc">企业级智能协同云图库</div>
    <a-form :model="formState" autocomplete="off" @finish="handleSubmit">
      <a-form-item name="userAccount" :rules="[{ required: true, message: '请输入账号' }]">
        <a-input v-model:value="formState.userAccount" placeholder="请输入账号" />
      </a-form-item>
      <a-form-item
        name="userPassword"
        :rules="[
          { required: true, message: '请输入密码' },
          { min: 8, message: '密码长度不能小于8位' },
        ]"
      >
        <a-input-password v-model:value="formState.userPassword" placeholder="请输入密码" />
      </a-form-item>
      <div class="tips">
        没有账号？
        <RouterLink to="/user/register">去注册</RouterLink>
      </div>
      <a-form-item style="width: 100%">
        <a-button type="primary" html-type="submit">登录</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { userLoginUsingPost } from '@/service/api/userController.ts'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { message } from 'ant-design-vue'
import router from '@/router'

const formState = ref<API.UserLoginDTO>({
  userAccount: '',
  userPassword: '',
})

const loginUserStore = useLoginUserStore()

const handleSubmit = async (values: API.UserLoginDTO) => {
  try {
    const res = await userLoginUsingPost(values)
    if (res.data.code === 200 && res.data.data) {
      await loginUserStore.fetchLoginUser()
      message.success('登录成功')
      router.push({
        path: '/',
        replace: true,
      })
    } else {
      message.error('登录失败,' + res.data.message)
    }
  } catch (e: any) {
    message.error('登录失败,' + e.message)
  }
}
</script>

<style scoped>
#userRegisterView {
  max-width: 360px;
  margin: 0 auto;
}
.title {
  text-align: center;
  margin-bottom: 16px;
}
.desc {
  color: #bbb;
  text-align: center;
  margin-bottom: 16px;
}
.tips {
  color: #bbb;
  text-align: right;
  font-size: 13px;
}
</style>
