/*
 * @Author: yjl
 * @Date: 2024-04-08 17:20:25
 * @LastEditors: yjl
 * @LastEditTime: 2024-04-11 16:55:10
 * @Description: 描述
 */
// import "ant-design-vue/dist/antd.css";
import BpmnVue, { useBpmn } from "./Bpmn/index.ts";
import "./iconfont.js"

// const components = newMap;
const components = [BpmnVue];
// 用于按需导入
export { BpmnVue, useBpmn };

// 定义 install 方法
const install = function (Vue: any) {
  if ((install as any).installed) return;
  (install as any).installed = true; // 遍历并注册全局组件
  components.map((component: any) => {
    Vue.component(component.name, component);
  });
};
if (typeof window !== "undefined" && (window as any).Vue) {
  install((window as any).Vue);
}

export default {
  // 导出的对象必须具备一个 install 方法
  install,
};
