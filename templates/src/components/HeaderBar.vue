<template>
    <div class="header-bar">
        <div class="logo">无人机AI巡检平台</div>
        <div class="header-actions">
            <el-dropdown trigger="click" placement="bottom">
                <div class="user-info">
                    <el-avatar icon="el-icon-user-solid" />
                    <span class="username">admin</span>
                    <el-icon class="arrow-icon">
                        <arrow-down />
                    </el-icon>
                </div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script setup lang="ts">
// 可根据需要添加props和事件
import { ArrowDown } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
const router = useRouter();
// 退出登录处理函数
const handleLogout = () => {
  // 这里添加退出登录逻辑
  // 例如清除token、跳转到登录页等
  ElMessage({ message: '退出登录成功', type: 'success' });
  // 实际应用中可能需要调用API和路由跳转
  localStorage.removeItem('token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('username');
  router.push('/login');
}
</script>

<style scoped>
.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  background: #fff;
  border-bottom: 1px solid #eee;
}
.user-info{
  display: flex;
  align-items: center;
}
.logo {
  font-size: 20px;
  font-weight: bold;
  color: #1890ff;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}
.search-input {
  width: 200px;
}
.username {
  margin-left: 8px;
}
</style> 