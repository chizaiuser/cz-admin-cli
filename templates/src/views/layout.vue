<template>
  <el-container style="height: 100vh">
    <el-aside width="100px">
      <SideBar />
    </el-aside>
    <el-container direction="vertical">
      <el-header>
        <HeaderBar />
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import HeaderBar from '@/components/HeaderBar.vue';
import SideBar from '@/components/SideBar.vue';
</script> 
<style lang="scss" scoped>
.el-aside{
    height: 100vh;
    overflow: hidden;
}
.el-main{
  background-color: #EEF6FF;
}
</style>