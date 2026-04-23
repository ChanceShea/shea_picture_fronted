<template>
  <div class="picture-list">
    <a-list
      :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }"
      :data-source="dataList"
    >
      <template #renderItem="{ item: picture }">
        <a-list-item style="padding: 0">
          <a-card hoverable @click="doClickPicture(picture)">
            <template #cover>
              <img
                :src="picture.thumbnailUrl ?? picture.url"
                :alt="picture.name"
                style="height: 180px; object-fit: cover"
              />
            </template>
            <a-card-meta :title="picture.name">
              <template #description>
                <a-flex>
                  <a-tag color="green">{{ picture.category || '默认' }}</a-tag>
                  <a-tag v-for="tag in picture.tags" :key="tag">
                    {{ tag }}
                  </a-tag>
                </a-flex>
              </template>
            </a-card-meta>
            <template v-if="showOp" #actions>
              <ShareAltOutlined @click="(e) => doShare(e, picture)" />
              <SearchOutlined @click="(e) => doSearch(e, picture)" />
              <EditOutlined @click="(e) => doEdit(e, picture)" />
              <DeleteOutlined @click="(e) => doDelete(e, picture)" />
            </template>
          </a-card>
        </a-list-item>
      </template>
    </a-list>
    <ShareModal ref="shareModalRef" :link="shareLink" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  ShareAltOutlined,
} from '@ant-design/icons-vue'
import { removePictureByIdUsingDelete } from '@/service/api/pictureController.ts'
import { message } from 'ant-design-vue'
import ShareModal from '@/components/ShareModal.vue'
import { ref } from 'vue'

interface Props {
  dataList?: API.PictureVO[]
  loading?: boolean
  showOp?: boolean
  onReload?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  dataList: () => [],
  loading: false,
  showOp: false,
})

const router = useRouter()

const doClickPicture = (picture: API.PictureVO) => {
  router.push(`/picture/${picture.id}`)
}

const doEdit = (e: MouseEvent, picture: API.PictureVO) => {
  // 阻止事件冒泡
  e.stopPropagation()
  router.push({
    path: '/picture/add_picture',
    query: {
      id: picture.id,
      spaceId: picture.spaceId,
    },
  })
}

const doDelete = async (e: MouseEvent, picture: API.PictureVO) => {
  // 阻止事件冒泡
  e.stopPropagation()
  const id = picture.id
  if (!id) {
    return
  }
  const res = await removePictureByIdUsingDelete({ id })
  if (res.data.code === 200 && res.data.data) {
    message.success('图片删除成功')
    props.onReload?.()
  } else {
    message.error('图片删除失败')
  }
}

const doSearch = (e, picture) => {
  e.stopPropagation()
  window.open(`/search_picture?pictureId=${picture.id}`)
}

const shareModalRef = ref()
const shareLink = ref()

const doShare = (e, picture) => {
  e.stopPropagation()
  shareLink.value = `${window.location.protocol}//${window.location.host}/picture/${picture.id}`
  if (shareModalRef.value) {
    shareModalRef.value.openModal()
  }
}
</script>

<style scoped></style>
