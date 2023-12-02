<template>
  <div>
    <div class="header">
      <a-space :size="12" direction="vertical" align="center">
        <!-- <Upload
        :files="[]"
        :multiple="false"
        :size="100"
        shape="circle"
        dir="avatar"
        @confirm="uploadCallback"
      ></Upload> -->
        <a-avatar :size="100">
          <img alt="avatar" :src="userInfo.avatar ? userInfo.avatar : $logo" />
        </a-avatar>
        <a-typography-title :heading="6" :style="{ margin: 0, color: '#fff' }">
          {{ userInfo.name }}
        </a-typography-title>
      </a-space>
    </div>
    <div class="user-msg">
      <div class="msg-item">
        <div class="label"><icon-user-group size="16" /> 所属部门</div>
        <div class="desc">
          {{ userInfo.department?.name }}
        </div>
      </div>

      <div class="msg-item">
        <div class="label"><icon-safe size="16" /> 所属角色</div>
        <div class="desc">
          {{ userInfo.role?.name }}
        </div>
      </div>

      <div class="msg-item">
        <div class="label"><icon-mobile size="14" /> 联系电话</div>
        <div class="desc">
          {{ userInfo.phone }}
        </div>
      </div>

      <div class="msg-item">
        <div class="label"><icon-email size="14" /> 当前邮箱</div>
        <div class="desc">
          {{ userInfo.email }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { updateUser } from '@/api/manager/user';
  import Upload from '@/components/upload/index.vue';

  import { useUserStore } from '@/store';
  import { Message } from '@arco-design/web-vue';

  const userInfo = useUserStore();

  // const uploadCallback = async (files: any[]) => {
  //   // todo更新用户信息
  //   if (files.length) {
  //     console.log({ id: userInfo.id, avatar: files[0].url });
  //     await updateUser({ id: userInfo.id, avatar: files[0].url });
  //     Message.success('更换头像成功');
  //     // userInfo.info();
  //   }
  // };
</script>

<style scoped lang="less">
  .header {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    color: var(--gray-10);
    background: rgb(var(--blue-6));
    overflow: hidden;
    background-size: cover;
    position: relative;
    :deep(.arco-avatar-trigger-icon-button) {
      color: rgb(var(--arcoblue-6));

      :deep(.arco-icon) {
        vertical-align: -1px;
      }
    }
    &::after {
      content: '';
      display: block;
      position: absolute;
      width: 100%;
      height: 150px;
      left: 0px;
      bottom: -1px;
      background: url('@/assets/images/wave.gif') no-repeat;
      mix-blend-mode: screen;
      background-size: 100% 100%;
    }
    .arco-avatar {
      background-color: #fff;
    }
  }

  .hr {
    height: 15px;
    width: 100%;
    // background-color: var(--color-fill-2);
  }

  .user-msg {
    padding: 15px;
    .arco-icon {
      color: rgb(var(--gray-10));
    }
    .arco-typography {
      margin-left: 6px;
    }

    .msg-item {
      padding: 5px 0px;
      display: flex;
      justify-content: space-around;
      .label {
        text-align: left;
        width: 50%;
      }
      .desc {
        text-align: right;
        width: 50%;
        color: rgb(var(--gray-7));
      }
    }
  }
</style>
