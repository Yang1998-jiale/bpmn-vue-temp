/*
 * @Author: yjl
 * @Date: 2024-04-10 13:24:10
 * @LastEditors: yjl
 * @LastEditTime: 2024-04-10 13:38:59
 * @Description: 描述
 */
import { BPMN as BpmnObj } from "./src/bpmn.ts";
import BpmnVue from "./src/index.vue";

export function useBpmn() {
  return new BpmnObj();
}

BpmnVue.name = "Bpmn-Vue";

BpmnVue.install = function (app: any) {
  app.component(BpmnVue.name, BpmnVue);
};

export default BpmnVue;
