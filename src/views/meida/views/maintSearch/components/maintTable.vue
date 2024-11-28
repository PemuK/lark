<script setup lang="ts">

</script>

<template>
  <div class="filter-section">
    <el-input
        v-if=" option!== '5'"
        v-model="searchInput"
        :placeholder="getPlaceholder()"
        style="width: 250px; margin-right: 10px;"
    ></el-input>

    <!-- Multi-select input for 'participant' -->
    <el-select
        v-else
        v-model="searchInput"
        placeholder="请选择维护类型"
        class="handle-input mr10"
    >
      <el-option
          v-for="person in maintType"
          :key="person.id"
          :label="person.typeName"
          :value="person.id"
      ></el-option>
    </el-select>
    <button class="button" @click="onSearch">查询</button>
    <button class="button-reset" @click="onReset">重置</button>
  </div>

  <el-table v-loading="tableLoading" :data="tableData" style="margin-top: 20px;" @row-click="onRowClick">
    <el-table-column label="地址" width="90px">
      <template #default="scope">
        {{ scope.row.buildingName }}{{ scope.row.unit }}{{ scope.row.room }}
      </template>
    </el-table-column>
    <el-table-column
        prop="phoneNumber"
        label="联系电话"
        width="112px"
    ></el-table-column>
    <el-table-column prop="clientName" label="用户名" width="80px"></el-table-column>
    <el-table-column prop="maintDescription" label="问题" :show-overflow-tooltip="true"></el-table-column>
    <el-table-column prop="createTime" label="登记时间" width="100px"></el-table-column>
    <el-table-column prop="finishTime" label="填报时间" width="100px"></el-table-column>
    <el-table-column prop="adderName" label="登记人" width="80px"></el-table-column>
    <el-table-column prop="note" width="90px" label="解决方法" :show-overflow-tooltip="true"></el-table-column>
    <el-table-column prop="reporterName" label="填报人" width="80px"></el-table-column>
    <el-table-column
        prop="completerName"
        label="参与者"
        width="200px"
        :show-overflow-tooltip="true"
    ></el-table-column>
    <el-table-column prop="maintTypeName" label="类型" width="60px"></el-table-column>
  </el-table>

  <div class="pagination-section">
    <el-pagination
        background
        layout="prev, pager, next"
        :total="page.totalItems"
        :current-page.sync="page.currentPage"
        :page-size="page.pageSize"
        :pager-count="5"
        @current-change="onPageChange"
    />
  </div>
</template>

<style scoped>

</style>