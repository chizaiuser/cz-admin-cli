<template>
  <div class="side-bar">
    <div class="logo">
      <img :src="logoImg" alt="logo" />
    </div>
    <el-menu :default-active="activeMenu" class="el-menu-vertical-demo" router>
      <el-menu-item index="/">
        <div>
          <Icon icon="yijianfankui" :size="24" class="left_icon" />
          <span>意见反馈</span>
        </div>
      </el-menu-item>
      <el-menu-item index="/account">
        <div>
          <Icon icon="zu1774" :size="24" class="left_icon" />
          <span>账号管理</span>
        </div>
      </el-menu-item>
      <el-menu-item index="/aduser">
        <div>
          <Icon icon="guanliyuanguanli" :size="24" class="left_icon" />
          <span>管理员管理</span>
        </div>
      </el-menu-item>
      <el-menu-item index="/model">
        <div>
          <Icon icon="AImoxingguanli" :size="24" class="left_icon" />
          <span>ai模型管理</span>
        </div>
      </el-menu-item>
      <!-- 可扩展其他菜单项 -->
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import logoImg from '@/assets/images/logo.png'
import Icon from './icon/Icon.vue';
const activeMenu = ref('');
</script>

<style lang="scss" scoped>
.side-bar {
  height: 100vh;
  background: #fff;
  // border-right: 1px solid #eee;
  box-shadow: 0px 2px 8px 0px rgba(0,0,0,0.2);
  .el-menu{
    border-right:none;
    height: calc(100vh - 70px);
    --el-menu-active-color:#fff;
    --el-menu-text-color:#333;
    padding: 20px 10px 10px 10px;
    .el-menu-item{
      padding: 0;
      margin-bottom: 10px;
      >div{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 64px;
        >i{
          height: 18px;
        }
        >span{
          margin-top: 10px;
        }
      }
    }
    .is-active{
      background-color: #199EFD;
      border-radius: 8px;
    }
  }
}
.logo{
  height: 60px;
  text-align: center;
  position: relative;
  >img{
    width:36px;
    height:36px;
    text-align:center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style> 