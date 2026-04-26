<template>
  <div class="space-user-analyze">
    <a-card title="空间图片用户行为分析">
      <v-chart :option="options" style="height: 320px; width: 100%" :loading="loading" />
      <template #extra>
        <a-segmented v-model:value="timeDimension" :options="timeDimensionOptions" />
        <a-input-search @search="doSearch" placeholder="请输入Id" enter-button="搜索用户" />
      </template>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import VChart from 'vue-echarts'
import 'echarts'
import { computed, ref, watchEffect } from 'vue'
import { getSpaceUserAnalyzeUsingPost } from '@/service/api/spaceAnalyzeController.ts'

interface Props {
  queryAll?: boolean
  queryPublic?: boolean
  spaceId?: number
}

const props = withDefaults(defineProps<Props>(), {
  queryAll: false,
  queryPublic: false,
})

const timeDimension = ref<'day' | 'week' | 'month'>('day')
const timeDimensionOptions = [
  {
    label: '日',
    value: 'day',
  },
  {
    label: '周',
    value: 'week',
  },
  {
    label: '月',
    value: 'month',
  },
]

const loading = ref(false)
const dataList = ref<API.SpaceCategoryAnalyzeVO[]>([])

const fetchData = async () => {
  loading.value = true
  const res = await getSpaceUserAnalyzeUsingPost({
    queryAll: props?.queryAll,
    queryPublic: props?.queryPublic,
    spaceId: props.spaceId,
    timeDimension: timeDimension.value,
    userId: userId.value,
  })
  if (res.data.code === 200 && res.data.data) {
    dataList.value = res.data.data ?? []
  } else {
    console.error('获取数据失败:', res.data.message)
  }
  loading.value = false
}

const options = computed(() => {
  const periods = dataList.value.map((item) => item.period) // 时间区间
  const counts = dataList.value.map((item) => item.count) // 上传数量

  return {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: periods, name: '时间区间' },
    yAxis: { type: 'value', name: '上传数量' },
    series: [
      {
        name: '上传数量',
        type: 'line',
        data: counts,
        smooth: true, // 平滑折线
        emphasis: {
          focus: 'series',
        },
      },
    ],
  }
})

const userId = ref<string>()

const doSearch = async (value: string) => {
  userId.value = value
}

watchEffect(() => {
  fetchData()
})
</script>

<style scoped></style>
