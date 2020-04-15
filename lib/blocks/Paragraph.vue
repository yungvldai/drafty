<template>
  <div class="paragraph">
    <div 
      class="content"
      contenteditable="true"
      @input="handleInput"
      @keydown="handleKeydown"
      @keyup="handleKeyup"
      @focus="setFocus(true)"
      @blur="setFocus(false)"
      v-html="render(B)"
      ref="block"
    />
  </div>
</template>

<script>
import caretUtils from '../utils/caretUtils';
import blockUtils from '../utils/blockUtils';

import text from '../mixins/text';
import style from '../mixins/style';
import nav from '../mixins/nav';

export default {
  mixins: [text, style, nav],
  mounted() {
    this.bindDOM(this.B);
    this.bindStyle(this.B);
  },
  methods: {
    setFocus(value) {
      value ? blockUtils.focusBlock(this.B, this.$set) : blockUtils.blurBlock(this.B);
    },
    render(block) {
      return block.data.content;
    },
    handleInput(event) {
      let caretPos = caretUtils.getCaretPos(this.R); // remember caret pos
      this.B.data.content = this.safeInput(event.target.textContent);
      this.$nextTick(() => { // after render we set caret pos back
        caretUtils.setCaretPos(this.R, caretPos);
      });
    },
    handleKeyup(event) {

    },
    handleKeydown(event) {
      let caretPos = caretUtils.getCaretPos(this.R);
      switch(event.key) {
        case 'Enter':
          event.preventDefault();
          this.handleEnter(caretPos);
          break;
        
        case 'Backspace':
          if (caretPos === 0 && this.index > 0) {
            event.preventDefault();
            this.handleBackspace();
          }
          break;
        
        case 'ArrowUp':
          if (caretPos === 0) {
            event.preventDefault();
            this.navPrev();
          }
          break;
        
        case 'ArrowDown':
          if (caretPos === this.B.data.content.length) {
            event.preventDefault();
            this.navNext();
          }
          break;

        case 'Delete':
          if (caretPos === this.B.data.content.length && this.NEXT) {
            event.preventDefault();
            this.handleDelete();
          }
          break;
        
        default:
          break;
      }
    }
  }
}
</script>

<style scoped lang="scss">
.paragraph {
  width: 100%;
  .content {
    min-height: 18px;
    outline: none;
    text-align: justify;
    
  }
}
</style>