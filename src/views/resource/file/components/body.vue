<template>
  <div class="body">
    <div
      v-if="fileList.length"
      v-permission="'resource:file:query'"
      style="height: 100%"
    >
      <div v-if="showCard" class="card content">
        <div v-for="file in fileList" :key="file.id" class="item">
          <div
            class="file"
            :class="isSelectd(file.id) ? 'active' : ''"
            @click.exact="fileSelect(file)"
            @click.alt.exact="multipleFileSelect(file)"
          >
            <div class="item-icon">
              <div v-if="isSelectd(file.id)" class="select-icon" @click.stop>
                <a-checkbox
                  :default-checked="true"
                  :value="file.id"
                  @change="multipleCheckedChange"
                ></a-checkbox>
              </div>

              <div v-if="fileType(file) === 'image'" class="image">
                <img :src="$rurl(file.src, 100, 100)" />
                <span class="preview" @click.stop="openFile(file)">预览</span>
              </div>

              <FileIcon
                v-if="fileType(file) === 'file' || fileType(file) === 'dir'"
                :type="file.type"
              ></FileIcon>

              <div v-if="fileType(file) === 'video'" class="video">
                <video :id="'video-' + file.id" preload="metadata">
                  <source :src="$rurl(file.src)" />
                </video>
                <div class="cover">
                  <icon-play-circle
                    class="icon"
                    size="28"
                    @click="openFile(file)"
                  />
                </div>
              </div>

              <div v-if="fileType(file) === 'music'" class="music">
                <div class="cover">
                  <svgIcon
                    class="bg"
                    name="file-music-bg"
                    :size="100"
                  ></svgIcon>
                  <icon-play-circle
                    class="icon"
                    size="28"
                    @click="openFile(file)"
                  />
                </div>
              </div>
            </div>
            <a-tooltip :content="file.name" mini :content-style="tipStyle">
              <div class="item-desc">
                {{ file.name }}
              </div>
            </a-tooltip>
          </div>
        </div>
      </div>

      <div v-else class="list content">
        <a-table
          v-model:selectedKeys="selectd"
          row-key="id"
          :columns="columns"
          :data="fileList"
          :sticky-header="400"
          :scroll="{
            x: '100%',
            y: '100%',
          }"
          :bordered="false"
          :pagination="false"
          :row-selection="{
            type: 'checkbox',
            showCheckedAll: true,
            onlyCurrent: false,
          }"
          row-class="table-row"
        >
          <template #name="{ record }">
            <div class="name">
              <FileIcon class="icon" :type="record.type" :size="20" />
              <a-tooltip :content="record.name" mini :content-style="tipStyle">
                <div class="text" @click="openFile(record)">{{
                  record.name
                }}</div>
              </a-tooltip>
            </div>
          </template>

          <template #created_at="{ record }">
            {{ $formatTime(record.created_at) }}
          </template>

          <template #size="{ record }">
            {{ getFileSize(record.size) }}
          </template>

          <template #operations="{ record }">
            <a-space class="cursor-pointer">
              <span style="color: #165dff">
                <icon-copy v-copy="$rurl(record.src)" size="15" />
              </span>

              <a-popconfirm
                content="您确认要下载此文件？"
                @ok="handleDownloadFile($rurl(record.src))"
              >
                <span style="color: #165dff">
                  <icon-cloud-download size="15" />
                </span>
              </a-popconfirm>

              <span
                style="color: #ff7d00"
                @click="
                  () => {
                    curFile = record;
                    submitForm.name = record.name;
                    updateVisible = true;
                  }
                "
              >
                <icon-edit size="15" />
              </span>

              <a-popconfirm
                v-if="record.id != 1"
                v-permission="'resource:file:delete'"
                content="您确认删除此文件"
                type="warning"
                @ok="emit('deleteFile', record.id)"
              >
                <span style="color: #f53f3f">
                  <icon-delete size="15" />
                </span>
              </a-popconfirm>
            </a-space>
          </template>
        </a-table>
      </div>

      <a-pagination
        :total="total"
        :current="page.current"
        :page-size="page.pageSize"
        show-total
        show-jumper
        show-page-size
        @change="pageChange"
        @page-size-change="pageSizeChange"
      />
    </div>

    <div v-else class="empty">
      <a-empty>
        <template #image>
          <svgIcon name="empty-data" :size="220" />
        </template>
        文件夹为空
      </a-empty>
    </div>

    <a-modal
      v-model:visible="playVideoVisible"
      width="480px"
      :hide-cancel="true"
      :footer="false"
      :body-style="{ padding: 0 }"
      unmount-on-close
    >
      <template #title>
        <div>{{ curFile.name }}</div>
      </template>
      <video
        v-if="playVideoVisible"
        class="video-model"
        autoplay
        controls
        preload="metadata"
      >
        <source :src="$rurl(curFile.src)" />
        当前浏览器不支持 video直接播放
      </video>
    </a-modal>

    <a-modal
      v-model:visible="playMusicVisible"
      width="480px"
      :hide-cancel="true"
      :footer="false"
      unmount-on-close
    >
      <template #title>
        <div>{{ curFile.name }}</div>
      </template>
      <audio
        v-if="playMusicVisible"
        class="music-model"
        autoplay
        controls
        preload="metadata"
        :src="$rurl(curFile.src) + '#t=1'"
      >
      </audio>
    </a-modal>

    <a-modal
      v-model:visible="showImageVisible"
      width="480px"
      :hide-cancel="true"
      :footer="false"
      :body-style="{ padding: 0 }"
    >
      <template #title>
        <div>{{ curFile.name }}</div>
      </template>
      <img
        v-if="showImageVisible"
        style="width: 100%"
        :src="$rurl(curFile.src)"
      />
    </a-modal>

    <a-modal
      v-model:visible="updateVisible"
      simple
      title="修改目录"
      @cancel="updateVisible = false"
      @before-ok="handleUpdateFile"
    >
      <a-form :model="submitForm" layout="vertical">
        <a-form-item
          field="name"
          label="请输入文件夹名称"
          :rules="[
            {
              required: true,
              message: '文件名称必填项',
            },
          ]"
          :validate-trigger="['change', 'input']"
        >
          <a-input v-model="submitForm.name" placeholder="请输入" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { File } from '@/api/resource/types/file';
  import Message from '@arco-design/web-vue/es/message';
  import { ref, watch } from 'vue';
  import FileIcon from './icon.vue';

  const emit = defineEmits([
    'deleteFile',
    'selectFile',
    'pageChange',
    'updateFile',
  ]);

  const props = defineProps<{
    total: number;
    showCard: boolean;
    fileList: File[];
    multipleSelect: boolean;
  }>();

  const playVideoVisible = ref(false);
  const playMusicVisible = ref(false);
  const showImageVisible = ref(false);
  const updateVisible = ref(false);
  const tipStyle = { fontSize: '12px' };
  const curFile = ref<File>({} as File);
  const selectd = ref<number[]>([]);
  const isSelectd = (id: number) => {
    return selectd.value.indexOf(id) !== -1;
  };
  const submitForm = ref({
    name: '',
  });

  const page = ref({
    current: 1,
    pageSize: 10,
  });

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      slotName: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      slotName: 'type',
      width: 70,
    },
    {
      title: '大小',
      dataIndex: 'size',
      slotName: 'size',
      width: 100,
    },
    {
      title: '上传时间',
      dataIndex: 'created_at',
      slotName: 'created_at',
      width: 200,
    },
    {
      title: '操作',
      dataIndex: 'operations',
      slotName: 'operations',
      width: 120,
    },
  ];

  const handleUpdateFile = () => {
    emit('updateFile', curFile.value.id, submitForm.value.name);
    return true;
  };

  const pageChange = (current: number) => {
    page.value.current = current;
    emit('pageChange', page.value);
  };

  const pageSizeChange = (size: number) => {
    page.value.pageSize = size;
    emit('pageChange', page.value);
  };

  const fileType = (file: File): string => {
    switch (file.type.toLocaleLowerCase()) {
      case 'png':
      case 'jpg':
      case 'jpeg':
        return 'image';
      case 'mp4':
      case 'mov':
      case 'flv':
        return 'video';
      case 'mp3':
      case 'avi':
        return 'music';
      default:
        return 'file';
    }
  };

  function getFileSize(size: number) {
    if (!size) return '';
    const num = 1024.0; // byte
    if (size < num) return `${size}B`;
    if (size < num ** 2) return `${(size / num).toFixed(2)}K`; // kb
    if (size < num ** 3) return `${(size / num ** 2).toFixed(2)}M`; // M
    if (size < num ** 4) return `${(size / num ** 3).toFixed(2)}G`; // G
    return `${(size / num ** 4).toFixed(2)}T`; // T
  }

  const openFile = (file: File) => {
    curFile.value = file;
    switch (fileType(file)) {
      case 'music':
        playMusicVisible.value = true;
        break;
      case 'video':
        playVideoVisible.value = true;
        break;
      case 'image':
        showImageVisible.value = true;
        break;
      case 'dir':
        break;
      default:
        Message.error('暂不支持查看此类型的文件');
        break;
    }
  };

  const restSelectd = () => {
    selectd.value = [];
  };

  const fileSelect = (file: File) => {
    restSelectd();
    selectd.value = [file.id];
  };

  const multipleFileSelect = (file: File) => {
    // 查找当前的文件是否存在列表
    const index = selectd.value.indexOf(file.id);

    if (props.multipleSelect) {
      if (index === -1) {
        selectd.value.push(file.id);
      } else {
        selectd.value.splice(index, 1);
      }
    } else {
      selectd.value = [file.id];
    }
  };

  const multipleCheckedChange = (value: any, event: Event) => {
    const id = Number((event.target as any).defaultValue);
    const index = selectd.value.indexOf(id);
    if (index === -1) {
      selectd.value.push(id);
    } else {
      selectd.value.splice(index, 1);
    }
  };
  watch(
    () => selectd.value,
    (val: number[]) => {
      emit('selectFile', val);
    },
    { deep: true }
  );
  const handleDownloadFile = (src: string) => {
    const link = document.createElement('a');
    link.href = src;
    link.target = '_blank';
    link.download = src.substring(src.lastIndexOf('/'));
    link.click();
  };
