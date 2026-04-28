<template>
  <div id="globalSider">
    <a-layout-sider
      v-if="loginUserStore.loginUser.id"
      width="200"
      breakpoint="lg"
      style="background-color: #fff"
    >
      <a-menu
        v-model:selectedKeys="current"
        mode="inline"
        :items="menuItems"
        @click="doMenuClick"
      />
    </a-layout-sider>
  </div>
</template>

<script setup lang="ts">
import { computed, h, onMounted, ref, watchEffect } from 'vue'
import { HomeOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons-vue'
import { type MenuProps, message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { SPACE_TYPE_ENUM } from '@/constants/space.ts'
import { listSpaceUserUsingPost } from '@/service/api/spaceUserController.ts'

const loginUserStore = useLoginUserStore()

const fixedMenuItems: MenuProps['items'] = [
  {
    key: '/',
    icon: () => h(HomeOutlined),
    label: '公共图库',
    title: '公共图库',
  },
  {
    key: '/my_space',
    icon: () => h(UserOutlined),
    label: '我的空间',
  },
  {
    key: '/space/add_space?type=' + SPACE_TYPE_ENUM.TEAM,
    label: '创建团队',
    icon: () => h(TeamOutlined),
  },
]

const teamSpaceList = ref<API.SpaceUserVO[]>([])

const menuItems = computed(() => {
  if (teamSpaceList.value.length < 1) {
    return fixedMenuItems
  }

  const teamSpaceSubMenus = teamSpaceList.value.map((spaceUser) => {
    const space = spaceUser.space
    return {
      key: '/space/' + spaceUser.spaceId,
      label: space?.spaceName,
    }
  })

  const teamSpaceMenuGroup = {
    type: 'group',
    label: '我的团队',
    key: 'teamSpace',
    children: teamSpaceSubMenus,
  }
  return [...fixedMenuItems, teamSpaceMenuGroup]
})

const getTeamSpaceList = async () => {
  const res = await listSpaceUserUsingPost({ userId: loginUserStore.loginUser.id })
  if (res.data.code === 200 && res.data.data) {
    teamSpaceList.value = res.data.data
  } else {
    message.error('加载我的团队空间失败,' + res.data.message)
  }
}

watchEffect(() => {
  if (loginUserStore.loginUser.id) {
    getTeamSpaceList()
  }
})

const router = useRouter()

const doMenuClick = ({ key }: { key: string }) => {
  router.push(key)
}

const current = ref<string[]>([''])
router.afterEach((to) => {
  current.value = [to.path]
})
</script>

<style scoped>
#globalSider .ant-layout-sider {
  background: none;
}
</style>
