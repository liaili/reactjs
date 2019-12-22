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

function ReactElement(type, key, props) {
  this.type = type;
  this.key = key;
  this.props = props;
}

function ReactDOMElementComponent(node) {
  this._currentElement = node;
  this._rootNodeID = null;
}

ReactDOMElementComponent.prototype.mountComponent = function(rootNodeID) {
  this._rootNodeID = rootNodeID;
  var props = this._currentElement.props;
  var tagOpen = '<' + this._currentElement.type;
  var tagClose = '</' + this._currentElement.type + '>';
  tagOpen += ' data-reactid=' + this._rootNodeID;
  for (let propName in props) {
    if (/^on[A-Za-z]/.test(propName)) {
      var eventType = propName.replace('on', '');
      $(document).delegate(`[data-reactid='${this._rootNodeID}']`, `${eventType}.${this._rootNodeID}`, props[propName]);
    } else if (props[propName] && propName !== 'children') {
      tagOpen += ` ${propName}=${props[propName]}`;
    }
  }

  var content = '';
  var children = props.children || [];
  var childrenInstances = [];
  for (let index = 0; index < children.length; index++) {
    var child = children[index];
    var childComponentInstance = instantiantReactComponent(child);
    childComponentInstance._mountIndex = index;
    childrenInstances.push(childComponentInstance);
    var curRootId = `${this._rootNodeID}.${index}`;
    var childMarkup = childComponentInstance.mountComponent(curRootId);
    content += childMarkup;  
  }
  this._renderedChildren = childrenInstances;
  return tagOpen + '>' + content + tagClose;
}

function instantiantReactComponent(node) {
  if (typeof node === 'string' || typeof node === 'number') {
    return new ReactDOMTextComponent(node);
  } else if (typeof node === 'object' && typeof node.type === 'string') {
    return new ReactDOMElementComponent(node);
  }
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
    for(var propName in config) {
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
        childrenArray.push(arguments[i+2]);
      }
      props.children = childrenArray;
    }
    return new ReactElement(type, key, props);
  }
}