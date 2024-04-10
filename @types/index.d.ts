/*
 * @Author: yjl
 * @Date: 2024-04-10 14:51:51
 * @LastEditors: yjl
 * @LastEditTime: 2024-04-10 15:03:53
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
