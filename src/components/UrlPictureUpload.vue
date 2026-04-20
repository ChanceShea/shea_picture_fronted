<template>
  <div class="url-picture-upload">
    <a-input-group compact>
      <a-input v-model:value="fileUrl" style="width: calc(100% - 120px)" />
      <a-button type="primary" :loading="loading" style="width: 120px" @click="handleUpload"
        >上传</a-button
      >
    </a-input-group>
    <div class="image-wrapper">
      <img v-if="picture?.url" :src="picture?.url" alt="avatar" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { message, type UploadProps } from 'ant-design-vue'
import { ref } from 'vue'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons-vue'
import {
  uploadPictureByUrlUsingPost,
  uploadPictureUsingPost,
} from '@/service/api/pictureController.ts'

interface Props {
  picture?: API.PictureVO
  onSuccess?: (newPicture: API.PictureVO) => void
}

const props = defineProps<Props>()
const loading = ref(false)
const fileUrl = ref<string>()

const handleUpload = async () => {
  loading.value = true
  try {
    const params: API.PictureUploadDTO = { url: fileUrl.value }
    if (props.picture) {
      params.id = props.picture.id
    }
    const res = await uploadPictureByUrlUsingPost(params)
    if (res.data.code === 200 && res.data.data) {
      message.success('上传成功')
      props.onSuccess?.(res.data.data)
    } else {
      message.error('图片上传失败,' + res.data.message)
    }
  } catch (err: any) {
    message.error('图片上传失败,' + err.message)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.url-picture-upload {
  margin-bottom: 16px;
}

.url-picture-upload img {
  max-width: 100%;
  max-height: 480px;
}
.url-picture-upload .image-wrapper {
  text-align: center;
  margin-top: 16px;
}
</style>
