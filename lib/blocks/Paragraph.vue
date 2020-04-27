<template>
  <div 
    :class="`paragraph ${options.paragraphClass || ''}`"
    :style="blockStyle"
  >
    <div 
      class="content"
      contenteditable="true"
      @input="handleInput"
      @keydown="handleKeydown"
      @keyup="handleKeyup"
      @focus="event => setFocus(true, event)"
      @blur="event => setFocus(false, event)"
      v-html="render(B)"
      ref="block"
      :placeholder-text="placeholder"
    />
  </div>
</template>

<script>
import caretUtils from '../utils/caretUtils';
import blockUtils from '../utils/blockUtils';
import selectionUtils from '../utils/selectionUtils';
import styleUtils from '../utils/styleUtils';

import text from '../mixins/text';
import style from '../mixins/style';
import nav from '../mixins/nav';

import { callInLastOrder } from '../../helpers/index';

export default {
  mixins: [text, style, nav],
  data: () => ({
    textSelection: [0, 0]
  }),
  mounted() {
    this.bindDOM(this.B);
    this.bindStyle(this.B);
  },
  computed: {
    placeholder() {
      if (!this.options.placeholder) return '';
      if (this.blocks.length === 1) {
        return this.options.placeholder.textWhereStart || '';
      }
      if (this.index === this.blocks.length - 1) {
        return this.options.placeholder.textWhereStay || '';
      }
      return '';
    },
    blockStyle() {
      return {
        '--placeholder-color': (this.options.placeholder || {}).color || 'rgb(187, 187, 187)'
      }
    }
  },
  methods: {
    subscribeOnMouseEvents() {
      document.addEventListener('mousedown', this.onDocumentMouseDown);
      document.addEventListener('mouseup', this.onDocumentMouseUp);
    },
    unsubscribeOnMouseEvents() {
      document.removeEventListener('mousedown', this.onDocumentMouseDown);
      document.removeEventListener('mouseup', this.onDocumentMouseUp);
    },
    onDocumentMouseUp(event) {
      callInLastOrder(() => {
        this.textSelection = selectionUtils.getRootSelection(this.R);
        this.$emit('block-text-selected', {
          ...this.EVENT_PAYLOAD,
          ref:  this.R,
          range: this.textSelection
        });
      })
    },

    setFocus(value, event) {
      this.$emit(value ? 'block-focused' : 'block-blurred', {
        event,
        ...this.EVENT_PAYLOAD,
        ref:  this.R,
      });
      value ? this.subscribeOnMouseEvents() : this.unsubscribeOnMouseEvents();
      value ? blockUtils.focusBlock(this.B, this.$set) : blockUtils.blurBlock(this.B);
    },
    render(block) {
      let content = block.data.content;
      block.data.style.forEach(x => {
        content = styleUtils.applyStyle(content, x);
      });
      return content;
    },
    handleInput(event) {
      this.$emit('block-input', {
        event,
        ...this.EVENT_PAYLOAD,
        ref: this.R
      });
      let caretPos = caretUtils.getCaretPos(this.R); // remember caret pos
      this.B.data.content = this.safeInput(event.target.textContent);
      this.$nextTick(() => { // after render we set caret pos back
        caretUtils.setCaretPos(this.R, caretPos);
      });
    },
    handleKeyup(event) {
      this.$emit('block-keyup', {
        event,
        ...this.EVENT_PAYLOAD,
        ref: this.R
      });
    },
    handleKeydown(event) {
      this.$emit('block-keydown', {
        event,
        ...this.EVENT_PAYLOAD,
        ref: this.R
      });
      let caretPos = caretUtils.getCaretPos(this.R);
      switch (event.key) {
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