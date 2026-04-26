<template>
  <div id="picture-search-form">
    <div style="margin-bottom: 16px" />
    <!--搜索表单-->
    <a-form layout="inline" :model="searchParams" @finish="doSearch">
      <a-form-item label="关键词">
        <a-input
          v-model:value="searchParams.searchText"
          placeholder="从名称和简介搜索"
          allow-clear
        />
      </a-form-item>
      <a-form-item name="category" label="分类">
        <a-auto-complete
          v-model:value="searchParams.category"
          style="min-width: 180px"
          placeholder="请输入分类"
          :options="categoryOptions"
          auto-clear
        />
      </a-form-item>
      <a-form-item name="tags" label="标签">
        <a-select
          v-model:value="searchParams.tags"
          mode="tags"
          style="min-width: 180px"
          placeholder="请输入标签"
          :options="tagOptions"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="日期" name="dateRange">
        <a-range-picker
          style="width: 400px"
          show-time
          v-model:value="dateRange"
          :placeholder="['开始编辑时间', '结束编辑时间']"
          format="YYYY/MM/DD HH:mm:ss"
          :presets="rangePresets"
          @change="onRangeChange"
        />
      </a-form-item>
      <a-form-item name="name" label="名称">
        <a-input v-model:value="searchParams.name" placeholder="请输入名称" allow-clear />
      </a-form-item>
      <a-form-item name="introduction" label="简介">
        <a-input v-model:value="searchParams.introduction" placeholder="请输入简介" allow-clear />
      </a-form-item>
      <a-form-item name="picWidth" label="图片宽度">
        <a-input-number v-model:value="searchParams.picWidth" :min="0" />
      </a-form-item>
      <a-form-item name="picHeight" label="图片高度">
        <a-input-number v-model:value="searchParams.picHeight" :min="0" />
      </a-form-item>
      <a-form-item name="picFormat" label="格式">
        <a-input v-model:value="searchParams.picFormat" placeholder="请输入图片格式" allow-clear />
      </a-form-item>
      <a-form-item>
        <a-space>
          <a-button style="width: 96px" type="primary" html-type="submit">查询</a-button>
          <a-button type="primary" html-type="reset" @click="doClear">重置</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import dayjs from 'dayjs'
import { listPictureTagCategoryUsingGet } from '@/service/api/pictureController.ts'
import { message } from 'ant-design-vue'

interface Props {
  onSearch?: (searchParams: API.PictureQueryDTO) => void
}

const props = defineProps<Props>()

const searchParams = reactive<API.PictureQueryDTO>({})
const doSearch = () => {
  props.onSearch?.(searchParams)
}

const doClear = () => {
  Object.keys(searchParams).forEach((key) => {
    searchParams[key] = undefined
  })
  dateRange.value = []
  props.onSearch?.(searchParams)
}

const dateRange = ref<[]>([])

const onRangeChange = (dates: any[], dateStrings: string[]) => {
  if (dates?.length >= 2) {
    searchParams.startEditTime = dates[0].toDate()
    searchParams.endEditTime = dates[1].toDate()
  } else {
    searchParams.startEditTime = undefined
    searchParams.endEditTime = undefined
  }
}

const rangePresets = ref([
  { label: '最近7天', value: [dayjs().add(-7, 'd'), dayjs()] },
  { label: '最近14天', value: [dayjs().add(-14, 'd'), dayjs()] },
  { label: '最近30天', value: [dayjs().add(-30, 'd'), dayjs()] },
  { label: '最近90天', value: [dayjs().add(-90, 'd'), dayjs()] },
])

const categoryOptions = ref<
  {
    value: string
    label: string
  }[]
>([])
const tagOptions = ref<
  {
    value: string
    label: string
  }[]
>([])

const getTagCategoryOptions = async () => {
  const res = await listPictureTagCategoryUsingGet()
  if (res.data.code === 200 && res.data.data) {
    categoryOptions.value = (res.data.data.categoryList || []).map((data: string) => {
      return {
        value: data,
        label: data,
      }
    })
    tagOptions.value = (res.data.data.tagList || []).map((data: string) => {
      return {
        value: data,
        label: data,
      }
    })
  } else {
    message.error('获取分类和标签失败,' + res.data.message)
  }
}

onMounted(() => {
  getTagCategoryOptions()
})
</script>

<style scoped>
#picture-search-form .ant-form-item {
  margin-top: 16px;
}
</style>
