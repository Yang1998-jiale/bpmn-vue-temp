/*
 * @Author: yjl
 * @Date: 2024-04-08 17:26:09
 * @LastEditors: yjl
 * @LastEditTime: 2024-04-08 17:39:12
 * @Description: 描述
 */
import A from "./src/a.vue";

A.name = "A";

A.install = (Vue: any) => {
  Vue.component("A", A);
};

export default A
