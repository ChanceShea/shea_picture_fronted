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
    <!--图片协同编辑操作-->
    <div class="image-edit-action" v-if="isTeamSpace">
      <a-space>
        <a-button v-if="editingUser" disabled> {{ editingUser?.userName }} 正在编辑... </a-button>
        <a-button v-if="canEnterEdit" @click="enterEdit" ghost type="primary">进入编辑</a-button>
        <a-button v-if="canExitEdit" @click="exitEdit" danger>退出编辑</a-button>
      </a-space>
    </div>
    <div style="margin-bottom: 16px" />
    <!--图片操作-->
    <div class="image-cropper-action">
      <a-space>
        <a-button @click="changeScale(1)" :disabled="!canEdit">放大</a-button>
        <a-button @click="changeScale(-1)" :disabled="!canEdit">缩小</a-button>
        <a-button @click="rotateLeft" :disabled="!canEdit">向左旋转</a-button>
        <a-button @click="rotateRight" :disabled="!canEdit">向右旋转</a-button>
        <a-button type="primary" :loading="loading" @click="handleConfirm" :disabled="!canEdit"
          >确认</a-button
        >
      </a-space>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watchEffect } from 'vue'
import { uploadPictureUsingPost } from '@/service/api/pictureController.ts'
import { message } from 'ant-design-vue'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import PictureEditWebSocket from '@/utils/pictureEditWebSocket.ts'
import { PICTURE_EDIT_ACTION_ENUM, PICTURE_EDIT_MESSAGE_TYPE_ENUM } from '@/constants/picture.ts'
import { SPACE_TYPE_ENUM } from '@/constants/space.ts'

interface Props {
  imageUrl?: string
  picture?: API.PictureVO
  onSuccess?: (newPicture: API.PictureVO) => void
  spaceId?: number
  space?: API.SpaceVO
}
const props = defineProps<Props>()

const isTeamSpace = computed(() => {
  console.log('props.space', props.space)
  return props.space?.spaceType === SPACE_TYPE_ENUM.TEAM
})

const cropperRef = ref()

const changeScale = (num) => {
  cropperRef.value?.changeScale(num)
  if (num > 0) {
    editAction(PICTURE_EDIT_ACTION_ENUM.ZOOM_IN)
  } else {
    editAction(PICTURE_EDIT_ACTION_ENUM.ZOOM_OUT)
  }
}
const rotateLeft = () => {
  cropperRef.value?.rotateLeft()
  editAction(PICTURE_EDIT_ACTION_ENUM.ROTATE_LEFT)
}
const rotateRight = () => {
  cropperRef.value?.rotateRight()
  editAction(PICTURE_EDIT_ACTION_ENUM.ROTATE_RIGHT)
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
  websocket?.disconnect()
  editingUser.value = undefined
}

defineExpose({
  openModal,
})

const loginUserStore = useLoginUserStore()
const loginUser = loginUserStore.loginUser
const editingUser = ref<API.UserVO>()

const canEnterEdit = computed(() => {
  return !editingUser.value
})

const canExitEdit = computed(() => {
  return editingUser.value?.id === loginUser.id
})

const canEdit = computed(() => {
  if (!isTeamSpace.value) {
    return true
  }
  return editingUser.value?.id === loginUser.id
})

let websocket: PictureEditWebSocket | null

const initWebsocket = () => {
  const pictureId = props.picture?.id
  if (!pictureId || !visible.value) {
    return
  }
  // 防止之前的连接未释放
  if (websocket) {
    websocket.disconnect()
    websocket = null
  }
  websocket = new PictureEditWebSocket(pictureId)
  websocket.connect()

  websocket.on(PICTURE_EDIT_MESSAGE_TYPE_ENUM.INFO, (data) => {
    console.log('收到通知消息:', data)
    message.info(data.message)
  })

  websocket.on(PICTURE_EDIT_MESSAGE_TYPE_ENUM.ERROR, (data) => {
    console.log('收到错误通知:', data)
    message.error(data.message)
  })

  websocket.on(PICTURE_EDIT_MESSAGE_TYPE_ENUM.ENTER_EDIT, (data) => {
    console.log('收到进入编辑通知:', data)
    message.info(data.message)
    editingUser.value = data.user
  })

  websocket.on(PICTURE_EDIT_MESSAGE_TYPE_ENUM.EXIT_EDIT, (data) => {
    console.log('收到退出编辑通知:', data)
    message.info(data.message)
    editingUser.value = undefined
  })

  websocket.on(PICTURE_EDIT_MESSAGE_TYPE_ENUM.EDIT_ACTION, (data) => {
    console.log('收到编辑动作通知:', data)
    message.info(data.message)

    switch (data.editAction) {
      case PICTURE_EDIT_ACTION_ENUM.ZOOM_IN:
        changeScale(1)
        break
      case PICTURE_EDIT_ACTION_ENUM.ZOOM_OUT:
        changeScale(-1)
        break
      case PICTURE_EDIT_ACTION_ENUM.ROTATE_LEFT:
        rotateLeft()
        break
      case PICTURE_EDIT_ACTION_ENUM.ROTATE_RIGHT:
        rotateRight()
        break
    }
  })
}

const enterEdit = () => {
  if (websocket) {
    websocket.sendMessage({
      type: PICTURE_EDIT_MESSAGE_TYPE_ENUM.ENTER_EDIT,
    })
  }
}

const exitEdit = () => {
  if (websocket) {
    websocket.sendMessage({
      type: PICTURE_EDIT_MESSAGE_TYPE_ENUM.EXIT_EDIT,
    })
  }
}

const editAction = (action: string) => {
  if (websocket) {
    websocket.sendMessage({
      type: PICTURE_EDIT_MESSAGE_TYPE_ENUM.EDIT_ACTION,
      editAction: action,
    })
  }
}

watchEffect(() => {
  if (isTeamSpace.value && visible.value) {
    console.log('初始化WebSocket')
    initWebsocket()
  }
})

onUnmounted(() => {
  websocket?.disconnect()
  editingUser.value = undefined
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
