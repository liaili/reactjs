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

function instantiantReactComponent(node) {
  if (typeof node === 'string' || typeof node === 'number') {
    return new ReactDOMTextComponent(node);
  }
}

const React = {
  nextReactRootIndex: 0,
  render: function(component, container) {
    const instanceComponent = instantiantReactComponent(component);
    const markup = instanceComponent.mountComponent(this.nextReactRootIndex++);
    $(container).html(markup);
  }
}