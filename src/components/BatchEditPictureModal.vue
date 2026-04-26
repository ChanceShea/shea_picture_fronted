<template>
  <div class="share-modal">
    <a-modal v-model:open="visible" title="批量编辑图片" :footer="false" @cancel="closeModal">
      <a-typography-paragraph type="secondary">只对当前页面图片生效</a-typography-paragraph>
      <a-form-item name="category" label="分类">
        <a-select
          v-model:value="formData.category"
          placeholder="请选择分类"
          :options="categoryOptions"
          allow-clear
        />
      </a-form-item>
      <a-form>
        <a-form-item name="tags" label="标签">
          <a-select
            v-model:value="formData.tags"
            mode="tags"
            placeholder="请输入标签，多个用逗号分隔"
            :options="tagOptions"
            allow-clear
          />
        </a-form-item>
        <a-form-item name="nameRule" label="名称规则">
          <a-input
            v-model:value="formData.nameRule"
            placeholder="请输入命名规则，输入 {序号} 可动态生成"
            allow-clear
          />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" style="width: 100%" @click="handleSubmit"
            >提交</a-button
          >
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import {
  editPictureByBatchUsingPost,
  listPictureTagCategoryUsingGet,
} from '@/service/api/pictureController.ts'
import { message } from 'ant-design-vue'

interface Props {
  pictures: API.PictureVO[]
  spaceId: number
  onSuccess: () => void
}

const props = withDefaults(defineProps<Props>(), {})

const visible = ref(false)

const openModal = () => {
  visible.value = true
}

const closeModal = () => {
  visible.value = false
}

const formData = reactive<API.PictureEditBatchDTO>({
  category: '',
  nameRule: '',
  tags: [],
})

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

const handleSubmit = async (values: any) => {
  try {
    if (!props.pictures) {
      return
    }
    const res = await editPictureByBatchUsingPost({
      pictureIds: props.pictures.map((picture) => picture.id),
      spaceId: props.spaceId,
      ...formData,
    })
    if (res.data.code === 200 && res.data.data) {
      message.success('操作成功')
      closeModal()
      props.onSuccess?.()
    } else {
      message.error('操作失败,' + res.data.message)
    }
  } catch (err) {
    message.error('操作失败,' + err)
  }
}

onMounted(() => {
  getTagCategoryOptions()
})

defineExpose({
  openModal,
})
</script>

<style scoped></style>
