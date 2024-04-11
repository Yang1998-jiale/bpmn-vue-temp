/*
 * @Author: yjl
 * @Date: 2024-04-10 14:51:51
 * @LastEditors: yjl
 * @LastEditTime: 2024-04-11 16:07:14
 * @Description: 描述
 */
declare module "*.vue" {
  import { ComponentOptions } from "vue";
  const componentOptions: ComponentOptions;
  export default componentOptions;
}

declare module "bpmn-vue-temp" {
  const bpmnVue: any;
  export default bpmnVue;
}


// palette-provider.d.ts
declare module './bpnm-utils/palette-provider.js' {
  // 在这里提供模块导出的类型声明
  export function someFunction(): void;
}