<template>
  <div id="page">

    <el-card class="card" style="margin-top: 20px;height: 230px; margin-bottom: 5px">
      <template #header>未完成维护
        <span style="font-size: 10px;margin-left: 5px; color: #888d8f">
          (点击每行查看维护详细)
        </span>
      </template>
      <UnfinishMaint/>
    </el-card>

    <el-card class="card work-amount">
      <WorkAmount @month="monthAmountSearch" @time="updateTime"/>
    </el-card>

    <el-card class="card statistics">
      <template #header>
        <div class="clearfix">
              <span
              >{{ nowTime.getFullYear() }}年{{
                  nowTime.getMonth() + 1
                }}月工作量统计</span
              >
        </div>
      </template>
      <Statistics :month="month"/>
    </el-card>

  </div>
</template>

<script setup lang="ts">
import Statistics from "../../../components/statistics.vue";
import WorkAmount from "../components/statics/workAmount.vue";
import UnfinishMaint from "../components/statics/unfinishMaint.vue";
import {useRouter} from 'vue-router';
import {useUserStore} from "../../../stores/user";

import {ref} from "vue";

//路由
const router = useRouter();

//用户缓存
const user = useUserStore();

//获取当前时间
let nowTime = new Date();
const month = ref();

//更新排名数据
const monthAmountSearch = (msg: string) => {
  console.log("msg-form-child==>", msg);
  month.value = msg;
}

const updateTime = (msg: any) => {
  nowTime = msg;
}
</script>

<style scoped>
.card {
  width: 95%;
  margin: 0 auto;
}

::v-deep .el-card__header {
  padding: 10px;
  font-size: 15px;
}

::v-deep .statistics {
  margin-top: 5px;
  height: 320px;
}

.work-amount {
  background-color: #ffffff;
}
</style>