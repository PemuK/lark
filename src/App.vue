<template>
  <section>
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <div :key="$route.path">
          <component :is="Component"></component>
        </div>
      </transition>
    </router-view>
  </section>
</template>

<script setup lang="ts"></script>
<style>
@import './assets/css/main.css';
@import './assets/css/color-dark.css';

</style>
