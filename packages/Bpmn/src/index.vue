<!--
 * @Author: yjl
 * @Date: 2023-09-27 16:24:48
 * @LastEditors: yjl
 * @Description: 描述
-->
<template>
  <div class="bpmn-page">
    <div :id="bpmnID" class="modeler-container"></div>

    <div class="bpmn-operation">
      <div
        :title="item.label"
        @click="item.action"
        v-for="item in state.operation"
      >
        <svg class="icon" aria-hidden="true">
          <use :xlink:href="item.icon" />
        </svg>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive, onMounted, watch, onBeforeUnmount } from "vue";
import translate from "./i18n";
// import activitiModdel from './activiti-moddel.json'
import createDefaultBpmnXml from "./defaultBpmnXml";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import paletteProvider from "./bpnm-utils/palette-provider.js";
import CustomContextPadProvider from "./bpnm-utils/custom-context-pad-provider.js";
import { BPMN } from "./bpmn";
// camunda描述json
import camundaModdleDescriptor from "camunda-bpmn-moddle/resources/camunda";

interface Props {
  bpmnID: string | undefined;
  isReadOnly: boolean;
  options: any;
  operation: any;
}
let props = withDefaults(defineProps<Props>(), {
  bpmnID: "modeler-container",
  isReadOnly: false,
  options: {},
  operation: [],
});
const defaultProcessIdAndName = "1";
let emits = defineEmits(["select:element", "data:change"]);
const bpmnStore = reactive(
  new BPMN({
    dataChange: (_oldVal: any, newVal: any) => {
      emits("data:change", { businessObject: newVal });
    },
  })
);

const state = reactive({
  operation: [
    {
      label: "导入XML",
      icon: "#icon-shangchuan",
      action: importXML,
    },
    {
      label: "导出XML",
      icon: "#icon-zu1359",
      action: exportXML,
    },
    {
      label: "导出SVG",
      icon: "#icon-zu920",
      action: () => {
        bpmnStore.exportSVG();
      },
    },
    {
      label: "放大",
      icon: "#icon-fangda",
      action: () => {
        state.zoom = Math.floor(state.zoom * 100 + 0.1 * 100) / 100;
        bpmnStore.getModeler().get("canvas").zoom(state.zoom);
      },
    },
    {
      label: "缩小",
      icon: "#icon-suoxiao",
      action: () => {
        state.zoom = Math.floor(state.zoom * 100 - 0.1 * 100) / 100;
        bpmnStore.getModeler().get("canvas").zoom(state.zoom);
      },
    },
    {
      label: "还原并居中",
      icon: "#icon-quxiaoquanping",
      action: () => {
        state.zoom = 1;
        bpmnStore.getModeler().get("canvas").zoom("fit-viewport", "auto");
      },
    },
  ],
  zoom: 1,
});

onMounted(() => {
  if (props.isReadOnly) {
    bpmnStore.initModeler({
      container: `#${props.bpmnID}`,
      additionalModules: [
        //添加翻译
        {
          translate: ["value", translate("zh")],
          paletteProvider: ["value", ""], //禁用/清空左侧工具栏
          labelEditingProvider: ["value", ""], //禁用节点编辑
          contextPadProvider: ["value", ""], //禁用图形菜单
          bendpoints: ["value", {}], //禁用连线拖动
          zoomScroll: ["value", ""], //禁用滚动
          moveCanvas: ["value", ""], //禁用拖动整个流程图
          move: ["value", ""], //禁用单个图形拖动
        },
      ],
      moddleExtensions: {
        camunda: camundaModdleDescriptor,
      },
      ...props.options,
    });
  } else {
    bpmnStore.initModeler({
      container: `#${props.bpmnID}`,
      additionalModules: [
        //添加翻译
        { translate: ["value", translate("zh")] },
        // customPalette,
        paletteProvider,
        CustomContextPadProvider,
        // customContextPad,
        // customRender,
      ],
      moddleExtensions: {
        // activiti: activitiModdel,
        camunda: camundaModdleDescriptor,
      },
      ...props.options,
    });
  }
  bpmnStore
    .importXML(
      createDefaultBpmnXml(defaultProcessIdAndName, defaultProcessIdAndName)
    )
    .then((result: Array<string>) => {
      if (result.length) {
        console.warn("importSuccess warnings", result);
      }
    })
    .catch((err: any) => {
      console.warn("importFail errors ", err);
    });
  if (props.operation.length) {
    state.operation = props.operation;
  }
});
watch(
  () => bpmnStore.activeElementID,
  (_newVal) => {
    if (!bpmnStore.getShapeById(bpmnStore.activeElementID)) {
      bpmnStore.setActiveElement(undefined);
      bpmnStore.setType(undefined);
      return;
    }
    let businessObject = bpmnStore.getBusinessObject() || undefined;
    emits("select:element", {
      businessObject,
      shapeType: bpmnStore.getShapeType(),
    });
  },
  {
    deep: true,
  }
);

onBeforeUnmount(() => {
  bpmnStore.resetData();
});

function exportXML() {
  bpmnStore.exportXML();
}

function importXML() {
  let fileUpload: any = document.createElement("input");
  fileUpload.type = "file";
  fileUpload.click();
  fileUpload.onchange = () => {
    let file = fileUpload.files[0];
    let reader = new FileReader();
    reader.onload = () => {
      let xml: any = reader.result;
      bpmnStore.importXML(xml);
    };
    reader.readAsText(file);
  };
}

defineExpose({
  bpmnStore,
});
</script>
<style scoped lang="less">
.bpmn-page {
  width: 100%;
  height: 100%;
  position: relative;
}

.bjs-powered-by {
  display: none;
}

.bpmn-container {
  height: 100%;
}

.modeler-container {
  position: relative;
  flex: 1;
  height: 100%;
  background: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgMTBoNDBNMTAgMHY0ME0wIDIwaDQwTTIwIDB2NDBNMCAzMGg0ME0zMCAwdjQwIiBmaWxsPSJub25lIiBzdHJva2U9IiNlMGUwZTAiIG9wYWNpdHk9Ii4yIi8+PHBhdGggZD0iTTQwIDBIMHY0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZTBlMGUwIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+")
    repeat !important;
}

.djs-palette {
  top: 65px !important;
  border: none !important;
  background-color: #fff !important;
  box-shadow: 0 3px 3px rgb(0 0 0 / 20%);
}

:deep(.djs-palette.two-column.open) {
  width: 47px !important;
}

.icon-custom {
  /* 定义一个公共的类名 */
  border-radius: 50%;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 65%;
}

:deep(.icon-custom.lindaidai-task) {
  width: 30px;
  height: 30px;
  margin: 8px;

  /* 加上背景图 */
  background: url("https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/rules.png")
    no-repeat;
  background-size: 100% 100%;
}

:deep(.djs-context-pad) .lindaidai-task.entry:hover {
  background: url("https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/rules.png")
    no-repeat;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 95%;
}

:deep(.djs-context-pad) .entry:hover {
  /* 重新修改了 hover 之后的样式 */

  /* border: 1px solid #1890ff; */
  box-sizing: border-box;
}

:deep(.djs-context-pad) .entry {
  box-sizing: border-box;
  transition: all 0.3s;
  background-size: 94%;
}

.default-input {
  margin-bottom: 10px;
}

.bpmn-operation {
  position: absolute;
  bottom: 2%;
  left: 1%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;

  svg {
    width: 30px;
    height: 30px;
    margin-right: 16px;
    cursor: pointer;
  }
  // background-color: red;
}
</style>
