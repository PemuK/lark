<template>
  <el-card class="card" style="margin-top: 20px">
    <template #header>未完成维护<span
        style="font-size: 10px;margin-left: 5px; color: #888d8f">(点击每行查看维护详细)</span></template>
    <el-table :show-header="false" :data="unMaintList" style="width: 100%">
      <el-table-column :show-overflow-tooltip="true" :width="137">
        <template #default="scope" >
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
//维护员数据
const maintPerson = ref();
const maintType = ref();
const unMaintList = ref();
const buildingList = ref();

onMounted(() => {
  getData();
})

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
</style>