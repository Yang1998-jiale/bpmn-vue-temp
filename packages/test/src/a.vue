<!--
 * @Author: yjl
 * @Date: 2024-04-08 17:27:32
 * @LastEditors: yjl
 * @LastEditTime: 2024-04-09 16:52:44
 * @Description: 描述
-->
<template>
  <Button @click="clickFun" class="btn">点击一下</Button>
  <div class="btn">我是测试文件</div>
</template>
<script lang="ts" setup>
import { reactive, onMounted } from "vue";
import { Button } from "ant-design-vue";

let state = reactive<any>({
  message: "a.vue",
});
onMounted(() => {});

function clickFun() {
  console.log(state.message);
}
</script>
<style scoped lang="less">
.btn {
  background-color: red;
  color: #fff;
}
</style>
