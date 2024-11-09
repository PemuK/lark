<template>
  <div class="timeline-wrapper">
    <el-button type="primary" @click="toggleTimeline">
      {{ showTimeline ? "收起时间线" : "展开时间线" }}
    </el-button>

    <el-timeline v-if="showTimeline" class="timeline">
      <el-timeline-item
        v-for="(event, index) in timelineEvents"
        :key="index"
        :timestamp="event.date"
        :icon="event.icon"
        :color="event.color"
      >
        <div class="timeline-header">
          <span>{{ event.title }}</span>
        </div>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";

const showTimeline = ref(true);

const timelineEvents = reactive<any[]>([]);

const toggleTimeline = () => {
  showTimeline.value = !showTimeline.value;
};
</script>

<style scoped>
.timeline-wrapper {
  padding: 20px;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
}

.timeline {
  margin-top: 20px;
}
</style>
