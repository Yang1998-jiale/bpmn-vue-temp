<!--
 * @Author: yjl
 * @Date: 2024-04-08 17:00:14
 * @LastEditors: yjl
 * @LastEditTime: 2024-04-10 14:50:38
 * @Description: 描述
-->
<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useBpmn } from "bpmn-vue-temp";
let bpmnStore = reactive(useBpmn());
let bpmnRef = ref();
onMounted(() => {
  console.log(bpmnStore);
  console.log(bpmnRef.value);
});
</script>

<template>
  <div class="box" id="bpmn">
    <Bpmn-Vue :bpmnID="'test'" ref="bpmnRef" />
  </div>
</template>

<style scoped>
.box {
  height: 100%;
  width: 100%;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
