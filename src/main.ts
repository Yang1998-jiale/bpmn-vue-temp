/*
 * @Author: yjl
 * @Date: 2024-04-08 17:00:14
 * @LastEditors: yjl
 * @LastEditTime: 2024-04-10 15:23:45
 * @Description: 描述
 */
import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
// import Packages from "../packages";
// @ts-ignore
import BpmnVue from "bpmn-vue-temp";
import "bpmn-vue-temp/lib/style.css";

createApp(App).use(BpmnVue).mount("#app");
