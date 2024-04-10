/*
 * @Author: yjl
 * @Date: 2023-09-05 16:03:54
 * @LastEditors: yjl
 * @Description: 描述
 */
class CustomContextPad {
  static $inject: string[];
  [x: string]: any;
  constructor(
    config: any,
    contextPad: any,
    create: any,
    elementFactory: any,
    injector: any,
    translate: any,
  ) {
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;

    if (config.autoPlace !== false) {
      this.autoPlace = injector.get('autoPlace', false);
    }

    contextPad.registerProvider(this); // 定义这是一个contextPad
  }

  getContextPadEntries(_element: any) {
    const { autoPlace, create, elementFactory, translate } = this;

    function appendTask(event: any, element: any) {
      if (autoPlace) {
        const shape = elementFactory.createShape({ type: 'bpmn:Task' });
        autoPlace.append(element, shape);
      } else {
        appendTaskStart(event, element);
      }
    }

    function appendTaskStart(event: any, element: any) {
      const shape = elementFactory.createShape({ type: 'bpmn:Task' });
      create.start(event, shape, element);
    }
    return {
      'append.lindaidai-task': {
        group: 'model',
        title: translate('创建一个类型为lindaidai-task的任务节点'),
        className: 'icon-custom lindaidai-task',
        action: {
          click: appendTask,
          dragstart: appendTaskStart,
        },
      },
    };
  }
}

CustomContextPad.$inject = [
  'config',
  'contextPad',
  'create',
  'elementFactory',
  'injector',
  'translate',
];

export default {
  __init__: ['customContextPad'],
  customContextPad: ['type', CustomContextPad],
};
