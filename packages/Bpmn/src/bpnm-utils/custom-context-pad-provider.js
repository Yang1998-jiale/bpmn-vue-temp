import { hasPrimaryModifier } from 'diagram-js/lib/util/Mouse';

function ContextPadProvider(
  config,
  injector,
  eventBus,
  contextPad,
  modeling,
  elementFactory,
  connect,
  create,
  popupMenu,
  canvas,
  rules,
  translate,
) {
  config = config || {};

  contextPad.registerProvider(this);

  this._contextPad = contextPad;

  this._modeling = modeling;

  this._elementFactory = elementFactory;
  this._connect = connect;
  this._create = create;
  this._popupMenu = popupMenu;
  this._canvas = canvas;
  this._rules = rules;
  this._translate = translate;

  if (config.autoPlace !== false) {
    this._autoPlace = injector.get('autoPlace', false);
  }

  eventBus.on('create.end', 250, function (event) {
    var context = event.context,
      shape = context.shape;

    if (!hasPrimaryModifier(event) || !contextPad.isOpen(shape)) {
      return;
    }

    var entries = contextPad.getEntries(shape);

    if (entries.replace) {
      entries.replace.action.click(event, shape);
    }
  });
}

ContextPadProvider.$inject = [
  'config.contextPad',
  'injector',
  'eventBus',
  'contextPad',
  'modeling',
  'elementFactory',
  'connect',
  'create',
  'popupMenu',
  'canvas',
  'rules',
  'translate',
];

ContextPadProvider.prototype.getContextPadEntries = function (element) {
  console.log(element);
  // let contextPad = this._contextPad,
  let modeling = this._modeling,
    elementFactory = this._elementFactory,
    connect = this._connect,
    create = this._create,
    // popupMenu = this._popupMenu,
    // canvas = this._canvas,
    // rules = this._rules,
    autoPlace = this._autoPlace,
    translate = this._translate,
    actions = {};

  /**
   * Create an append action
   *
   * @param {string} type
   * @param {string} className
   * @param {string} [title]
   * @param {Object} [options]
   *
   * @return {Object} descriptor
   */
  function appendAction(type, className, title, options) {
    if (typeof title !== 'string') {
      options = title;
      title = translate('Append {type}', { type: type.replace(/^bpmn:/, '') });
    }

    function appendStart(event, element) {
      var shape = elementFactory.createShape(Object.assign({ type: type }, options));
      create.start(event, shape, {
        source: element,
      });
    }

    var append = autoPlace
      ? function (event, element) {
          var shape = elementFactory.createShape(Object.assign({ type: type }, options));

          autoPlace.append(element, shape);
        }
      : appendStart;

    return {
      group: 'model',
      className: className,
      title: title,
      action: {
        dragstart: appendStart,
        click: append,
      },
    };
  }

  function removeElement(_e) {
    modeling.removeElements([element]);
  }

  function startConnect(event, element) {
    connect.start(event, element);
  }

  // function splitLaneHandler(count) {
  //   return function (event, element) {
  //     // actual split
  //     modeling.splitLane(element, count)

  //     // refresh context pad after split to
  //     // get rid of split icons
  //     contextPad.open(element, true)
  //   }
  // }
  if (element.type === 'bpmn:SequenceFlow') {
    Object.assign(actions, {
      // 'append.end-event': appendAction(
      //   'bpmn:EndEvent',
      //   'bpmn-icon-end-event-none',
      //   translate('Append EndEvent'),
      // ),
      // 'append.gateway': appendAction(
      //   'bpmn:ExclusiveGateway',
      //   'bpmn-icon-gateway-none',
      //   translate('Append Gateway'),
      // ),
      // 'append.append-task': appendAction(
      //   'bpmn:UserTask',
      //   'bpmn-icon-user-task',
      //   translate('Append Task'),
      // ),
      // 'append.intermediate-event': appendAction(
      //   'bpmn:IntermediateThrowEvent',
      //   'bpmn-icon-intermediate-event-none',
      //   translate('Append Intermediate/Boundary Event'),
      // ),
      delete: {
        group: 'edit',
        className: 'bpmn-icon-trash',
        title: translate('Remove'),
        action: {
          click: removeElement,
        },
      },
      // connect: {
      //   group: 'connect',
      //   className: 'bpmn-icon-connection-multi',
      //   title: translate('Connect using Association'),
      //   action: {
      //     click: startConnect,
      //     dragstart: startConnect,
      //   },
      // },
    });
  } else {
    Object.assign(actions, {
      'append.end-event': appendAction(
        'bpmn:EndEvent',
        'bpmn-icon-end-event-none',
        translate('Append EndEvent'),
      ),
      'append.gateway': appendAction(
        'bpmn:ExclusiveGateway',
        'bpmn-icon-gateway-none',
        translate('Append Gateway'),
      ),
      'append.append-task': appendAction(
        'bpmn:UserTask',
        'bpmn-icon-user-task',
        translate('Append Task'),
      ),
      // 'append.intermediate-event': appendAction(
      //   'bpmn:IntermediateThrowEvent',
      //   'bpmn-icon-intermediate-event-none',
      //   translate('Append Intermediate/Boundary Event'),
      // ),
      delete: {
        group: 'edit',
        className: 'bpmn-icon-trash',
        title: translate('Remove'),
        action: {
          click: removeElement,
        },
      },
      connect: {
        group: 'connect',
        className: 'bpmn-icon-connection-multi',
        title: translate('Connect using Association'),
        action: {
          click: startConnect,
          dragstart: startConnect,
        },
      },
    });
  }

  return actions;
};

export default {
  // __depends__: [
  //   DirectEditingModule,
  //   ContextPadModule,
  //   SelectionModule,
  //   ConnectModule,
  //   CreateModule,
  // ],
  __init__: ['contextPadProvider'],
  contextPadProvider: ['type', ContextPadProvider],
};
