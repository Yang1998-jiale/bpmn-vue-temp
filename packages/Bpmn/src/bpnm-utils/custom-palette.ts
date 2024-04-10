/*
 * @Author: yjl
 * @Date: 2023-09-04 16:31:38
 * @LastEditors: yjl
 * @Description: 描述
 */
class CustomPalette {
  static $inject: string[];
  [x: string]: any;
  constructor(bpmnFactory: any, create: any, elementFactory: any, palette: any, translate: any) {
    this.bpmnFactory = bpmnFactory;
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;

    palette.registerProvider(this);
  }
  // 这个函数就是绘制palette的核心
  getPaletteEntries(_element: any) {
    const { bpmnFactory, create, elementFactory, translate } = this;
    console.log(this);

    function createTask() {
      return function (event: any) {
        const businessObject = bpmnFactory.create('bpmn:Task'); // 其实这个也可以不要
        const shape = elementFactory.createShape({
          type: 'bpmn:Task',
          businessObject,
        });
        console.log(shape); // 只在拖动或者点击时触发
        create.start(event, shape);
      };
    }

    return {
      'create.lindaidai-task': {
        group: 'model',
        className: 'icon-custom lindaidai-task',
        title: translate('创建一个类型为lindaidai-task的任务节点'),
        action: {
          dragstart: createTask(),
          click: createTask(),
        },
      },
    };
  }
}

CustomPalette.$inject = ['bpmnFactory', 'create', 'elementFactory', 'palette', 'translate']; // 注入属性

export default {
  __init__: ['customPalette'],
  customPalette: ['type', CustomPalette],
};
export { CustomPalette };
