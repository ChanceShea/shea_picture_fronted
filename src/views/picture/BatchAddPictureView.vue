<template>
  <div id="batchAddPictureView">
    <h2 style="margin: 16px; text-align: center">批量创建图片</h2>
    <a-form
      style="max-width: 400px; margin: 0 auto"
      name="pictureForm"
      layout="vertical"
      :model="formData"
      @finish="handleSubmit"
    >
      <a-form-item name="searchText" label="关键词">
        <a-input v-model:value="formData.searchText" placeholder="请输入关键词" allow-clear />
      </a-form-item>
      <a-form-item name="count" label="抓取数量">
        <a-input-number
          v-model:value="formData.count"
          placeholder="请输入抓取数量"
          style="min-width: 180px"
          :min="1"
          :max="30"
          allow-clear
        />
      </a-form-item>
      <a-form-item name="namePrefix" label="名称前缀">
        <a-input v-model:value="formData.namePrefix" placeholder="请输入名称前缀" allow-clear />
      </a-form-item>
      <a-form-item>
        <a-button
          :loading="loading"
          type="primary"
          html-type="submit"
          style="width: 100%; margin-bottom: 48px"
          >批量提交</a-button
        >
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import {
  editPictureUsingPost,
  getPictureVoByIdUsingGet,
  listPictureTagCategoryUsingGet,
  uploadPictureByBatchUsingPost,
} from '@/service/api/pictureController.ts'
import { useRoute, useRouter } from 'vue-router'

const formData = reactive<API.PictureUploadBatchDTO>({
  searchText: '',
  count: 10,
  namePrefix: '',
})

const router = useRouter()
const loading = ref(false)
const handleSubmit = async (values: any) => {
  try {
    loading.value = true
    const res = await uploadPictureByBatchUsingPost({
      ...formData,
    })
    if (res.data.code === 200 && res.data.data) {
      message.success(`创建成功，共${res.data.data}条`)
      router.push('/')
    } else {
      message.error('创建失败,' + res.data.message)
    }
  } catch (e: any) {
    message.error('登录失败,' + e.message)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
#addPictureView {
  max-width: 720px;
  margin: 0 auto;
}
</style>
