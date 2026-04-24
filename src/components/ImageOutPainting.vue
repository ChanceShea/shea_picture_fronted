<template>
  <a-modal
    class="image-out-painting"
    v-model:open="visible"
    title="AI扩图"
    :footer="false"
    @cancel="closeModal"
  >
    <a-row :gutter="16">
      <a-col span="12">
        <h4>原始图片</h4>
        <img :src="picture?.url" :alt="picture?.name" style="max-width: 100%" />
      </a-col>
      <a-col span="12">
        <h4>扩图结果</h4>
        <img
          v-if="resultImageUrl"
          :src="resultImageUrl"
          :alt="picture?.name"
          style="max-width: 100%"
        />
      </a-col>
    </a-row>
    <div style="margin-bottom: 16px" />
    <a-flex justify="center" gap="16">
      <a-button type="primary" ghost @click="createTask" :loading="!!taskId">生成图片</a-button>
      <a-button type="primary" v-if="resultImageUrl" @click="handleUpload" :loading="uploadLoading"
        >应用结果</a-button
      >
    </a-flex>
  </a-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  createPictureOutPaintingTaskUsingPost,
  getPictureOutPaintingTaskUsingGet,
  uploadPictureByUrlUsingPost,
} from '@/service/api/pictureController.ts'
import { message } from 'ant-design-vue'

interface Props {
  picture?: API.PictureVO
  spaceId?: string
  onSuccess?: (newPicture: API.PictureVO) => void
}
const props = defineProps<Props>()
const taskId = ref('')
const resultImageUrl = ref<string>('')

const createTask = async () => {
  if (!props.picture?.id) {
    return
  }
  const res = await createPictureOutPaintingTaskUsingPost({
    pictureId: props.picture?.id,
    // 根据需要设置扩图参数
    parameters: {
      xScale: 2,
      yScale: 2,
    },
  })
  if (res.data.code === 200 && res.data.data) {
    message.success('创建任务成功，请耐心等待，不要退出界面')
    console.log('data:' + JSON.stringify(res.data.data))
    console.log(res.data.data.output.taskId)
    taskId.value = res.data.data.output.taskId
    // 开启轮询
    startPolling()
  } else {
    message.error('图片任务创建失败,' + res.data.message)
  }
}

let pollingTimer: NodeJS.Timeout = null

const startPolling = () => {
  if (!taskId.value) {
    return
  }
  pollingTimer = setInterval(async () => {
    try {
      const res = await getPictureOutPaintingTaskUsingGet({
        taskId: taskId.value,
      })
      if (res.data.code === 200 && res.data.data) {
        const taskResult = res.data.data.output
        if (taskResult.task_status === 'SUCCEEDED') {
          message.success('扩图任务执行成功')
          clearPolling()
          resultImageUrl.value = taskResult.output_image_url
        } else if (taskResult.task_status === 'FAILED') {
          message.error('扩图任务执行失败')
          clearPolling()
        }
      }
    } catch (err) {
      console.error('扩图任务轮询失败', err)
      message.error('扩图任务轮训失败, ' + err.message)
      clearPolling()
    }
  }, 3000)
}

const clearPolling = () => {
  if (pollingTimer) {
    clearInterval(pollingTimer)
    pollingTimer = null
    taskId.value = ''
  }
}

const loading = ref(false)

const uploadLoading = ref(false)

const handleUpload = async () => {
  try {
    uploadLoading.value = true
    const params: API.PictureUploadDTO = { url: resultImageUrl.value, spaceId: props.spaceId }
    if (props.picture) {
      params.id = props.picture.id
    }
    const res = await uploadPictureByUrlUsingPost(params)
    if (res.data.code === 200 && res.data.data) {
      message.success('上传成功')
      props.onSuccess?.(res.data.data)
      closeModal()
    } else {
      message.error('图片上传失败,' + res.data.message)
    }
  } catch (err: any) {
    message.error('图片上传失败,' + err.message)
  } finally {
    uploadLoading.value = false
  }
}
const visible = ref(false)

const openModal = () => {
  visible.value = true
}

const closeModal = () => {
  visible.value = false
}

defineExpose({
  openModal,
})
</script>

<style>
.image-out-painting {
  text-align: center;
}
</style>
