import { createApp } from 'vue';
import { createPinia } from 'pinia';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import App from './App.vue';
import router from './router';
import { usePermissStore } from './stores/permiss';
import 'element-plus/dist/index.css';
import './assets/css/icon.css';
import { ElLoading } from 'element-plus';
import Particles from 'particles.vue3'


// 创建 Pinia 实例
const pinia = createPinia();

// 创建 Vue 应用实例
const app = createApp(App);

// 使用 Pinia 实例
app.use(pinia);

// 使用路由
app.use(router);

//特效
app.use(Particles);

// 注册 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}

// 注册全局加载指令
app.directive('loading', ElLoading.directive);

// 自定义权限指令
const permiss = usePermissStore();
app.directive('permiss', {
    mounted(el, binding) {
        if (!permiss.key.includes(String(binding.value))) {
            el['hidden'] = true;
        }
    },
});

// 挂载应用
app.mount('#app');