<!--
 * @Author: yjl
 * @Date: 2024-04-08 17:00:14
 * @LastEditors: yjl
 * @LastEditTime: 2024-04-15 16:32:01
 * @Description: 描述
-->
<script setup lang="ts">
import { onMounted, ref } from "vue";
// import { BpmnVueTemp } from "../packages";
// import { BpmnVue } from "../packages";
let bpmnRef = ref();
onMounted(() => {
  console.log(bpmnRef.value);
});
function selectElement(info:any) {
  console.log(info);
  
}
</script>

<template>
  <div class="box" id="bpmn">
    <Bpmn-Vue :bpmnID="'test'" ref="bpmnRef" @select:element="selectElement" />
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