</script>

<style lang="less">
  .table-row {
    .arco-table-td {
      border: none !important;
      font-size: 13px !important;
      color: #333 !important;
      .arco-table-cell {
        padding: 12px 16px;
      }
    }
  }
</style>

<style scoped lang="less">
  .video-model {
    width: 100%;
    height: 320px;
  }
  .music-model {
    width: 100%;
  }

  .file-container {
    height: calc(100vh - 220px);
    overflow: hidden;
  }

  .body {
    margin-top: 10px;
    height: calc(100% - 40px);
    position: relative;
    .empty {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
    }

    .content {
      height: calc(100% - 45px) !important;
      overflow-y: scroll;
      padding-bottom: 10px;
    }
    .list {
      height: 100%;
      width: 100%;
      overflow-y: hidden;
      overflow-x: hidden;

      .name {
        display: flex;
        align-items: center;
        .icon {
          flex: 1;
        }
        .text {
          cursor: pointer;
          margin-left: 5px;
          white-space: nowrap;
          max-width: 180px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
    .card {
      width: 100%;
      overflow-y: scroll;
      overflow-x: hidden;
      display: flex;
      flex-wrap: wrap;
      &::-webkit-scrollbar {
        display: none;
      }
      .item {
        padding: 5px;

        .file {
          padding: 10px 10px 5px 10px;
          border-radius: 4px;
          width: 100px;
          overflow: hidden;
          box-sizing: content-box;
          &:hover {
            background-color: var(--color-neutral-1);
            .preview {
              display: block !important;
            }
          }
          .item-icon {
            width: 100px;
            height: 100px;
            position: relative;
            .select-icon {
              position: absolute;
              right: -10px;
              top: -10px;
              z-index: 10;
            }
            .image {
              width: 100%;
              height: 100%;
              position: relative;
              img {
                width: 100%;
                height: 100%;
                border-radius: 4px;
              }
              .preview {
                position: absolute;
                display: none;
                bottom: 0px;
                left: 0px;
                width: 100%;
                height: 20px;
                text-align: center;
                background: rgba(0, 0, 0, 0.4);
                font-size: 12px;
                line-height: 20px;
                color: #fff;
                cursor: pointer;
              }
            }

            .video {
              width: 100%;
              height: 100%;
              position: relative;

              video {
                width: 100%;
                height: 100%;
                object-fit: fill;
                border-radius: 4px;
              }
            }

            .music {
              width: 100%;
              height: 100%;
              position: relative;
              audio {
                width: 100%;
                height: 100%;
                object-fit: fill;
                border-radius: 4px;
              }
            }
          }

          .cover {
            position: absolute;
            top: 0px;
            left: 0px;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            .bg {
              position: absolute;
              top: 0px;
              left: 0px;
              width: 100%;
              height: 100%;
            }
            .icon {
              z-index: 10;
            }
          }
          .item-desc {
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-top: 5px;
            font-size: 12px;
            overflow: hidden;
            text-align: center;
          }
        }
        .active {
          background-color: var(--color-neutral-2) !important;
        }
      }
    }
  }
</style>
