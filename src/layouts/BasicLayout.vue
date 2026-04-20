<template>
  <div id="basicLayout">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header"><GlobalHeader /></a-layout-header>
      <a-layout-content>
        <!--router-view会自动根据路由匹配对应的组件-->
        <router-view />
      </a-layout-content>
      <div style="margin-bottom: 40px" />
      <a-layout-footer class="footer">
        <a href="https://www.codefather.cn" target="_blank"> 编程导航 by Shea </a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import GlobalHeader from '@/components/GlobalHeader.vue'
</script>

<style scoped>
#basicLayout .header {
  padding-inline: 20px;
  background-color: #fff;
  color: unset;
  margin-bottom: 16px;
}
#basicLayout .content {
  padding: 20px;
  background: linear-gradient(to right, #fefefe, #fff);
  margin-bottom: 20px;
}
#basicLayout .footer {
  background-color: #efefef;
  padding: 16px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
}
</style>
