function nodeLength(node) {
  if (node && node.nodeType === 3) return node.nodeValue.trim().length; // detecting TEXT_NODE
  let length = 0, childNodes = node.childNodes;
  if (childNodes) {
    for (let i = 0; i < childNodes.length; i++) {
      length += nodeLength(childNodes[i]);
    }
  }
  return length;
};

function rootOffset(root, point) {
  if (point.node === root) return point;
  let previousSibling = point.node.previousSibling;
  if (previousSibling) {
    return {
      node: point.node,
      offset: rootOffset(root, { node: previousSibling, offset: nodeLength(previousSibling) }).offset + point.offset
    };
  }
  let parentNode = point.node.parentNode;
  if (parentNode) return rootOffset(root, { node: parentNode, offset: point.offset });
  return point;
}

function getRootSelection(node) {
  let selectedRange = window.getSelection().getRangeAt(0);
  if (selectedRange) {
    let 
      sc = selectedRange.startContainer,
      so = selectedRange.startOffset,
      ec = selectedRange.endContainer,
      eo = selectedRange.endOffset;
    let editable = node;
    let start = rootOffset(editable, { node: sc, offset: so });
    let end = rootOffset(editable, { node: ec, offset: eo });
    return [start.offset, end.offset];
  }
  return [0, 0];
}

function getSelectionRect() {
  let sel = window.getSelection(),
      range,
      w = 0, 
      h = 0, 
      x = 0, 
      y = 0;
  if (sel.rangeCount) {
    range = sel.getRangeAt(0).cloneRange();
    if (range.getBoundingClientRect) {
      let rect = range.getBoundingClientRect();
      w = rect.right - rect.left;
      h = rect.bottom - rect.top;
    }
    if (range.getClientRects) {
      range.collapse(true);
      let rect = range.getClientRects()[0];
      x = rect.left;
      y = rect.top;
    }
  }
  return { x, y, w, h };
} 

export default {
  getRootSelection, getSelectionRect
};