

import blockUtils from '../utils/blockUtils';
import caretUtils from '../utils/caretUtils';

export default {
  methods: {
    isBlockUseKeyboard(block) {
      let found = this.registered.find(x => x.type === block.type);
      if (found && found.useKeyboard) return true;
      return false;
    },
    findNextWhichUseKeyboard(index) {
      let blockIndex = index + 1;
      if (blockIndex > this.blocks.length - 1) return null;
      while(!this.isBlockUseKeyboard(this.blocks[blockIndex])) {
        blockIndex += 1;
        if (blockIndex > this.blocks.length - 1) break;
      }
      return (blockIndex > this.blocks.length - 1) ? null : this.blocks[blockIndex];
    },
    findPrevWhichUseKeyboard(index) {
      let blockIndex = index - 1;
      if (blockIndex < 0) return null;
      while(!this.isBlockUseKeyboard(this.blocks[blockIndex])) {
        blockIndex -= 1;
        if (blockIndex < 0) break;
      }
      return (blockIndex < 0) ? null : this.blocks[blockIndex];
    },
    handleEnter(caretPos) {
      let [leave, move] = caretUtils.splitByCaret(this.B.data.content, caretPos);
      this.B.data.content = leave;
      blockUtils.createNew({
        blocks: this.blocks,
        after: this.index, 
        content: move
      });
      this.$nextTick(() => { // pass render to focus
        this.NEXT.data.native.focus();
      });
    },
    handleBackspace() {
      let deleted = blockUtils.deleteBy({ 
        blocks: this.blocks,
        index: this.index - 1
      });
      this.$nextTick(() => { // pass render to get new index
        if (deleted.data && deleted.data.content && deleted.data.content.length > 0) {
          this.B.data.content = deleted.data.content + this.B.data.content;
          this.$nextTick(() => { // pass render to set caret
            caretUtils.setCaretPos(this.R, deleted.data.content.length);
          });
        }
      });
    },
    handleDelete() {
      let deleted = blockUtils.deleteBy({ 
        blocks: this.blocks,
        index: this.index + 1
      });
      this.$nextTick(() => { // pass render to get new index
        if (deleted.data && deleted.data.content && deleted.data.content.length > 0) {
          let lengthBefore = this.B.data.content.length;
          this.B.data.content = this.B.data.content + deleted.data.content;
          this.$nextTick(() => { // pass render to set caret
            caretUtils.setCaretPos(this.R, lengthBefore);
          });
        }
      });
    },
    navPrev() {
      let found = this.findPrevWhichUseKeyboard(this.index);
      if (found) {
        found.data.native.focus();
        caretUtils.setCaretPos(found.data.native, this.PREV.data.content.length);
      }
    },
    navNext() {
      let found = this.findNextWhichUseKeyboard(this.index);
      if (found) {
        found.data.native.focus();
      }
    }
  }
}