<template>
  <div id="spaceAnalyzeView">
    <h2>空间图库分析</h2>
    <span v-if="queryAll">全部空间</span>
    <span v-else-if="queryPublic">公共空间</span>
    <span v-else>
      <a :href="`/space/${spaceId}`" target="_blank">空间id:{{ spaceId }}</a>
    </span>
    <div style="margin-bottom: 16px" />
    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :md="12">
        <SpaceUsageAnalyze :queryAll="queryAll" :spaceId="spaceId" :queryPublic="queryPublic" />
      </a-col>
      <a-col :xs="24" :md="12">
        <SpaceCategoryAnalyze :queryAll="queryAll" :spaceId="spaceId" :queryPublic="queryPublic" />
      </a-col>
      <a-col :xs="24" :md="12">
        <SpaceTagAnalyze :queryAll="queryAll" :spaceId="spaceId" :queryPublic="queryPublic" />
      </a-col>
      <a-col :xs="24" :md="12">
        <SpaceSizeAnalyze :queryAll="queryAll" :spaceId="spaceId" :queryPublic="queryPublic" />
      </a-col>
      <a-col :xs="24" :md="12">
        <SpaceUserAnalyze :queryAll="queryAll" :spaceId="spaceId" :queryPublic="queryPublic" />
      </a-col>
      <a-col v-if="isAdmin" :xs="24" :md="12">
        <SpaceRankAnalyze :queryAll="queryAll" :spaceId="spaceId" :queryPublic="queryPublic" />
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import SpaceUsageAnalyze from '@/components/SpaceUsageAnalyze.vue'
import SpaceCategoryAnalyze from '@/components/SpaceCategoryAnalyze.vue'
import SpaceTagAnalyze from '@/components/SpaceTagAnalyze.vue'
import SpaceSizeAnalyze from '@/components/SpaceSizeAnalyze.vue'
import SpaceUserAnalyze from '@/components/SpaceUserAnalyze.vue'
import SpaceRankAnalyze from '@/components/SpaceRankAnalyze.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'

const route = useRoute()
const spaceId = computed(() => {
  return route.query?.spaceId as string
})
const queryAll = computed(() => {
  return !!route.query?.queryAll
})
const queryPublic = computed(() => {
  return !!route.query?.queryPublic
})

const loginUserStore = useLoginUserStore()
const loginUser = loginUserStore.loginUser

const isAdmin = computed(() => {
  return loginUser.userRole === 'admin'
})
</script>

<style scoped>
#spaceAnalyzeView {
  margin-bottom: 16px;
}
</style>
