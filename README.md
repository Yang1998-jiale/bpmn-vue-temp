# bpmnjs+Vue3

这是基于 bpmnjs 和 vue3 的组件,实现流程图绘制和流程图解析功能

# 使用方法

```javascript
npm i bpmn-vue-temp -save
```

## 全局引入

```javascript
import { createApp } from "vue";
import App from "./App.vue";
//引入样式
import "bpmn-vue-temp/lib/style.css";
//引入组件
import BpmnVueTemp from "bpmn-vue-temp";
//全局引入
createApp(App).use(BpmnVueTemp).mount("#app");
```

## 按需引入

### 1.组件方式

```javascript
import { ref } from "vue";
import { BpmnVue } from "bpmn-vue-temp";
let bpmnRef = ref();

<template>
  <div class="box" id="bpmn">
    <Bpmn-Vue :bpmnID="'test'" ref="bpmnRef" @select:element="selectElement" />
  </div>
</template>

```

### 2.自定义方式

```javascript
import { useBpmn } from "bpmn-vue-temp";

let bpmn = useBpmn();
bpmn.initModeler({
  container: document.getElementById("bpmn"),
  additionalModules:{},
  moddleExtensions:{}
});
```

# 组件参数

```javascript
/*
 * bpmnID :string 画布ID
 * isReadOnly :boolben 是否开启只读
 * options : object 自定义配置
 * operation : array 自定义操作,是一个操作数组,包含{label,icon,action}对象,目前自带有['导出XML','导入XML','导出SVG','放大','缩小','重置']
 * */
```

## 组件对象和事件

```javascript
import { ref } from "vue";
import { BpmnVue } from "bpmn-vue-temp";
let bpmnRef = ref();
//通过ref获取可以获得当前画布的事件对象

function selectElement(info) {
  //info中包含了businessObject:节点存储的业务对象,shapeType:节点类型
  console.log(info);
}

<template>
  <div class="box" id="bpmn">
    <Bpmn-Vue bpmnID="test" ref="bpmnRef" @select:element="selectElement" />
  </div>
</template>
```

# API

```javascript
/**
 * options:{
 *   container:画布节点 选择器或dom元素
 *   additionalModules:{} 个性化配置
 *   moddleExtensions:{} 扩展moddle
 * }
 */
initModeler(options);

//获取图中所有节点
getShapeAll()
//根据节点id获取节点对象
getShapeById(id: any)

//获取xml数据
getXML()

//更新节点数据
updateProperties(element: ModdleElement, properties: PropertiesMap<any>)
//例子
function textareaChange() {
    const moddle = state.bpmnStore.getModdle();
    let conditionExpression = moddle.create('bpmn:FormalExpression', {
      body: '哈哈哈',
    });
    state.bpmnStore.updateProperties(toRaw(state.bpmnStore.getActiveElement().element), {
      conditionExpression,
    });
}

//导入xml生成数据
importXML(string: string)

//导出xml
exportXML()

//导出SVG
exportSVG()

//重置数据
resetData()
```
