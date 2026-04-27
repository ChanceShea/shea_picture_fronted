<template>
  <div id="addSpaceView">
    <h2 style="margin-bottom: 16px">
      {{ route.query?.id ? '编辑' : '创建' }}{{ SPACE_TYPE_MAP[spaceType] }}
    </h2>
    <a-form name="spaceForm" layout="vertical" :model="spaceForm" @finish="handleSubmit">
      <a-form-item name="name" label="空间名称">
        <a-input v-model:value="spaceForm.spaceName" placeholder="请输入空间名称" allow-clear />
      </a-form-item>
      <a-form-item name="category" label="分类">
        <a-select
          v-model:value="spaceForm.spaceLevel"
          placeholder="请输入空间级别"
          :options="SPACE_LEVEL_OPTIONS"
          auto-clear
        />
      </a-form-item>
      <a-form-item>
        <a-button
          type="primary"
          html-type="submit"
          :loading="loading"
          style="width: 100%; margin-bottom: 48px"
          >创建空间</a-button
        >
      </a-form-item>
    </a-form>
    <a-card title="空间级别介绍">
      <a-typography-paragraph>
        目前仅支持开通普通版，如需升级空间，请联系<a href="javascript:void(0)">Shea</a>
      </a-typography-paragraph>
      <a-typography-paragraph v-for="spaceLevel in spaceLevelList">
        {{ spaceLevel.text }}：大小 {{ formatSize(spaceLevel.maxSize) }}，数量
        {{ spaceLevel.maxCount }} 张图片
      </a-typography-paragraph>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import {
  addSpaceUsingPost,
  editSpaceUsingPost,
  getSpaceLevelUsingGet,
  getSpaceVoByIdUsingGet,
  updateSpaceUsingPut,
} from '@/service/api/spaceController.ts'
import { useRoute, useRouter } from 'vue-router'
import { SPACE_LEVEL_OPTIONS, SPACE_TYPE_ENUM, SPACE_TYPE_MAP } from '@/constants/space.ts'
import { formatSize } from '@/utils'

const space = ref<API.SpaceVO>()
const spaceForm = reactive<API.SpaceAddDTO | API.SpaceEditDTO>({
  spaceName: '',
  spaceLevel: 0,
})
const spaceLevelList = ref<API.SpaceLevel[]>([])
const loading = ref(false)

const spaceType = computed(() => {
  if (route.query?.type) {
    return Number(route.query.type)
  }
  return SPACE_TYPE_ENUM.PRIVATE
})

const router = useRouter()

const fetchSpaceLevelList = async () => {
  const res = await getSpaceLevelUsingGet()
  if (res.data.code === 200 && res.data.data) {
    spaceLevelList.value = res.data.data
  } else {
    message.error('获取空间级别失败' + res.data.message)
  }
}

const handleSubmit = async () => {
  try {
    const spaceId = space.value?.id
    loading.value = true
    let res
    if (spaceId) {
      res = await updateSpaceUsingPut({
        id: spaceId,
        ...spaceForm,
      })
    } else {
      res = await addSpaceUsingPost({
        spaceType: spaceType.value,
        ...spaceForm,
      })
    }
    if (res.data.code === 200 && res.data.data) {
      message.success('操作成功')
      await router.push(`/space/${res.data.data}`)
    } else {
      message.error('操作失败,' + res.data.message)
    }
  } catch (e: any) {
    message.error('操作失败,' + e.message)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getOldSpace()
  fetchSpaceLevelList()
})

const route = useRoute()
const getOldSpace = async () => {
  const id = route.query?.id
  if (id) {
    const res = await getSpaceVoByIdUsingGet({ id: Number(id) })
    if (res.data.code === 200 && res.data.data) {
      const data = res.data.data
      spaceForm.spaceName = data.spaceName
      spaceForm.spaceLevel = data.spaceLevel
    }
  }
}
</script>

<style scoped>
#addSpaceView {
  max-width: 720px;
  margin: 0 auto;
}
</style>
