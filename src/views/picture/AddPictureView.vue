<template>
  <div id="addPictureView">
    <h2 style="margin-bottom: 16px">{{ route.query?.id ? '编辑' : '创建' }}图片</h2>
    <a-typography-paragraph v-if="spaceId" type="secondary">
      <a :href="`/space/${spaceId}`" target="_blank">保存至空间：{{ spaceId }}</a>
    </a-typography-paragraph>
    <a-tabs :activeKey="uploadType" @change="handleChange">
      <a-tab-pane key="file" tab="文件上传">
        <PictureUpload :picture="picture" :spaceId="spaceId" :onSuccess="onSuccess" />
      </a-tab-pane>
      <a-tab-pane key="url" tab="URL上传">
        <UrlPictureUpload :picture="picture" :spaceId="spaceId" :onSuccess="onSuccess" />
      </a-tab-pane>
    </a-tabs>
    <!--    图片编辑区域-->
    <div v-if="picture" class="edit-bar">
      <a-button :icon="h(EditOutlined)" @click="doEditPicture">编辑图片</a-button>
    </div>
    <ImageCropper
      ref="imageCropperRef"
      :spaceId="spaceId"
      :imageUrl="picture?.url"
      :picture="picture"
      :onSuccess="onCropSuccess"
    />
    <a-form
      v-if="picture"
      name="pictureForm"
      layout="vertical"
      :model="pictureForm"
      @finish="handleSubmit"
    >
      <a-form-item name="name" label="图片名称">
        <a-input v-model:value="pictureForm.name" placeholder="请输入图片名称" allow-clear />
      </a-form-item>
      <a-form-item name="introduction" label="图片简介">
        <a-textarea
          v-model:value="pictureForm.introduction"
          placeholder="请输入简介"
          :autoSize="{ minRows: 2, maxRows: 5 }"
          allow-clear
        />
      </a-form-item>
      <a-form-item name="category" label="分类">
        <a-auto-complete
          v-model:value="pictureForm.category"
          placeholder="请输入分类"
          :options="categoryOptions"
          auto-clear
        />
      </a-form-item>
      <a-form-item name="tags" label="标签">
        <a-select
          v-model:value="pictureForm.tags"
          mode="tags"
          placeholder="请输入标签"
          :options="tagOptions"
          allow-clear
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%; margin-bottom: 48px"
          >创建图片</a-button
        >
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import PictureUpload from '@/components/PictureUpload.vue'
import { computed, h, onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import {
  editPictureUsingPost,
  getPictureVoByIdUsingGet,
  listPictureTagCategoryUsingGet,
} from '@/service/api/pictureController.ts'
import { useRoute, useRouter } from 'vue-router'
import UrlPictureUpload from '@/components/UrlPictureUpload.vue'
import ImageCropper from '@/components/ImageCropper.vue'
import { EditOutlined } from '@ant-design/icons-vue'

const picture = ref<API.PictureVO>()
const pictureForm = reactive<API.PictureEditDTO>({
  name: '',
  introduction: '',
  category: '',
  tags: [],
})
const onSuccess = (newPicture: API.PictureVO) => {
  picture.value = newPicture
  pictureForm.name = newPicture.name
}

const route = useRoute()

const spaceId = computed(() => {
  return route.query?.spaceId
})

const uploadType = ref<'file' | 'url'>('file')

const handleChange = (key: string) => {
  uploadType.value = key as 'file' | 'url'
}

const router = useRouter()

const handleSubmit = async (values: any) => {
  try {
    const pictureId = picture.value?.id
    if (!pictureId) {
      return
    }
    const res = await editPictureUsingPost({
      id: pictureId,
      spaceId: spaceId.value,
      ...values,
    })
    if (res.data.code === 200 && res.data.data) {
      message.success('创建成功')
      router.push({
        path: `/picture/${pictureId}`,
      })
    } else {
      message.error('创建失败,' + res.data.message)
    }
  } catch (e: any) {
    message.error('登录失败,' + e.message)
  }
}

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
  getOldPicture()
})

const getOldPicture = async () => {
  const id = route.query?.id
  if (id) {
    const res = await getPictureVoByIdUsingGet({ id: Number(id) })
    if (res.data.code === 200 && res.data.data) {
      const data = res.data.data
      picture.value = data
      pictureForm.name = data.name
      pictureForm.introduction = data.introduction
      pictureForm.category = data.category
      pictureForm.tags = data.tags
    }
  }
}

const imageCropperRef = ref()

const doEditPicture = () => {
  imageCropperRef.value?.openModal()
}

const onCropSuccess = (newPicture: API.PictureVO) => {
  picture.value = newPicture
}
</script>

<style scoped>
#addPictureView {
  max-width: 720px;
  margin: 0 auto;
}

#addPictureView .edit-bar {
  text-align: right;
  margin: 16px 0;
}
</style>
