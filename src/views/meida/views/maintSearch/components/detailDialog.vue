<template>
  <div v-if="change==1">
    <div class="dialog-content">
      <div class="dialog-item">
        <span class="label">地址：</span>
        <span class="value">{{ maintDetail.buildingName }}{{ maintDetail.unit }}{{
            maintDetail.room
          }}</span>
      </div>
      <div class="dialog-item">
        <span class="label">电话：</span>
        <span class="value">{{ maintDetail.phoneNumber }}</span>
      </div>
      <div class="dialog-item">
        <span class="label">用户：</span>
        <span class="value">{{ maintDetail.clientName }}</span>
      </div>
      <div class="dialog-item">
        <span class="label">问题描述：</span>
        <span class="value">{{ maintDetail.maintDescription }}</span>
      </div>
      <div class="dialog-item">
        <span class="label">地址描述：</span>
        <span class="value">{{ maintDetail.locationDescription }}</span>
      </div>
      <div class="dialog-item">
        <span class="label">登记人：</span>
        <span class="value">{{ maintDetail.adderName }}</span>
      </div>
      <div class="dialog-item">
        <span class="label">参与者：</span>
        <span class="value">{{ maintDetail.completerName }}</span>
      </div>
      <div class="dialog-item">
        <span class="label">登记时间：</span>
        <span class="value">{{ maintDetail.createTime }}</span>
      </div>
      <div class="dialog-item">
        <span class="label">完成时间：</span>
        <span class="value">{{ maintDetail.finishTime }}</span>
      </div>
    </div>
    <!-- 按钮容器 -->
    <div class="dialog-footer">
      <el-button @click="deleteMaint">删除</el-button>
      <el-button style="background-color: #242f42; color: white; " @click="openEdit(maintDetail.id)">修改</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useRouter} from 'vue-router';
import {defineEmits, onMounted, ref} from "vue";
const change = ref(1);
const props = defineProps(["maintDetail"]);
//路由
const router = useRouter();
const emit = defineEmits(["update"]);

const openEdit = (maintId: any) => {
  emit("update", maintId);
}

</script>

<style scoped>
/* 弹窗内容整体样式 */
.dialog-content {
  display: flex;
  flex-direction: column;
  gap: 10px; /* 项目间的间距 */
}

/* 每一项的样式 */
.dialog-item {
  display: flex;
  align-items: baseline; /* 垂直对齐到基线 */
  font-size: 14px;
}

/* 标签的样式 */
.label {
  font-weight: bold;
  min-width: 80px; /* 确保标签宽度一致 */
  color: #333;
}

/* 值的样式 */
.value {
  flex: 1; /* 自动适配剩余宽度 */
  color: #666;
  word-break: break-word; /* 如果值过长允许换行 */
  word-wrap: break-word; /* 允许在单词边界换行 */
  white-space: pre-wrap; /* 保留换行符，且内容自动换行 */
}

.dialog-footer {
  text-align: center; /* 使按钮居中 */
  margin-top: 20px; /* 根据需要调整上边距 */
}

.report-footer {
  text-align: right; /* 使按钮居中 */
}

select {
  width: 300px;
  height: 34px;
  border: 2px solid rgb(226, 224, 224);
  border-radius: 5px;
  text-decoration: none;
  box-shadow: none; /* 去除阴影 */
  background: none; /* 去除背景 */
  outline: none; /* 去除焦点时的轮廓 */
  padding: 2px; /* 内边距 */
  font-size: 14px; /* 自定义字体大小 */
  color: #000000; /* 自定义字体颜色 */
  transition: all 0.3s ease; /* 添加过渡效果 */
}

option {
  transition: all 0.3s ease; /* 添加过渡效果 */
}

/* 鼠标悬停时的效果 */
select:hover {
  border: 2px solid #8e8e8e; /* 自定义悬停边框颜色 */
}

/* 聚焦时的效果 */
select:focus {
  border: 2px solid #525252; /* 自定义焦点边框颜色 */
  outline: none; /* 去除默认焦点轮廓 */
}

::v-deep .el-table__inner-wrapper {
  min-height: 150px;
}
</style>