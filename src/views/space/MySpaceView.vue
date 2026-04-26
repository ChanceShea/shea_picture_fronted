<template>
  <div class="mySpaceView">
    <p>正在跳转中...请稍候...</p>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { listSpaceVoByPageUsingPost } from '@/service/api/spaceController.ts'
import { message } from 'ant-design-vue'
import { onMounted } from 'vue'

const router = useRouter()

const loginUserStore = useLoginUserStore()

const checkUserSpace = async () => {
  const loginUser = loginUserStore.loginUser
  if (!loginUser) {
    router.replace('/user/login')
    return
  }
  const res = await listSpaceVoByPageUsingPost({
    userId: loginUser.id,
    current: 1,
    pageSize: 1,
  })
  console.log(res)
  if (res.data.code === 200 && res.data.data) {
    if (res.data.data?.records?.length > 0) {
      const space = res.data.data.records[0]
      router.replace(`/space/${space.id}`)
    } else {
      router.replace('/space/add_space')
      message.warn('您还没有创建空间，请先创建空间')
    }
  } else {
    message.error('加载我的空间失败 ' + res.data.message)
  }
}

onMounted(() => {
  checkUserSpace()
})
</script>

<style scoped></style>
