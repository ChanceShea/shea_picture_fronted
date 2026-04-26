<template>
  <a-modal
    class="image-cropper"
    v-model:open="visible"
    title="编辑图片"
    :footer="false"
    @cancel="closeModal"
  >
    <vue-cropper
      ref="cropperRef"
      :img="imageUrl"
      output-type="png"
      :info="true"
      :can-move="false"
      :can-move-box="true"
      :fixed-box="false"
      :auto-crop="true"
      :center-box="true"
    />
    <div style="margin-bottom: 16px" />
    <!--图片操作-->
    <div class="image-cropper-action">
      <a-space>
        <a-button @click="changeScale(1)">放大</a-button>
        <a-button @click="changeScale(-1)">缩小</a-button>
        <a-button @click="rotateLeft">向左旋转</a-button>
        <a-button @click="rotateRight">向右旋转</a-button>
        <a-button type="primary" :loading="loading" @click="handleConfirm">确认</a-button>
      </a-space>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { uploadPictureUsingPost } from '@/service/api/pictureController.ts'
import { message } from 'ant-design-vue'

interface Props {
  imageUrl?: string
  picture?: API.PictureVO
  onSuccess?: (newPicture: API.PictureVO) => void
  spaceId?: number
}
const props = defineProps<Props>()

const cropperRef = ref()

const changeScale = (num) => {
  num = num || 1
  cropperRef.value?.changeScale(num)
}
const rotateLeft = () => {
  cropperRef.value?.rotateLeft()
}
const rotateRight = () => {
  cropperRef.value?.rotateRight()
}

const handleConfirm = () => {
  cropperRef.value.getCropBlob((blob: Blob) => {
    const fileName = (props.picture?.name || 'cropped-image') + '.png'
    const file = new File([blob], fileName, { type: blob.type })
    handleUpload(file)
  })
}

const loading = ref(false)

const handleUpload = async (file: any) => {
  loading.value = true
  try {
    const params: API.PictureUploadDTO = props.picture ? { id: props.picture.id } : {}
    params.spaceId = props.spaceId
    console.log('params:', params)
    console.log('file:', file)
    const res = await uploadPictureUsingPost(params, {}, file)
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
    loading.value = false
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
.image-cropper {
  text-align: center;
}
.image-cropper .vue-cropper {
  height: 400px !important;
}
</style>
