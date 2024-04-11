/*
 * @Author: yjl
 * @Date: 2023-09-27 16:33:28
 * @LastEditors: yjl
 * @Description: 描述
 */

import Modeler from "bpmn-js/lib/Modeler";
import { ModdleElement, PropertiesMap } from "./bpmn-type";
import { nextTick, toRaw } from "vue";

const EVENT_TYPE = ["element.click", "shape.added", "element.changed"];

export class BPMN {
  activeElement: any;
  activeElementID: string | undefined;
  businessObject: any;
  activeBindDefine: any;
  updatingProperties: any | Boolean;
  modeler: any;
  shapeType: undefined | string;
  typeChange?: Function;
  dataChange?: Function;

  constructor(cbk?: any) {
    if (cbk) {
      const { typeChange, dataChange } = cbk;
      this.typeChange = typeChange;
      this.dataChange = dataChange;
    }
    this.updatingProperties = false;
  }

  getters() {}

  setters() {}
  /**
   * 刷新状态方法
   * @param elementRegistry 所有的节点
   * @param elementAction 动作dom
   * @returns
   * 1.如果没有bpmn或者没有动作对象直接结束
   * 2.保存动作对象到store中的activeElement
   * 3.获取当前动作的element
   * 4.根据element的id获取shape
   * 5.获取shape上保存的数据也就是businessObject,这一布有判断 如果没有shape 给定一个空对象
   * 6.获取这个节点的类型
   * 7.通过节点的类型获取对应的抽屉组件集合并保存到store的activeBindDefine
   */
  //刷新状态
  refreshState(elementRegistry: any, elementAction: any) {
    if (!this || !elementAction) {
      return;
    }
    this.activeElement = elementAction;
    let shape: any = {};
    let element: any = {};
    if (elementAction.id) {
      shape = elementAction;
      this.activeElement = elementAction;
      element = elementAction;
    } else {
      element = elementAction.element;
      shape = elementRegistry.get(element.id);
    }
    this.activeElementID = element.id;
    if (typeof this.dataChange == "function") {
      this.dataChange(this.businessObject, shape?.businessObject);
    }
    this.businessObject = shape ? shape.businessObject : {};
    // 点击节点标签（比如事件的节点名称）时，会发生找不到BpmnGroupPropertiesConfig对应的情况，此时可能会导致属性面板关闭
    // 对比节点的Id，节点标签的id为对应节点Id+'_label'，此时，需要找到节点对应的BpmnGroupPropertiesConfig配置
    let type: any = element.type;
    if (element.type === "label" && /_label$/.test(element.id)) {
      const replace = element.id.replace(/_label$/, "");
      type = elementRegistry._elements[replace]?.element.type;
    }
    // this.activeBindDefine = shape ? BpmnGroupPropertiesConfig[type] : null
    // this.activeBindDefine = type
    if (typeof this.typeChange == "function") {
      this.typeChange(this.shapeType, type);
    }
    this.shapeType = type;
  }

  /**
   * 初始化bpmn
   * @param options
   * 1.创建bpmn对象 并保存在store的modeler中
   * 2.获取所有的节点 通过get(节点id)的方法
   * 3.给bpmn绑定事件 分别为element.click:点击节点  shape.added:新增节点 element:changed:节点变化
   * 4.根据事件的类型来进行同的初始化操作也就是执行refreshState方法
   */

  initModeler(options: any) {
    this.modeler = new Modeler(options);
    const elementRegistry = this.modeler.get("elementRegistry");
    EVENT_TYPE.forEach((event) => {
      this.addEventListener(event, (elementAction: any) => {
        const element = elementAction.element || elementAction.context.element;

        if (!element && !elementAction.type) {
          return;
        }
        //如果是为label的add事件不需要刷新属性配置栏，否则输入节点名称时，会造成输入中断焦点丢失
        if (element.type == "label" && elementAction.type == "shape.added") {
          return;
        }

        //当前上下文中更新属性 触发element.changed直接过  不刷新业务对象 防止属性表单丢失焦点
        const updating = this.updatingProperties;
        //当触发element.changed事件 需要判断改变的类型是否与当前选中的一样  一样才刷新
        const elementTypeNonEqualActive =
          this?.activeElement?.element &&
          element.id !== this.activeElement.element.id;

        if (
          "element.changed" == elementAction.type &&
          (updating || elementTypeNonEqualActive)
        ) {
          return;
        }

        nextTick().then(() => {
          if (event == "element.click" || event == "shape.added") {
            this.activeElementID = element.id;
          }

          if (
            event === "shape.added" &&
            ["bpmn:StartEvent", "bpmn:UserTask"].includes(element.type) &&
            !element.businessObject.name
          ) {
            const length =
              this.getShapeAll().filter((item) =>
                ["bpmn:StartEvent", "bpmn:UserTask"].includes(item.type)
              ).length || 0;
            this.updateProperties(element, {
              name:
                element.type == "bpmn:StartEvent"
                  ? "开始节点"
                  : "未命名节点" + length,
            });
          }
          this.refreshState(elementRegistry, elementAction);
        });
      });
    });
  }

