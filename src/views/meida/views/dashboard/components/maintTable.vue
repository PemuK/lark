<template>
  <el-table
      @row-click="handleRowClick"
      :show-header="false"
      :data="unMaintList"
      style="width: 100%;  height: 198px; overflow-y: auto;">
    <template #empty>
      <p>本月还没有维护</p>
    </template>
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
    <div v-if="change==1">
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
        <el-button type="success" @click="openEdit(maintDetails.id)">修改</el-button>
      </div>
    </div>
    <div v-else-if="change==2">
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
        <el-button @click="change=1">返回</el-button>
        <el-button type="primary" @click="saveReport">提交</el-button>
      </div>
    </div>
    <div v-else-if="change==3">
      <el-form label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="所在楼">
          <select
              id="building"
              class="modify-input"
              v-model="form.building"
              placeholder="选择所在楼"
          >
            <option value="" disabled selected>选择所在楼</option>
            <option v-for="building in buildingList" :key="building.id" :value="building.id">
              {{ building.buildingName }}
            </option>
          </select>
        </el-form-item>
        <el-form-item label="单元号">
          <el-input v-model="form.unit" placeholder="若无请忽略"></el-input>
        </el-form-item>
        <el-form-item label="房间号">
          <el-input v-model="form.room"></el-input>
        </el-form-item>
        <el-form-item label="问题描述">
          <el-input type="textarea" v-model="form.issue"></el-input>
        </el-form-item>
        <el-form-item label="地点描述">
          <el-input type="textarea" v-model="form.location"></el-input>
        </el-form-item>
      </el-form>
      <div class="report-footer">
        <el-button @click="change=1">返回</el-button>
        <el-button type="primary" @click="saveEdit">提交</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">

import {
  getUnFinishWhListApi,
  listMaintTypeByStatusApi,
  reportMaintApi,
  updateMaintRecordApi,
  updateMaintStateApi
} from "../../../../../api/maint";
import {useRouter} from 'vue-router';
import {useUserStore} from "../../../../../stores/user";
import {listUserByStatusAndStateApi} from "../../../../../api/user";
import {getBuildingListApi} from "../../../../../api/building";
import {defineEmits, onMounted, reactive, ref} from "vue";
import {ElMessage} from "element-plus";

//路由
const router = useRouter();

const emit = defineEmits(["update"])

//用户缓存
const user = useUserStore();
//维护数据
const maintPerson = ref();
const maintType = ref();
const unMaintList = ref([]);
const buildingList = ref();

//维护详细变量
const maintDetailVisible = ref(false);
const maintDetails = ref();
const maintDetailTitle = ref("维修信息详情");

//填报维护相关变量
const report = ref({
  persons: [] as number[], // 参与人员的 ID 列表
  maintType: null as number | null, // 维护类型 ID
  note: "" // 解决方案描述
});

//修改维护的表单
const form = reactive<any>({
  id: "",
  name: "",
  phone: "",
  building: "",
  unit: "",
  room: "",
  issue: "",
  location: "",
});

//表单切换
const change = ref(1);


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
  change.value = 2;
  maintDetailTitle.value = "填报"
}

const openEdit = (id) => {
  change.value = 3;
  maintDetailTitle.value = "修改";
  const item = unMaintList.value.find((item) => item.id === id);
  if (item) {
    form.id = item.id;
    form.clientId = item.clientId;
    form.name = item.clientName;
    form.phone = item.phoneNumber;
    form.building = item.buildingId;
    form.unit = item.unit;
    form.room = item.room;
    form.issue = item.maintDescription;
    form.location = item.locationDescription;
  }
};

const deleteMaint = () => {
  updateMaintStateApi(maintDetails.value.id, 0).then((res) => {
    if (res.data.code == 200) {
      ElMessage.success("删除成功");
      dialogClose();
      getData();
    }
  })
}

const dialogClose = () => {
  change.value = 1;
  maintDetailVisible.value = false;
  maintDetailTitle.value = "维修信息详情";
}


const saveReport = () => {
  if (!report.value.persons.length || !report.value.maintType || !report.value.note.trim()) {
    ElMessage.warning("填报的信息不完整");
    return;
  }
  reportMaintApi(maintDetails.value.id, user.id, String(report.value.persons), report.value.maintType, report.value.note)
      .then(res => {
        if (res.data.code == 200) {
          ElMessage.success("填报成功");
          dialogClose();
          getData();
          emit("update", true)
          report.value.persons = [];
          report.value.maintType = null;
          report.value.note = null;
        }
      })
}

const saveEdit = () => {
  updateMaintRecordApi(
      user.id,
      form.id, // maintRecordId
      form.clientId,
      form.name, // clientName
      form.phone, // phoneNumber
      form.building, // buildingId
      form.unit, // unit
      form.room, // room
      form.issue, // maintDescription
      form.location // locationDescription
  ).then((res) => {

    if (res.data.code == 200) {
      ElMessage.success("修改成功");
      dialogClose();
      getData();
    }

  });
};

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