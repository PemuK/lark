<template>
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
  <!--维护详细展示框-->
  <el-dialog
      v-model="maintDetailVisible"
      :title="maintDetailTitle"
      :width="350"
      @close="dialogClose"
  >
    <div v-if="change">
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
      <!-- 按钮容器 -->
      <div class="dialog-footer">
        <el-button @click="deleteMaint">删除</el-button>
        <el-button type="primary" @click="openReport">填报</el-button>
        <el-button type="success" @click="editMaint">修改</el-button>
      </div>
    </div>
    <div v-else>
      <el-form label-width="70px">
        <el-form-item label="参与人员">
          <el-checkbox-group v-model="report.persons">
            <el-checkbox
                v-for="person in maintPerson"
                :key="person.id"
                :label="person.id"
                :value="person.id"
                size="small"
            >
              {{ person.name }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="维护类型">
          <el-select v-model="report.maintType" placeholder="请选择类型" size="small">
            <el-option
                v-for="type in maintType"
                :key="type.id"
                :label="type.typeName"
                :value="type.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="解决方案">
          <el-input type="textarea" v-model="report.note"></el-input>
        </el-form-item>
      </el-form>
      <div class="report-footer">
        <el-button @click="change=true">返回</el-button>
        <el-button type="primary" @click="saveReport">提交</el-button>
      </div>

    </div>
  </el-dialog>
</template>

<script setup lang="ts">

import {getUnFinishWhListApi, listMaintTypeByStatusApi,reportMaintApi} from "../../../../api/maint";
import {useRouter} from 'vue-router';
import {useUserStore} from "../../../../stores/user";
import {listUserByStatusAndStateApi} from "../../../../api/user";
import {getBuildingListApi} from "../../../../api/building";
import {onMounted, ref} from "vue";
import {ElMessage} from "element-plus";

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
const maintDetailTitle=ref("维修信息详情");

//填报维护相关变量
const report = ref({
  persons: [] as number[], // 参与人员的 ID 列表
  maintType: null as number | null, // 维护类型 ID
  note: "" // 解决方案描述
});

//表单切换
const change = ref(true);


const month = ref();


onMounted(() => {
  getData();
})

//table点击行打开dialog
const handleRowClick = (row: any, column: any, event: Event) => {
  maintDetailVisible.value = true;
  maintDetails.value = row;
}

//dialog相关
const openReport = () => {
  change.value = false;
  maintDetailTitle.value="填报"
}

const dialogClose = () => {
  maintDetailVisible.value = false;
  maintDetailTitle.value="维修信息详情";
}

const saveReport=()=>{
  if(!report.value.persons.length || !report.value.maintType||!report.value.note.trim()){
    ElMessage.warning("填报的信息不完整");
    return;
  }
  reportMaintApi(maintDetails.value.id,user.id,String(report.value.persons),report.value.maintType,report.value.note)
  .then(res => {
    if (res.data.code == 200) {
      ElMessage.success("填报成功");
      dialogClose();
      getData();
    }
  })
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
.report-footer{
  text-align: right; /* 使按钮居中 */
  margin-top: 20px; /* 根据需要调整上边距 */
}
</style>s