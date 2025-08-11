<template>
  <el-table :data="tableData" style="width: 100%;" :height="tableHeight">
    <el-table-column type="index" width="80" label="序号" />
    <el-table-column v-for="col in columns" :key="col.prop" :prop="col.prop" :label="col.label" :width="col.width"/>
    <slot />
  </el-table>
  <el-pagination
    :current-page="currentPage"
    :page-size="pageSize"
    :total="total"
    layout="prev, pager, next, jumper"
    @current-change="handlePageChange"
    background
  />
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

defineProps<{
  columns: Array<{ label: string; prop: string,width?: string | number }>;
  tableData: any[];
  total: number;
  pageSize: number;
  currentPage: number;
  tableHeight: string;
}>();
const emit = defineEmits(['page-change']);


function handlePageChange(page: number) {
  emit('page-change', page);
}
</script> 
<style lang="scss" scoped>
.el-table{
  --el-table-header-bg-color:#E9F6FF;
  --el-table-header-text-color: #199EFD;
  :deep(thead th) {
    padding: 15px 0;
  }
  :deep(.cell) {
    text-align: center;
  }
}
.el-pagination{
  margin-top: 20px;
  text-align: right;
  justify-content: flex-end;
}
</style>