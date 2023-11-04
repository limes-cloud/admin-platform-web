<template>
  <a-modal
    v-model:visible="visible"
    unmount-on-close
    @ok="onUpdateKeys"
    @cancel="visible = false"
  >
    <template #title> 选择部门 </template>
    <div class="content">
      <a-tree
        v-model:checked-keys="checkedKeys"
        :checkable="true"
        :check-strictly="true"
        :data="tree"
        :field-names="{
          key: 'id',
          title: 'name',
          children: 'children',
        }"
      />
    </div>
  </a-modal>
  <a-button type="outline" size="small" @click="visible = !visible"
    >已选择{{ checkedKeys.length }}个部门</a-button
  >
</template>

<script lang="ts" setup>
  import { TreeNodeData } from '@arco-design/web-vue/es/tree/interface';
  import { ref } from 'vue';

  const checkedKeys = ref<number[]>([]);
  const visible = ref(false);

  defineProps<{
    keys: number[];
    tree: TreeNodeData[];
  }>();
  const emit = defineEmits(['select', 'update:keys']);

  const onUpdateKeys = () => {
    emit('update:keys', checkedKeys);
  };
</script>

<style lang="less" scoped>
  .content {
    height: auto;
    max-height: 250px;
    overflow-y: scroll;
  }
</style>