  getModeling(): any {
    return this.getModeler().get("modeling");
  }
  getBusinessObject(): any {
    return this.businessObject;
  }

  getModdle(): any {
    return this.modeler.get("moddle");
  }
  getModeler(): any {
    return this.modeler;
  }
  // 获取选中的节点类型
  getShapeType(): any {
    return this.shapeType;
  }
  //获取选中的节点
  getActiveElement(): any {
    return this.activeElement;
  }
  //获取图中所有节点
  getShapeAll(): any[] {
    return this.modeler.get("elementRegistry").getAll()[0].children;
  }

  getShapeById(id: any) {
    const elementRegistry = this.modeler.get("elementRegistry");
    return elementRegistry.get(id);
  }

  getShape() {
    return this.getShapeById(this.activeElement.element.id);
  }

  //获取xml数据
  getXML() {
    return new Promise((resolve, reject) => {
      this.modeler
        .saveXML({ format: true })
        .then((response: { xml: string }) => {
          resolve(response);
        })
        .catch((err: unknown) => {
          reject(err);
        });
    });
  }

  //更新节点数据
  updateProperties(element: ModdleElement, properties: PropertiesMap<any>) {
    this.updatingProperties = true;
    this.modeler.get("modeling").updateProperties(element, properties);
    this.updatingProperties = false;
  }

  updateExtensionElements(elementName: any, value: any) {
    const moddle = this.getModdle();
    const element = this.getShape();
    const extensionElements = this.getBusinessObject()?.extensionElements;
    // 截取不是扩展属性的属性
    const otherExtensions =
      extensionElements?.values
        ?.filter((ex: any) => ex.$type !== elementName)
        .map((item: ModdleElement) => toRaw(item)) || [];

    // 重建扩展属性
    const extensions = moddle.create("bpmn:ExtensionElements", {
      values: otherExtensions.concat(value instanceof Array ? value : [value]),
    });
    this.updateProperties(element, { extensionElements: extensions });
    // this.updateProperties(element, );
  }

  addEventListener(string: string, func: Function) {
    this.modeler.get("eventBus").on(string, function (e: any) {
      func(e);
    });
  }

  //导入xml生成数据
  importXML(string: string) {
    return this.modeler.importXML(string);
  }

  exportXML() {
    const rootElement = this.getModeler().get("canvas").getRootElement();
    this.getXML()
      .then((response:any) => {
        download(response.xml, rootElement.id || "process", "bpmn");
      })
      .catch((err: unknown) => {
        console.warn(err);
      });
  }

  setType(value: string | undefined) {
    this.shapeType = value;
  }

  setActiveElement(value: any) {
    this.activeElement = value;
  }

  resetData() {
    this.activeElement = null;
    this.businessObject = null;
    this.activeBindDefine = null;
    this.updatingProperties = false;
    this.modeler = null;
    this.shapeType = undefined;
  }
}

//文本下载
const download = (data: string, filename: string, type: string): void => {
  const blob = new Blob([data]);
  const tempLink = document.createElement("a"); // 创建a标签
  const href = window.URL.createObjectURL(blob); // 创建下载的链接
  //filename
  const fileName = `${filename}.${type}`;
  tempLink.href = href;
  tempLink.target = "_blank";
  tempLink.download = fileName;
  document.body.appendChild(tempLink);
  tempLink.click(); // 点击下载
  document.body.removeChild(tempLink); // 下载完成移除元素
  window.URL.revokeObjectURL(href); // 释放掉blob对象
};
