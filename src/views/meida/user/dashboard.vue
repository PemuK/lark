<template>
  <div>
    <el-card class="card" style="margin-top: 20px">
      <template #header>未完成维护<span
          style="font-size: 10px;margin-left: 5px; color: #888d8f">(点击每行查看维护详细)</span></template>
      <el-table
          @row-click="handleRowClick"
          :show-header="false"
          :data="unMaintList"
          style="width: 100%">
        <el-table-column :show-overflow-tooltip="true" :width="137">
          <template #default="scope">
          <span>
            {{ scope.row.buildingName }}{{ scope.row.unit }}{{ scope.row.room }}
          </span>
          </template>
        </el-table-column>

        <el-table-column :show-overflow-tooltip="true" :width="120">
          <template #default="scope">
            <span>{{ scope.row.phoneNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true">
          <template #default="scope">
            <span style="font-weight: bold">{{ scope.row.clientName }}</span>
          </template>
        </el-table-column>
        <el-table-column>
          <template #default="scope">
            <span>{{ scope.row.maintDescription }}</span>
          </template>
        </el-table-column>
        <el-table-column>
          <template #default="scope">
            <span>{{ scope.row.locationDescription }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--  <el-card class="card">-->

    <!--  </el-card>-->
    <el-card class="card" style="margin-top: 10px">
      <template #header>维护量统计</template>
    </el-card>

    <!--维护详细展示框-->
    <el-dialog v-model="maintDetailVisible" title="维修信息详情" :width="350">
      <div class="dialog-content">
        <div class="dialog-item">
          <span class="label">地址：</span>
          <span class="value">{{ maintDetails.buildingName }}{{ maintDetails.unit }}{{ maintDetails.room }}</span>
        </div>
        <div class="dialog-item">
          <span class="label">电话：</span>
          <span class="value">{{ maintDetails.phoneNumber }}</span>
        </div>
        <div class="dialog-item">
          <span class="label">用户：</span>
          <span class="value">{{ maintDetails.clientName }}</span>
        </div>
        <div class="dialog-item">
          <span class="label">问题描述：</span>
          <span class="value">{{ maintDetails.maintDescription }}</span>
        </div>
        <div class="dialog-item">
          <span class="label">地址描述：</span>
          <span class="value">{{ maintDetails.locationDescription }}</span>
        </div>
        <div class="dialog-item">
          <span class="label">登记人：</span>
          <span class="value">{{ maintDetails.adderName }}</span>
        </div>
        <div class="dialog-item">
          <span class="label">登记时间：</span>
          <span class="value">{{ maintDetails.createTime }}</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {getUnFinishWhListApi, listMaintTypeByStatusApi,} from "../../../api/maint";
import {useRouter} from 'vue-router';
import {useUserStore} from "../../../stores/user";
import {listUserByStatusAndStateApi} from "../../../api/user";
import {getBuildingListApi} from "../../../api/building";
import {onMounted, ref} from "vue";

//路由
const router = useRouter();

//用户缓存
const user = useUserStore();
//维护数据
const maintPerson = ref();
const maintType = ref();
const unMaintList = ref();
const buildingList = ref();

//维护详细变量
const maintDetailVisible = ref(false);
const maintDetails = ref();

onMounted(() => {
  getData();
})

const handleRowClick = (row: any, column: any, event: Event) => {
  maintDetailVisible.value = true;
  maintDetails.value = row;
}

//获取数据
const getData = () => {
  listUserByStatusAndStateApi(1, 1).then((res) => {
    if (res.data.code == 200) {
      maintPerson.value = res.data.data;
    }
  });
  listMaintTypeByStatusApi(1).then((res) => {
    if (res.data.code == 200) {
      maintType.value = res.data.data;
    }
  });
  getUnFinishWhListApi(1).then((res) => {
    if (res.data.code == 200) {
      unMaintList.value = res.data.data;
      localStorage.setItem("Whlist", JSON.stringify(res.data.list));
    }
  });

  getBuildingListApi(1).then((res) => {
    if (res.data.code == 200) {
      buildingList.value = res.data.data;
      localStorage.setItem("buildings", JSON.stringify(res.data.data));
    }
  });
};
</script>

<style scoped>
/* 为按钮添加一些基本样式 */
.logout-button {
  padding: 10px 20px;
  background-color: #409EFF;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.logout-button:hover {
  background-color: #66b1ff;
}

.card {
  width: 97%;
  margin: 0 auto;
}

::v-deep .el-card__header {
  padding: 10px;
  font-size: 15px;
}

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
</style>