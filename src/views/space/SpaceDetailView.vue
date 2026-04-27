<template>
  <div id="spaceDetailView">
    <a-flex justify="space-between">
      <h2 style="margin-top: 10px">
        {{ space.spaceName }}（{{ SPACE_TYPE_MAP[space.spaceType] }}）
      </h2>
      <a-space size="middle">
        <a-button
          v-if="canUpload"
          type="primary"
          :href="`/picture/add_picture?spaceId=${id}`"
          target="_blank"
          >创建图片</a-button
        >
        <a-button
          v-if="canManageSpaceUser"
          type="primary"
          ghost
          :icon="h(TeamOutlined)"
          :href="`/spaceUserManage/${id}`"
        >
          成员管理
        </a-button>
        <a-button
          v-if="canManageSpaceUser"
          type="primary"
          ghost
          :icon="h(BarChartOutlined)"
          :href="`/space_analyze?spaceId=${id}`"
        >
          空间分析
        </a-button>
        <a-button v-if="canEdit" :icon="h(EditOutlined)" @click="doBatchEdit"> 批量编辑 </a-button>

        <a-tooltip
          :title="`占用空间 ${formatSize(space.totalSize)} / ${formatSize(space.maxSize)}`"
        >
          <a-progress
            type="circle"
            :percent="((space.totalSize * 100) / space.maxSize).toFixed(1)"
            :size="42"
          />
        </a-tooltip>
      </a-space>
    </a-flex>
    <PictureSearchForm :onSearch="onSearch" />
    <div style="margin-top: 16px" />
    <a-form-item label="按颜色搜索">
      <color-picker format="hex" @pureColorChange="onColorChange" />
    </a-form-item>
    <div style="margin-bottom: 16px" />
    <PictureList
      :canEdit="canEdit"
      :canDelete="canDelete"
      :showOp="true"
      :dataList="dataList"
      :loading="loading"
      :onReload="fetchData"
    />
    <a-pagination
      v-model:current="searchParams.current"
      v-model:pageSize="searchParams.pageSize"
      @change="onPageChange"
      :total="total"
      style="text-align: center"
    />
    <BatchEditPictureModal
      ref="batchEditPictureModal"
      :spaceId="id"
      :pictures="dataList"
      :onSuccess="onBatchEditPictureSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, h, onMounted, reactive, ref, watch, watchEffect } from 'vue'
import { getSpaceVoByIdUsingGet } from '@/service/api/spaceController.ts'
import { message } from 'ant-design-vue'
import {
  listPictureVoByPageUsingPost,
  searchPictureByColorUsingPost,
} from '@/service/api/pictureController.ts'
import { formatSize } from '@/utils'
import PictureList from '@/components/PictureList.vue'
import PictureSearchForm from '@/components/PictureSearchForm.vue'
import { ColorPicker } from 'vue3-colorpicker'
import 'vue3-colorpicker/style.css'
import BatchEditPictureModal from '@/components/BatchEditPictureModal.vue'
import { EditOutlined, BarChartOutlined, TeamOutlined } from '@ant-design/icons-vue'
import { SPACE_PERMISSION_ENUM, SPACE_TYPE_ENUM, SPACE_TYPE_MAP } from '@/constants/space.ts'

interface Props {
  id: string | number
}
const props = defineProps<Props>()
const space = ref<API.SpaceVO>({})

const fetchSpaceDetail = async () => {
  try {
    const res = await getSpaceVoByIdUsingGet({ id: String(props.id) })
    if (res.data.code === 200 && res.data.data) {
      space.value = res.data.data
      console.log('space', space.value)
    } else {
      message.error(res.data.message)
    }
  } catch (error: any) {
    message.error('获取空间详情失败,' + error.message)
  }
}

const dataList = ref<API.PictureVO[]>([])
const total = ref(0)
const loading = ref(true)

const searchParams = ref<API.PictureQueryDTO>({
  current: 1,
  pageSize: 15,
  sortField: 'createTime',
  sortOrder: 'descend',
})

const onSearch = (newSearchParams: API.PictureQueryDTO) => {
  searchParams.value = {
    ...searchParams.value,
    ...newSearchParams,
    current: 1,
  }
  fetchData()
}

const onPageChange = (page: number, pageSize: number) => {
  searchParams.value.current = page
  searchParams.value.pageSize = pageSize
  fetchData()
}

const fetchData = async () => {
  try {
    loading.value = true
    const params = { spaceId: props.id, ...searchParams.value }
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

const onColorChange = async (color: string) => {
  try {
    loading.value = true
    const res = await searchPictureByColorUsingPost({
      picColor: color,
      spaceId: props.id,
    })
    if (res.data.code === 200 && res.data.data) {
      const data = res.data.data ?? []
      dataList.value = data
      total.value = data.length
    } else {
      message.error('按颜色搜索失败,' + res.data.message)
    }
  } catch (error: any) {
    message.error('按颜色搜索失败,' + error.message)
  } finally {
    loading.value = false
  }
}

const batchEditPictureModal = ref()

const onBatchEditPictureSuccess = () => {
  fetchData()
}

watch(
  () => props.id,
  () => {
    fetchData()
    fetchSpaceDetail()
  },
)

const doBatchEdit = () => {
  if (batchEditPictureModal.value) {
    batchEditPictureModal.value.openModal()
  }
}

const createPermissionChecker = (permission: string) => {
  console.log('permission', permission)
  console.log('space.value.permissions', space.value.permissions)
  return (space.value.permissions ?? []).includes(permission)
}

const canManageSpaceUser = computed(() =>
  createPermissionChecker(SPACE_PERMISSION_ENUM.SPACE_USER_MANAGER),
)
const canEdit = computed(() => createPermissionChecker(SPACE_PERMISSION_ENUM.PICTURE_EDIT))
const canDelete = computed(() => createPermissionChecker(SPACE_PERMISSION_ENUM.PICTURE_DELETE))
const canUpload = computed(() => createPermissionChecker(SPACE_PERMISSION_ENUM.PICTURE_UPLOAD))

onMounted(() => {
  fetchData()
  fetchSpaceDetail()
})
</script>

<style scoped>
#spaceDetailView {
  margin-bottom: 16px;
}
</style>
