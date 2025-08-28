<template>
    <el-form
    :model="form"
    :rules="props.rules || {}"
    ref="ruleFormRef"
    label-width="80px"
    class="search-form"
  >
    <el-row :gutter="20">
      <el-col :span="getColSpan(item)" v-for="item in renderItems" :key="item.name">
        <el-form-item :label="item.label" :prop="item.name" :label-width="item.labelWidth || '120px'">
          <el-input
            v-if="item.type === 'input'"
            v-model="form[item.name]"
            :placeholder="item.placeholder"
          ></el-input>
          <el-select
            v-else-if="item.type === 'select'"
            v-model="form[item.name]"
            :placeholder="item.placeholder"
            filterable
            clearable
          >
            <el-option
              v-for="opt in item.options"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            ></el-option>
          </el-select>
          <el-date-picker
            v-else-if="item.type === 'date'"
            v-model="form[item.name]"
            type="date"
            :placeholder="item.placeholder"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
          <el-date-picker
            v-else-if="item.type === 'daterange'"
            v-model="form[item.name]"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
          <div v-else-if="item.type === 'custom'">
            <slot></slot>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-button-group class="button-group">
          <el-button type="primary" @click="onSubmit">筛选</el-button>
          <el-button @click="onReset(ruleFormRef)">重置</el-button>
        </el-button-group>
      </el-col>
    </el-row>
  </el-form>
</template>
  
<script setup lang="ts">
import { ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElDatePicker, ElButtonGroup, ElButton } from 'element-plus';
import { ref, defineProps } from 'vue';
import type { FormInstance } from 'element-plus'
interface SearchFormItem {
  label: string;
  name: string;
  type: string;
  options?: { label: string; value: string }[]; // for select
  placeholder?: string;
  rules?: any[];
  labelWidth?: string;
  colSpan?: number; // 1~6, 默认1
  labelCol?: { span: number; offset?: number }; // 标签的位置
  filterOption?: false
}
const emit = defineEmits(['submit', 'reset']);
const props = withDefaults(defineProps<{
    items: SearchFormItem[],
    initialValues: any,
    rules?:any,
}>(), {
});
const renderItems = ref(props.items);
const ruleFormRef = ref<FormInstance>()
const form = ref(props.initialValues);
const getColSpan = (item: SearchFormItem) => {
    if (item.colSpan) return item.colSpan;
    return 4;
};
const onSubmit = () => {
  emit('submit', form.value);
}
const onReset = (formEl: FormInstance | undefined) => {
  // form.value = {...props.initialValues};
   if (!formEl) return
  formEl.resetFields()
  emit('reset', form.value);
}
</script> 
<style lang="scss" scoped>
.el-form{
  .el-form-item{
    margin-bottom: 20px;
  }
}
</style>