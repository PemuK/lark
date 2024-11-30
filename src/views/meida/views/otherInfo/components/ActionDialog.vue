<template>
  <Transition>
    <el-form class="form" v-if="action === 0||action === 2">
      <div v-if="option=='1'">
        <el-form-item label="部门名称：">
          <el-input v-model="form.organizationName"></el-input>
        </el-form-item>
      </div>
      <div v-else-if="option=='2'">
        <el-form-item label="维护类型：">
          <el-input v-model="form.typeName"></el-input>
        </el-form-item>
        <el-form-item label="工作量：">
          <el-input v-model="form.workAmount"></el-input>
        </el-form-item>
      </div>
      <div v-else-if="option=='4'">
        <el-form-item label="建筑名称">
          <el-input
              v-model="form.buildingName"
              placeholder="请输入建筑名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="form.type" placeholder="请选择类型">
            <el-option label="办公楼" :value="0"></el-option>
            <el-option label="职工楼" :value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="校区">
          <el-select v-model="form.campus" placeholder="请选择校区">
            <el-option label="西校区" :value="0"></el-option>
            <el-option label="东校区" :value="1"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <el-form-item>
        <div class="button-container">
          <el-button @click="cancel" class="del-button" size="small">
            取消
          </el-button>
          <el-button
              v-if="action === 0"
              :loading="isSubmitting"
              :disabled="isSubmitting"
              @click="handleEdit"
              class="modify-button"
              size="small"
              type="primary">
            提交
          </el-button>
          <el-button
              v-else
              :loading="isSubmitting"
              :disabled="isSubmitting"
              @click="handleAdd"
              class="modify-button"
              size="small"
              type="primary">
            添加
          </el-button>
        </div>
      </el-form-item>
    </el-form>
    <div v-else-if="action === 1" style="min-height: 70px;">
      <span>确定要删除该吗？</span><br/>
      <div class="button-container" style="margin-top: 20px;">
        <el-button @click="cancel" class="del-button" size="small">
          取消
        </el-button>
        <el-button
            :loading="isSubmitting"
            @click="handleDel"
            class="modify-button"
            size="small">
          确定
        </el-button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import {defineEmits, onBeforeMount, ref} from "vue";
import {
  addOrganizationApi,
  updateOrganizationNameApi,
  updateOrganizationStatusApi,
} from "../../../../../api/organization";
import {ElMessage} from "element-plus";
import {addMaintTypeApi, updateMaintTypeApi, updateMaintTypeStatusApi} from "../../../../../api/maint";
import {addBuildingApi, updateBuildingApi, updateBuildingStatusApi} from "../../../../../api/building";

const emit = defineEmits(["close"]);
const props = defineProps({
  info: Object,
  option: String,
  action: Number,
});

const action = ref<number | undefined>(props.action);
const form = ref(props.info || {});
const isSubmitting = ref(false);

const cancel = () => {
  form.value = {};
  emit("close", true);
};

const handleAdd = () => {
  if (props.option === '1') {
    isSubmitting.value = true;
    addOrganizationApi(
        form.value.organizationName
    ).then(res => {
      if (res.data.code === 200) {
        ElMessage.success("添加成功");
        cancel();
      }
    })
  } else if (props.option === '2') {
    isSubmitting.value = false;
    addMaintTypeApi(form.value.typeName, form.value.workAmount).then(res => {
      if (res.data.code === 200) {
        ElMessage.success("修改成功");
        cancel();
      }
    })
  } else if (props.option === '4') {
    isSubmitting.value = true;
    addBuildingApi(form.value.buildingName, form.value.type, form.value.campus).then(res => {
      if (res.data.code === 200) {
        ElMessage.success("修改成功");
        cancel();
      }
    })
  }
}

const handleEdit = () => {
  if (props.option === '1') {
    isSubmitting.value = true;
    updateOrganizationNameApi(
        form.value.id,
        form.value.organizationName
    ).then(res => {
      if (res.data.code === 200) {
        ElMessage.success("修改成功");
        cancel();
      }
    })
  } else if (props.option === '2') {
    isSubmitting.value = false;
    updateMaintTypeApi(form.value.id, form.value.typeName, form.value.workAmount).then(res => {
      if (res.data.code === 200) {
        ElMessage.success("修改成功");
        cancel();
      }
    })
  } else if (props.option === '4') {
    isSubmitting.value = true;
    updateBuildingApi(form.value.id, form.value.buildingName, form.value.type, form.value.campus).then(res => {
      if (res.data.code === 200) {
        ElMessage.success("修改成功");
        cancel();
      }
    })
  }
};

const handleDel = () => {
  if (props.option === '1') {
    isSubmitting.value = true;
    updateOrganizationStatusApi(form.value.id, 0).then(res => {
      if (res.data.code === 200) {
        ElMessage.success("删除成功");
        cancel();
      }
      isSubmitting.value = false;
    })
  } else if (props.option === '2') {
    isSubmitting.value = true;
    updateMaintTypeStatusApi(form.value.id, 0).then(res => {
      if (res.data.code === 200) {
        ElMessage.success("删除成功");
        cancel();
      }
      isSubmitting.value = false;
    })
  } else if (props.option === '4') {
    isSubmitting.value = true;
    updateBuildingStatusApi(form.value.id, 0).then(res => {
      if (res.data.code === 200) {
        ElMessage.success("删除成功");
        cancel();
      }
      isSubmitting.value = false;
    })
  }
};

onBeforeMount(() => {
  if (props.info && props.option) {
    action.value = props.action;
    form.value = {...props.info};
    if (props.action === 2) {
      form.value = {}
    }
  }
});

</script>

<style scoped>
.form {
  margin-top: 10px;
}

.modify-button {
  background-color: #242f42;
  padding: 15px;
  color: white;
}

.del-button {
  background-color: transparent;
  padding: 15px;
  color: black;
}

.button-container {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
