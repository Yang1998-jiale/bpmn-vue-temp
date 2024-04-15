/*
 * @Author: yjl
 * @Date: 2024-04-08 17:00:14
 * @LastEditors: yjl
 * @LastEditTime: 2024-04-15 16:32:35
 * @Description: 描述
 */
import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
// import Packages from "../packages";
// @ts-ignore

import "bpmn-vue-temp/lib/style.css";
import BpmnVueTemp from "../lib/index.js";

createApp(App).use(BpmnVueTemp).mount("#app");
