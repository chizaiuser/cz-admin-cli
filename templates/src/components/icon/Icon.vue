/** ** 自定义图标的简单封装 **/
<template>
  <i
    :class="['iconfont', `icon-${icon}`]"
    :style="{
      fontSize: iconSize + 'px',
      color: color
    }"
    @mouseenter="emit('mouseenter')"
    @mouseleave="emit('mouseleave')"
  ></i>
</template>
<script lang="ts" setup>
import { computeSize } from '@/utils/common.func'
import { ref, onBeforeUnmount } from 'vue'
const props = withDefaults(
  defineProps<{
    icon: string // 图标名称
    size?: number // 图标大小
    color?: string // 图标颜色
  }>(),
  {
    size: 16
  }
)
const iconSize = ref<number>(computeSize(props.size))

window.addEventListener('resize', () => {
  iconSize.value = computeSize(props.size)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', () => {
    iconSize.value = computeSize(props.size)
  })
})

const emit = defineEmits(['mouseenter', 'mouseleave'])
</script>
<style lang="scss" scoped></style>
