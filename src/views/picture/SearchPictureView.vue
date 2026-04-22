<template>
  <div id="searchPictureView">
    <h2 style="margin-bottom: 16px">以图搜图</h2>
    <h3 style="margin-bottom: 16px">原图</h3>
    <a-card hoverable style="width: 240px">
      <template #cover>
        <img
          :src="picture.thumbnailUrl ?? picture.url"
          :alt="picture.name"
          style="height: 180px; object-fit: cover"
        />
      </template>
    </a-card>
    <h3 style="margin: 16px 0">识图结果</h3>
    <a-list
      :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }"
      :data-source="dataList"
      :loading="loading"
    >
      <template #renderItem="{ item: picture }">
        <a-list-item style="padding: 0">
          <a :href="picture.fromUrl" target="_blank">
            <a-card hoverable>
              <template #cover>
                <img
                  :src="picture.thumbUrl"
                  :alt="picture.name"
                  style="height: 180px; object-fit: cover"
                />
              </template>
            </a-card>
          </a>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script setup lang="ts">
import { computed, h, onMounted, ref } from 'vue'
import {
  getPictureVoByIdUsingGet,
  removePictureByIdUsingDelete,
  searchPictureByPictureUsingPost,
} from '@/service/api/pictureController.ts'
import { message } from 'ant-design-vue'
import {
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  SearchOutlined,
} from '@ant-design/icons-vue'
import { downloadImage, formatSize } from '@/utils'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()

const picture = ref<API.PictureVO>({})
const pictureId = computed(() => {
  return route.query?.pictureId
})

const loading = ref(false)

const fetchResultData = async () => {
  try {
    loading.value = true
    const res = await searchPictureByPictureUsingPost({
      pictureId: pictureId.value,
    })
    if (res.data.code === 200 && res.data.data) {
      dataList.value = res.data.data ?? []
    } else {
      message.error('获取数据失败 ' + res.data.message)
    }
  } catch (error: any) {
    message.error('获取数据失败,' + error.message)
  } finally {
    loading.value = false
  }
}

const fetchPictureDetail = async () => {
  try {
    const res = await getPictureVoByIdUsingGet({
      id: pictureId.value,
    })
    if (res.data.code === 200 && res.data.data) {
      picture.value = res.data.data
    } else {
      message.error('获取图片详情失败，' + res.data.message)
    }
  } catch (e: any) {
    message.error('获取图片详情失败：' + e.message)
  }
}

const dataList = ref<API.ImageSearchResult[]>([])

onMounted(() => {
  fetchResultData()
  fetchPictureDetail()
})
</script>

<style scoped></style>
