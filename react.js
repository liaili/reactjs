function ReactDOMTextComponent(text) {
  this._currentText = text;
  this._rootNodeID = null;
}

ReactDOMTextComponent.prototype.mountComponent = function(rootNodeID) {
  this._rootNodeID = rootNodeID;
  return `
    <span data-reactid="${rootNodeID}">${this._currentText}</span>
  `
}

function ReactClass() {}

ReactClass.prototype.render = function() {}

function ReactDOMElementComponent(node) {
  this._currentNode = node;
  this._rootNodeID = null;
}

ReactDOMElementComponent.prototype.mountComponent = function(rootNodeID) {
  this._rootNodeID = rootNodeID;
  const { props, type } = this._currentNode;
  var tagOpen = `<${type}`;
  var tagClose = `</${type}>`;
  tagOpen += ` reactid=${rootNodeID}`;
  for (const propName in props) {
    if (/^on[A-Za-z]/.test(propName)) {
      var eventType = propName.replace('on', '');
      $(document).delegate(`[reactid=${rootNodeID}]`, eventType, props[propName])
    } else if (props[propName] && propName !== 'children') {
      tagOpen += ` ${propName}=${props[propName]}`;
    }
  }
  var children = props.children;
  var childrenInstance = [];
  var content = '';
  for (let index = 0; index < children.length; index++) {
    var child = children[index];
    var childInstance = instantiantReactComponent(child);
    childInstance.mountIndex = index;
    var rootIndex = `${rootNodeID}.${index}`;
    var childMarkup = childInstance.mountComponent(rootIndex);
    childrenInstance.push(childMarkup);
    content += childMarkup;
  }
  return tagOpen + '>' + content + tagClose;
}

function ReactCompositeComponent(element) {
  this._currentElement = element;
  this._rootNodeID = null;
  this.instance = null;
}

ReactCompositeComponent.prototype.mountComponent = function(rootNodeID) {
  this._rootNodeID = rootNodeID;
  var publicProps = this._currentElement.props;
  var ReactClass = this._currentElement.type;
  var inst = new ReactClass(publicProps);
  this._instance = inst;
  inst._reactInernalInstance = this;

  if (inst.componentWillMount) {
    inst.componentWillMount();
  }
  
  var renderedElement = this._instance.render();
  var renderedComponentInstance = instantiantReactComponent(renderedElement);
  this._renderedComponent = renderedComponentInstance;
  var renderedMarkup = renderedComponentInstance.mountComponent(this._rootNodeID);
  return renderedMarkup;
}

function instantiantReactComponent(node) {
  if (typeof node === 'string' || typeof node === 'number') {
    return new ReactDOMTextComponent(node);
  } else if (typeof node === 'object' && typeof node.type === 'string') {
    return new ReactDOMElementComponent(node);
  } else if (typeof node === 'object' && typeof node.type === 'function') {
    return new ReactCompositeComponent(node);
  }
}

function ReactElement(type, key, props) {
  this.type = type;
  this.key = key;
  this.props = props;
}

const React = {
  nextReactRootIndex: 0,
  render: function(component, container) {
    const instanceComponent = instantiantReactComponent(component);
    const markup = instanceComponent.mountComponent(this.nextReactRootIndex++);
    $(container).html(markup);
  },
  createElement: function(type, config = {}, children) {
    var props = {};
    var key = config.key || undefined;
    for (const propName in config) {
      if (config.hasOwnProperty(propName) && propName !== 'key') {
          props[propName] = config[propName];      
      }
    }

    var childrenLength = arguments.length - 2;
    if (childrenLength === 1) {
      props.children = Array.isArray(children) ? children : [children];
    } else {
      var childrenArray = [];
      for (let index = 0; index < childrenLength; index++) {
        childrenArray.push(arguments[index + 2]);        
      }
      props.children = childrenArray;
    }
    return new ReactElement(type, key, props);
  },
  createClass: function(spec) {
    var Constructor = function(props) {
      this.props = props;
      this.state = this.getInitialState ? this.getInitialState() : {};
    }
    Constructor.prototype = new ReactClass();
    Constructor.prototype.constructor = Constructor;
    $.extend(Constructor.prototype, spec);
    return Constructor;
  }
}
