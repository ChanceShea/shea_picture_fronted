<template>
  <div id="homePage">
    <div class="search-bar">
      <a-input-search
        v-model:value="searchParams.searchText"
        placeholder="请输入搜索内容"
        enter-button="搜索"
        size="large"
        @search="onSearch"
      />
    </div>
    <a-tabs v-model:active-key="selectedCategory" @change="onSearch">
      <a-tab-pane tab="全部" key="all" />
      <a-tab-pane v-for="category in categoryList" :tab="category" :key="category" />
    </a-tabs>
    <div class="tag-bar">
      <span style="margin-right: 8px">标签：</span>
      <a-space>
        <a-checkable-tag
          v-for="(tag, index) in tagList"
          :key="tag"
          v-model:checked="selectedTagList[index]"
          @change="onSearch"
        >
          {{ tag }}
        </a-checkable-tag>
      </a-space>
    </div>
    <a-list
      :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }"
      :data-source="dataList"
      :pagination="pagination"
    >
      <template #renderItem="{ item: picture }">
        <a-list-item style="padding: 0">
          <a-card hoverable @click="doClickPicture(picture)">
            <template #cover>
              <img
                :src="picture.url"
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
          </a-card>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import {
  listPictureVoByPageUsingPost,
  listPictureTagCategoryUsingGet,
} from '@/service/api/pictureController.ts'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'

const dataList = ref<API.PictureVO[]>([])
const total = ref(0)
const loading = ref(true)

const searchParams = reactive<API.PictureQueryDTO>({
  current: 1,
  pageSize: 12,
  sortField: 'createTime',
  sortOrder: 'descend',
})

const pagination = computed(() => {
  return {
    current: searchParams.current,
    pageSize: searchParams.pageSize,
    total: total.value,
    onChange: (page: number, pageSize: number) => {
      searchParams.current = page
      searchParams.pageSize = pageSize
      fetchData()
    },
  }
})

const fetchData = async () => {
  try {
    loading.value = true
    const params = { ...searchParams, tags: [] as string[] }
    if (selectedCategory.value !== 'all') {
      params.category = selectedCategory.value
    }
    selectedTagList.value.forEach((useTag, index) => {
      if (useTag) {
        params.tags.push(tagList.value[index])
      }
    })
    const res = await listPictureVoByPageUsingPost(params)
    if (res.data.code === 200 && res.data.data) {
      console.log(res.data.data)
      dataList.value = res.data.data.records ?? []
      total.value = res.data.data.total ?? 0
    } else {
      message.error('获取数据失败,' + res.data.message)
    }
  } finally {
    loading.value = false
  }
}

const onSearch = () => {
  searchParams.current = 1
  fetchData()
}

const categoryList = ref<string[]>([])
const selectedCategory = ref<string>('all')
const tagList = ref<string[]>([])
const selectedTagList = ref<boolean[]>([])

const getTagCategoryOptions = async () => {
  const res = await listPictureTagCategoryUsingGet()
  if (res.data.code === 200 && res.data.data) {
    categoryList.value = res.data.data.categoryList || []
    tagList.value = res.data.data.tagList || []
  } else {
    message.error('获取分类和标签失败,' + res.data.message)
  }
}

const router = useRouter()
const doClickPicture = (picture: API.PictureVO) => {
  router.push(`/picture/${picture.id}`)
}

onMounted(() => {
  fetchData()
  getTagCategoryOptions()
})
</script>

<style scoped>
#homePage {
  margin-bottom: 16px;
}
#homePage .search-bar {
  max-width: 480px;
  margin: 0 auto 16px;
}

#homePage .tag-bar {
  margin-bottom: 20px;
}
</style>
