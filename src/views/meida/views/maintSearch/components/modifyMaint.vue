<template>
  <el-form label-width="70px">
    <el-form-item label="用户名">
      <el-input v-model="form.clientName"></el-input>
    </el-form-item>
    <el-form-item label="电话">
      <el-input v-model="form.phoneNumber"></el-input>
    </el-form-item>
    <el-form-item label="所在楼">
      <el-select
          id="building"
          class="modify-input"
          v-model="form.buildingId"
          placeholder="选择所在楼"
      >
        <el-option value="" disabled selected>选择所在楼</el-option>
        <el-option v-for="building in buildingList" :key="building.id" :label="building.buildingName"
                   :value="building.id">
          {{ building.buildingName }}
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="单元号">
      <el-input v-model="form.unit" placeholder="若无请忽略"></el-input>
    </el-form-item>
    <el-form-item label="房间号">
      <el-input v-model="form.room"></el-input>
    </el-form-item>
    <el-form-item label="问题描述">
      <el-input type="textarea" v-model="form.maintDescription"></el-input>
    </el-form-item>
    <el-form-item label="地点描述">
      <el-input type="textarea" v-model="form.locationDescription"></el-input>
    </el-form-item>
    <el-form-item label="参与人员">
      <el-select v-model="form.completer" multiple>
        <el-option
            v-for="person in maintPerson"
            :key="person.id"
            :label="person.name"
            :value="person.id"
            size="small"
        >
          {{ person.name }}
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="维护类型">
      <el-radio-group v-model="form.maintType">
        <el-radio
            v-for="type in maintType"
            :key="type.id"
            :label="type.typeName"
            :value="type.id"
            size="small"
        >
          {{ type.typeName }}
        </el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="解决方案">
      <el-input type="textarea" v-model="form.note"></el-input>
    </el-form-item>
    <el-form-item label="完成状态">
      <el-radio-group v-model="form.status">
        <el-radio
            v-for="status in statuses"
            :key="status.id"
            :label="status.id"
            :value="status.id"
            size="small"
        >
          {{ status.name }}
        </el-radio>
      </el-radio-group>
    </el-form-item>
  </el-form>
  <div class="report-footer">
    <el-button @click="dialogClose">返回</el-button>
    <el-button type="primary" @click="saveEdit">提交</el-button>
  </div>
</template>

<script setup lang="ts">
import {defineEmits, onBeforeMount, onMounted, ref, watch} from "vue";
import {useUserStore} from "../../../../../stores/user";
import {listMaintTypeByStatusApi, updateMaintRecordApi} from "../../../../../api/maint";
import {ElMessage} from "element-plus";
import {listUserByStatusAndStateApi} from "../../../../../api/user";
import {getBuildingListApi} from "../../../../../api/building";

const props = defineProps(["maintDetail"])
const emit = defineEmits(["close"])

onBeforeMount(() => {
  getData();
})

onMounted(() => {
  init();
})


const month = ref();
//用户缓存
const user = useUserStore();

//维护数据
let maintPerson = ref();
const maintType = ref();
const buildingList = ref();


const statuses = ref([
  {
    id: 1,
    name: "完成",
  },
  {
    id: 0,
    name: "未完成",
  },
]);
//修改维护的表单
let form = ref<any>({
  id: "",
  clientId: "",
  clientName: "",
  phone: "",
  buildingId: "",
  adderName: "",
  adderId: "",
  unit: "",
  room: "",
  maintType: "",
  maintTypeName: "",
  maintDescription: "",
  locationDescription: "",
  completer: "",
  note: "",
  status: 1
});

watch(form.completer, (newVal, oldVal) => {
  console.log("compeleter==>", newVal);
})


//获取数据
const getData = () => {
  listMaintTypeByStatusApi(1).then((res) => {
    if (res.data.code == 200) {
      maintType.value = res.data.data;

    }
  });
  getBuildingListApi(1).then((res) => {
    if (res.data.code == 200) {
      buildingList.value = res.data.data;
      localStorage.setItem("buildings", JSON.stringify(res.data.data));
    }
  });
  listUserByStatusAndStateApi(1, 1).then((res) => {
    if (res.data.code == 200) {
      maintPerson.value = res.data.data;
    }
  });
};

const init = () => {
  if (props.maintDetail && typeof props.maintDetail === 'object') {
    form.value = {...props.maintDetail}; // 创建一个副本以避免直接修改 props
    if (typeof form.value.completer === 'string') {
      form.value.completer = form.value.completer.split(",").map(item => parseInt(item, 10));
    } else {
      // 处理 completer 不是字符串的情况，例如设置为默认值或记录错误
      form.value.completer = [];
    }
  }
};

const saveEdit = () => {
  updateMaintRecordApi(
      user.id,
      form.value.id, // maintRecordId
      form.value.clientId,
      form.value.clientName, // clientName
      form.value.phoneNumber, // phoneNumber
      form.value.buildingId, // buildingId
      form.value.unit, // unit
      form.value.room, // room
      form.value.maintDescription, // maintDescription
      form.value.locationDescription, // locationDescription
      form.value.completer.join(","),
      form.value.maintType,
      form.value.note,
      form.value.status
  ).then((res) => {

    if (res.data.code == 200) {
      ElMessage.success("修改成功");
      dialogClose();
      getData();
    }

  });
};

const dialogClose = () => {
  emit("close", true);
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

.card {
  width: 95%;
  margin: 20px auto 0;
}

::v-deep .el-input__wrapper:hover {
  border-color: #242f42;
}

::v-deep .el-input__wrapper:hover {
  box-shadow: 0px 0px 2px #242f42;
}

::v-deep .el-input__wrapper .is_focus {
  box-shadow: 0px 0px 2px #242f42;
}

::v-deep .el-input {
  --el-input-focus-border-color: #242f42;
}
</style>