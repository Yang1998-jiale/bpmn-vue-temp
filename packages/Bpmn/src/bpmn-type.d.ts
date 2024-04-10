/*
 * @Author       : archer
 * @Date         : 2023-10-28 10:58:50
 * @LastEditors  : archer
 * @Description  : 描述
 */
// 模型节点
import { UnwrapRef } from 'vue';
import Modeler from 'bpmn-js/lib/Modeler';

interface PropertiesMap<T> {
  [key: string]: T;
}

/**
 * 组属性（属性分组）
 */
interface GroupProperties {
  name?: string;
  icon?: string;
  properties: PropertiesMap<any>;
}

export interface BpmnState {
  /**
   * 当前活动的节点
   */
  activeElement: any;
  /**
   * 当前活动节点的业务对象
   */
  businessObject: any;
  /**
   * 更新properties
   */
  updatingProperties: boolean;

  /**
   * 当前活动节点的绑定字段配置
   */
  activeBindDefine: Array<GroupProperties> | null | never;
  /**
   * 流程设计器
   */
  modeler: any;
  eventType?: any;
  [key: string]: any;
}
interface actions {
  getState(): UnwrapRef<BpmnState>;

  refresh: () => void;

  /**
   * 初始化流程设计器
   * @param options 流程设计器参数
   */
  initModeler(options: unknown): void;

  /**
   *获取设计器
   */
  getModeler(): typeof Modeler;

  /**
   * 导入xml
   * @param xml xml字符串
   */
  importXML(xml: string): Promise<Array<string> | any>;

  /**
   * 获取流程xml
   */
  getXML(): Promise<{ xml: string }>;

  /**
   * 获取流程的SVG图
   */
  getSVG(): Promise<{ svg: string }>;

  /**
   * 获取当前节点的Shape对象，此对象用于操作节点与业务流程对象等
   */
  getShape(): any;

  getShapeById(id: string): any;

  /**
   * 获取当前的流程的业务对象
   */
  getBusinessObject(): any;

  /**
   * 获取当前的活动节点
   */
  getActiveElement(): any;

  /**
   * 获取当前节点的名称
   */
  getActiveElementName(): string;

  /**
   * 获取当前节点的modeling
   */
  getModeling(): any;

  /**
   * 获取bpmnFactory
   */
  getBpmnFactory(): any;

  /**
   * 创建节点
   * @param nodeName 节点名称
   * @param modelName 模型名称
   * @param value 几点值
   * @param multiple 是否是多节点
   */
  createElement(
    nodeName: string,
    modelName: string,
    value?: { [key: string]: any } | never,
    multiple?: boolean,
  ): void;

  /**
   * 添加设计器事件监听
   * @param name 事件名称
   * @param func 触发事件的回调
   */
  addEventListener(name: string, func: (e: any) => void): void;

  /**
   * 更新扩展节点
   * @param elementName 节点名
   * @param value 值
   */
  updateExtensionElements(elementName: string, value: ModdleElement | Array<ModdleElement>): void;

  updateProperties(element: ModdleElement, properties: PropertiesMap<any>): void;
}
export interface ModdleElement {
  id: string;
  $type: string;
  value?: [ModdleElement];
  $attrs: { [key: string]: any };

  [key: string]: any;
}

/**
 * 流程管理的上下文
 */
export interface BpmnContext {
  /**
   * 状态管理
   */
  state: UnwrapRef<BpmnState>;

  /**
   * 获取当前的状态
   */
  actions: actions;
  getters: any;
}
