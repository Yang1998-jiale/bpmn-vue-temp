/*
 * @Author: yjl
 * @Date: 2023-09-05 10:24:23
 * @LastEditors: yjl
 * @Description: 描述
 */
import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer'; // 引入默认的renderer
import { CustomPalette } from './custom-palette';
import { append as svgAppend, create as svgCreate } from 'tiny-svg';

const HIGH_LEVEL = 1500;
const customElements: any = ['bpmn:Task'];

const customConfig: any = {
  'bpmn:Task': {
    url: 'https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/rules.png',
    attr: { x: 0, y: 0, width: 48, height: 48 },
  },
};

class CustomRenderer extends BaseRenderer {
  static $inject: string[];
  [x: string]: any;
  constructor(eventBus: any, bpmnRenderer: any) {
    super(eventBus, HIGH_LEVEL);
    this.bpmnRenderer = bpmnRenderer; //保存传入的bpmnRenderer
  }

  canRender(element: any) {
    return !element.labelTarget; // 返回false，表示不渲染
  }

  drawShape(parentNode: Element, element: { [x: string]: any; type: any }) {
    //核心函数 -- 绘制shape
    const type = element.type;
    if (customElements.includes(type)) {
      const { url, attr } = customConfig[type];
      const customIcon: any = svgCreate('image', {
        ...attr,
        href: url,
      });
      element['width'] = attr.width;
      element['height'] = attr.height;
      svgAppend(parentNode, customIcon);
      return customIcon;
    }
    const shape = this.bpmnRenderer.drawShape(parentNode, element);
    return shape;
  }

  getShapePath(shape: any) {
    return this.bpmnRenderer.getShapePath(shape);
  }
}

CustomRenderer.$inject = ['eventBus', 'bpmnRenderer'];
export { CustomRenderer, customConfig, customElements };
export default {
  __init__: ['customPalette', 'customRenderer'],
  customPalette: ['type', CustomPalette],
  customRenderer: ['type', CustomRenderer],
};
