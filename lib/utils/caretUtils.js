function getCaretPos(el) {
  let caretOffset = 0;
  let range = window.getSelection().getRangeAt(0);
  let preCaretRange = range.cloneRange();
  preCaretRange.selectNodeContents(el);
  preCaretRange.setEnd(range.endContainer, range.endOffset);
  caretOffset = preCaretRange.toString().length;
  return caretOffset;
}

function setCaretPos(el, pos) {
  for (let node of el.childNodes) { 
    if (node.nodeType == 3) { // TEXT_NODE
      if (node.length >= pos) {
        let range = document.createRange(), sel = window.getSelection();
        range.setStart(node, pos);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
        return -1; 
      } else {
        pos -= node.length;
      }
    } else {
      pos = setCaretPos(el, pos);
      if (pos == -1) {
        return -1;
      }
    }
  }
  return pos;
}

function splitByCaret(string, pos) {
  return [
    string.substr(0, pos),
    string.substr(pos, string.length)
  ];
}

export default {
  getCaretPos, setCaretPos, splitByCaret
};