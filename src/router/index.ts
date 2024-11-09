import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import { usePermissStore } from '../stores/permiss';
import { useUserStore } from '../stores/user';
import Home from '../views/home.vue';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/dashboard',
    },
    {
        path: '/',
        name: 'Home',
        component: Home,
        children: [
            {
                path: '/dashboard',
                name: 'dashboard',
                meta: {
                    title: '系统首页',
                    permiss: '1',
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/dashboard.vue'),
            },
            {
                path: '/maint-statistics',
                name: 'maint-statistics',
                meta: {
                    title: '维护量统计',
                    permiss: '2',
                },
                component: () => import(/* webpackChunkName: "form" */ '../views/maint-statistics.vue'),
            },
            {
                path: '/user',
                name: 'user',
                meta: {
                    title: '个人中心',
                },
                component: () => import(/* webpackChunkName: "user" */ '../views/user.vue'),
            },
            {
                path: '/user-controller',
                name: 'controller',
                meta: {
                    title: "用户管理",
                    permiss: '5',
                },
                component: () => import('../views/user-controller.vue'),
            },
            {
                path: '/info-manage',
                name: 'info',
                meta: {
                    title: "信息管理",
                    permiss: '6',
                },
                component: () => import('../views/info-manage.vue'),
            },
            {
                path: '/table-finished',
                name: 'table-finished',
                meta: {
                    title: '已完成维护',
                    permiss: '2',
                },
                component: () => import(/* webpackChunkName: "table" */ '../views/table-finished.vue'),
            },
            // {
            //     path: '/charts',
            //     name: 'basecharts',
            //     meta: {
            //         title: '图表',
            //         permiss: '11',
            //     },
            //     component: () => import(/* webpackChunkName: "charts" */ '../views/charts.vue'),
            // },
            // {
            //     path: '/form',
            //     name: 'baseform',
            //     meta: {
            //         title: '表单',
            //         permiss: '5',
            //     },
            //     component: () => import(/* webpackChunkName: "form" */ '../views/form.vue'),
            // },
            // {
            //     path: '/maint-type',
            //     name: 'maint-type',
            //     meta: {
            //         title: '维护类型',
            //         permiss: '5',
            //     },
            //     component: () => import(/* webpackChunkName: "form" */ '../views/maint-type.vue'),
            // },
            // {
            //     path: '/maint-information',
            //     name: 'maint-information',
            //     meta: {
            //         title: '维护信息管理',
            //         permiss: '3',
            //     },
            //     component: () => import(/* webpackChunkName: "form" */ '../views/maint-information.vue'),
            // },
            // {
            //     path: '/tabs',
            //     name: 'tabs',
            //     meta: {
            //         title: 'tab标签',
            //         permiss: '3',
            //     },
            //     component: () => import(/* webpackChunkName: "tabs" */ '../views/tabs.vue'),
            // },
            // {
            //     path: '/donate',
            //     name: 'donate',
            //     meta: {
            //         title: '鼓励作者',
            //         permiss: '14',
            //     },
            //     component: () => import(/* webpackChunkName: "donate" */ '../views/donate.vue'),
            // },
            // {
            //     path: '/permission',
            //     name: 'permission',
            //     meta: {
            //         title: '权限管理',
            //         permiss: '13',
            //     },
            //     component: () => import(/* webpackChunkName: "permission" */ '../views/permission.vue'),
            // },
            // {
            //     path: '/upload',
            //     name: 'upload',
            //     meta: {
            //         title: '上传插件',
            //         permiss: '6',
            //     },
            //     component: () => import(/* webpackChunkName: "upload" */ '../views/upload.vue'),
            // },
            // {
            //     path: '/icon',
            //     name: 'icon',
            //     meta: {
            //         title: '自定义图标',
            //         permiss: '10',
            //     },
            //     component: () => import(/* webpackChunkName: "icon" */ '../views/icon.vue'),
            // },
            // {
            //     path: '/editor',
            //     name: 'editor',
            //     meta: {
            //         title: '富文本编辑器',
            //         permiss: '8',
            //     },
            //     component: () => import(/* webpackChunkName: "editor" */ '../views/editor.vue'),
            // },
            // {
            //     path: '/markdown',
            //     name: 'markdown',
            //     meta: {
            //         title: 'markdown编辑器',
            //         permiss: '9',
            //     },
            //     component: () => import(/* webpackChunkName: "markdown" */ '../views/markdown.vue'),
            // },
            // {
            //     path: '/export',
            //     name: 'export',
            //     meta: {
            //         title: '导出Excel',
            //         permiss: '2',
            //     },
            //     component: () => import(/* webpackChunkName: "export" */ '../views/export.vue'),
            // },
            // {
            //     path: '/import',
            //     name: 'import',
            //     meta: {
            //         title: '导入Excel',
            //         permiss: '2',
            //     },
            //     component: () => import(/* webpackChunkName: "import" */ '../views/import.vue'),
            // },

        ],
    },
    {
        path: '/login',
        name: 'Login',
        meta: {
            title: '登录',
        },
        component: () => import(/* webpackChunkName: "login" */ '../views/login.vue'),
    },
    {
        path: '/403',
        name: '403',
        meta: {
            title: '没有权限',
        },
        component: () => import(/* webpackChunkName: "403" */ '../views/403.vue'),
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.beforeEach((to: any, from: any, next: any) => {
    // Set the page title
    document.title = `${to.meta.title || '默认标题'} | 济南大学MSU`;

    const user = useUserStore();
    user.restoreUser();
    const role = user.id; // Assume this is the user's role or ID.

    // Prevent logged-in users from accessing the login page
    if (role && to.path === '/login') {
        return next('/dashboard'); // Redirect to dashboard or home if logged in
    }

    // If not logged in and not accessing the login page, redirect to login
    if (!role && to.path !== '/login') {
        return next('/login');
    }

    // Permissions check
    if (to.meta.permiss) {
        const permissStore = usePermissStore();
        const requiredPermiss = to.meta.permiss;
        if (!permissStore.key.includes(requiredPermiss)) {
            return next('/403'); // Redirect to 403 if permissions are insufficient
        }
    }

    // Continue if all checks pass
    next();
});




export default router;
