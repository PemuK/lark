<template>
  <Transition name="run" appear>
    <div id="page" v-if="!change">
      <el-card class="card" style="margin-top: 20px;height: 270px;  margin-bottom: 5px">
        <template #header>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              未完成维护
              <span style="font-size: 10px; margin-left: 5px; color: #888d8f;">
              (点击每行查看维护详细)
            </span>
            </div>
            <span style="cursor: pointer; color: #2c2c2c; font-size: small" @click="addMaint">添加</span>
          </div>
        </template>

        <MaintTable  style="width: 100%;" />
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
    <div v-else>
        <AddMaint @change="addMaint"/>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import Statistics from "../../../components/statistics.vue";
import WorkAmount from "../components/statics/workAmount.vue";
import MaintTable from "../components/statics/maintTable.vue";
import AddMaint from "../components/action/addMaint.vue";
import {useRouter} from 'vue-router';
import {useUserStore} from "../../../stores/user";
import {formatDateToISO} from "../../../utils/formatDateToIS0";
import {ref} from "vue";

//切换
const change = ref(false);

//路由
const router = useRouter();

//用户缓存
const user = useUserStore();

//获取当前时间
let nowTime = new Date();
const month = ref(formatDateToISO(nowTime));

//更新排名数据
const monthAmountSearch = (msg: string) => {
  console.log("msg-form-child==>", msg);
  month.value = msg;
}

const updateTime = (msg: any) => {
  nowTime = msg;
}

const addMaint = () => {
  change.value = !change.value;
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