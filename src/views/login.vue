<template>
  <div>
    <Particles id="tsparticles" :particlesInit="particlesInit" :particlesLoaded="particlesLoaded" :options="options" />
    <div class="login-wrap">
      <div class="ms-login">
        <div class="ms-title">济南大学MSU</div>
        <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
          <el-form-item prop="username">
            <el-input v-model="param.username" placeholder="username">
              <template #prepend>
                <el-button :icon="User"></el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" placeholder="password" v-model="param.password" @keyup.enter="submitForm(login)">
              <template #prepend>
                <el-button :icon="Lock"></el-button>
              </template>
            </el-input>
          </el-form-item>
          <div class="login-btn">
            <el-button class="button" type="primary" @click="submitForm(login)">登录</el-button>
          </div>
          <!-- <p class="login-tips">Tips : 本系统目前为演示系统</p> -->
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useTagsStore } from "../stores/tags";
import { useUserStore } from "../stores/user";
import { usePermissStore } from "../stores/permiss";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import { Lock, User } from "@element-plus/icons-vue";
import { LoginInfo } from "../types/login";
import { loginApi } from "../api";
import { loadFull } from "tsparticles";
import MD5 from "crypto-js/md5"; // 引入 MD5 库

const router = useRouter();
const route = useRoute();
const user = useUserStore();
const permiss = usePermissStore();
const tags = useTagsStore();

const param = reactive<LoginInfo>({
  username: "",
  password: "",
});

const particlesInit = async (engine: any) => {
  await loadFull(engine);
};

const particlesLoaded = async (container: any) => {
  console.log("Particles container loaded", container);
};

const options = reactive({
  background: {
    color: { value: "#white" }, // 粒子背景颜色
  },
  fpsLimit: 60, // 每秒帧数限制
  interactivity: {
    events: {
      onClick: { enable: true, mode: "push" }, // 点击事件：启用并设置为“推送”模式
      onHover: { enable: true, mode: "grab" }, // 悬停事件：启用并设置为“抓取”模式
      resize: true, // 启用窗口调整大小事件
    },
    modes: {
      bubble: {
        distance: 400, // 气泡效果的触发距离
        duration: 2, // 气泡效果持续时间
        opacity: 0.8, // 气泡效果透明度
        size: 40, // 气泡大小
      },
      push: { quantity: 4 }, // “推送”模式中每次点击生成的粒子数量
      repulse: {
        distance: 200, // 反弹效果的触发距离
        duration: 0.4, // 反弹效果持续时间
      },
    },
  },
  particles: {
    color: { value: "808080" }, // 粒子颜色
    links: {
      color: "#808080", // 线条颜色
      distance: 200, // 线条长度
      enable: true, // 是否启用线条连接
      opacity: 0.4, // 线条透明度
      width: 0.5, // 线条宽度
    },
    collisions: { enable: true }, // 是否启用粒子间碰撞
    move: {
      direction: "none", // 粒子移动方向
      enable: true, // 启用粒子移动
      outMode: "bounce", // 粒子超出边界时的行为
      random: false, // 粒子移动是否随机
      speed: 3, // 粒子运动速度
      straight: false, // 粒子是否沿直线移动
    },
    number: {
      density: { enable: true, area: 800 }, // 粒子密度设置，区域为800
      value: 60, // 粒子数量
      max: 120, // 粒子数量上限
    },
    opacity: { value: 0.9 }, // 粒子透明度
    shape: { type: "circle" }, // 粒子形状类型
    size: {
      random: true, // 粒子大小是否随机
      value: 2, // 粒子基础大小
    },
  },
  detectRetina: true, // 启用视网膜显示器支持
});

onMounted(() => {
  if (route.query.out === "true") {
    ElMessage({
      message: "会话过期，请重新登录",
      type: "warning", // You can also use "error" based on your preference
      duration: 3000, // The time in milliseconds the message stays on screen
    });
  }
});

const rules: FormRules = {
  username: [
    {
      required: true,
      message: "请输入用户名",
      trigger: "blur",
    },
  ],
  password: [
    {
      required: true,
      message: "请输入密码",
      trigger: "blur",
    },
  ],
};

const login = ref<FormInstance>();

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;

  formEl.validate((valid: boolean) => {
    if (valid) {
      // 对密码进行 MD5 加密
      const encryptedPassword = MD5(param.password).toString();

      // 使用加密后的密码进行登录
      loginApi(param.username, encryptedPassword).then((res) => {
        if (res.data.code === 200) {
          ElMessage.success("登录成功");
          user.toLogin(res.data.data);
          localStorage.setItem("user_info", JSON.stringify(res.data.data));
          localStorage.setItem("ms_username", res.data.data.username);
          localStorage.setItem("user_id", res.data.data.id);

          const status = res.data.data.status;
          const role = status === 3 ? "admin" : status === 2 ? "maint" : "user";
          const keys = permiss.defaultList[role];

          permiss.handleSet(keys);
          console.log(keys);
          localStorage.setItem("ms_keys", JSON.stringify(keys));

          setTimeout(() => {
            router.push("/");
          }, 1000);
        }
      });
    }
  });
};

tags.clearTags();
</script>

<style scoped>
.login-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.ms-login {
  width: 360px;
  padding: 40px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.ms-title {
  user-select: none;
  font-size: 24px;
  color: #333;
  text-align: center;
  margin-bottom: 30px;
}

.ms-content {
  display: flex;
  flex-direction: column;
}

.el-form-item {
  margin-bottom: 20px;
}

.el-input .el-button {
  background: none;
  border: none;
}

.el-input input {
  padding-left: 40px;
}

.login-btn {
  text-align: center;
  margin-top: 20px;
}

.login-btn .el-button {
  width: 100%;
}

.button {
  background-color: #696969;
  /* 默认颜色 */
  color: white;
  /* 按钮文字颜色 */
  border: none;
  /* 移除边框 */
  padding: 10px 20px;
  /* 按钮内边距 */
  cursor: pointer;
  /* 鼠标悬停时的手型光标 */
}

.button:active {
  background-color: #505050;
  /* 按钮被点击时颜色变深 */
}


/* ---- reset ---- */

body {
  margin: 0;
  font: normal 75% Arial, Helvetica, sans-serif;
}

canvas {
  display: block;
  vertical-align: bottom;
}

@media (max-width: 768px) {
  .ms-title {
    user-select: none;
    font-size: 20px;
    color: #333;
    text-align: center;
    margin-bottom: 30px;
  }

  .ms-login {
    width: 270px;
    padding: 25px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }
}
</style>
