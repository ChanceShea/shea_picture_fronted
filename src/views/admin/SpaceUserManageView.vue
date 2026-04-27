<template>
  <div id="spaceManageView">
    <a-flex justify="space-between">
      <h2>空间成员管理</h2>
      <a-space>
        <a-button type="primary" href="/space/add_space" target="_blank">创建空间</a-button>
        <a-button type="primary" ghost href="/space_analyze?queryPublic=1" target="_blank"
          >分析公共图库</a-button
        >
        <a-button type="primary" ghost href="/space_analyze?queryAll=1" target="_blank"
          >分析全部空间</a-button
        >
      </a-space>
    </a-flex>
    <div style="margin-bottom: 16px" />
    <!--添加成员表单-->
    <a-form layout="inline" :model="formData" @finish="handleSubmit">
      <a-form-item label="用户id" name="userId">
        <a-input v-model:value="formData.userId" placeholder="请输入用户id" allow-clear />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">添加用户</a-button>
      </a-form-item>
    </a-form>
    <div style="margin-bottom: 16px" />
    <!--表格-->
    <a-table :columns="columns" :data-source="dataList">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'userInfo'">
          <a-space>
            <a-avatar :src="record.user?.userAvatar" />
            {{ record.user?.userName }}
          </a-space>
        </template>
        <template v-else-if="column.dataIndex === 'spaceRole'">
          <a-select
            v-model:value="record.spaceRole"
            :options="SPACE_ROLE_OPTIONS"
            @change="(value) => editSpaceRole(value, record)"
          />
        </template>
        <template v-else-if="column.dataIndex === 'createTime'">
          {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space wrap>
            <a-button type="link" danger @click="doDelete(record.id)">删除</a-button>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { SPACE_ROLE_OPTIONS } from '@/constants/space.ts'
import {
  addSpaceUserUsingPost,
  deleteSpaceUserUsingPost,
  editSpaceUserUsingPost,
  listSpaceUserUsingPost,
} from '@/service/api/spaceUserController.ts'

const columns = [
  {
    title: '用户',
    dataIndex: 'userInfo',
  },
  {
    title: '角色',
    dataIndex: 'spaceRole',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '操作',
    key: 'action',
  },
]

interface Props {
  id: string
}

const props = defineProps<Props>()

const dataList = ref<API.SpaceUserVO[]>([])

const formData = reactive<API.SpaceUserAddDTO>({})
const fetchData = async () => {
  console.log('props.spaceId', props.id)
  const res = await listSpaceUserUsingPost({
    spaceId: props.id,
  })
  if (res.data.code === 200 && res.data.data) {
    console.log(res.data.data)
    dataList.value = res.data.data ?? []
  } else {
    message.error('获取数据失败,' + res.data.message)
  }
}

const doDelete = async (id: number) => {
  if (!id) return
  const res = await deleteSpaceUserUsingPost({ id })
  if (res.data.code === 200) {
    message.success('删除成功')
    await fetchData()
  } else {
    message.error('删除失败,' + res.data.message)
  }
}

const editSpaceRole = async (value: number, record: API.SpaceUserVO) => {
  const res = await editSpaceUserUsingPost({
    id: record.id,
    spaceRole: value,
  })
  if (res.data.code === 200) {
    message.success('修改成功')
    await fetchData()
  } else {
    message.error('修改失败,' + res.data.message)
  }
}

const handleSubmit = async () => {
  const spaceId = props.id
  if (!spaceId) return
  const res = await addSpaceUserUsingPost({
    spaceId,
    ...formData,
  })
  if (res.data.code === 200) {
    message.success('添加成功')
    await fetchData()
  } else {
    message.error('添加失败,' + res.data.message)
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped></style>
