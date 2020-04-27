import Vue from 'vue';
import Drafty from './editor/Drafty.vue';
import { unique } from '../helpers';
import initialBlocks from './initialBlocks';

import blockUtils from './utils/blockUtils';
import caretUtils from './utils/caretUtils';
import selectionUtils from './utils/selectionUtils';
import styleUtils from './utils/styleUtils';

import navMixin from './mixins/nav';
import styleMixin from './mixins/style';
import textMixin from './mixins/text';

import log from './log';

const utils = {
  block: blockUtils,
  caret: caretUtils,
  selection: selectionUtils,
  style: styleUtils
};

const mixins = {
  nav: navMixin,
  style: styleMixin,
  text: textMixin
};

const version = 'drafty-vue^1.0';
let registered = [];
let options = {};

const isBlockCanBeIndexed = block => {
  let found = registered.find(x => x.type === block.type);
  if (found && found.options.useIndex) return true;
  return false;
};

const isBlockCanBeStyled = block => {
  let found = registered.find(x => x.type === block.type);
  if (found && found.options.useStyle) return true;
  return false;
};

class DraftyState {
  constructor(content) {
    if (content._packed) {
      this._v = content._v;
      this.blocks = content.articleSkeleton;
      content.articleText.split('\n').forEach((x, index) => {
        isBlockCanBeIndexed(this.blocks[index]) && (this.blocks[index].data.content = x);
        if (isBlockCanBeStyled(this.blocks[index])) {
          this.blocks[index].data.style = this.blocks[index].data.style.map(_ => new DraftyStyle(_))
        }
      });
    } else {
      if (content._v) {
        this._v = content._v;
        this.blocks = content.blocks;
      } else {
        this._v = version;
        this.blocks = [
          {
            key: unique(),
            type: 'paragraph',
            data: { content, style: [] }
          }
        ];
      }
    }
  }
  version() {
    return this._v;
  }
  getPacked() {
    let articleText = this.blocks.map(x => isBlockCanBeIndexed(x) ? x.data.content : '').join('\n');
    let articleSkeleton = JSON.parse(JSON.stringify(this.blocks));
    articleSkeleton.forEach(x => {
      delete x['editor-only'];
      if (isBlockCanBeIndexed(x)) {
        delete x.data.content;
      }
    });
    return {
      _packed: true,
      _v: this._v,
      articleSkeleton,
      articleText
    };
  }
}

function setOptions(_opts) {
  if (!_opts || typeof _opts !== 'object') {
    log.error('Options must be an object!');
  }
  options = _opts;
}

function knownBlocks() {
  return [ ...registered ];
}

const draftyCore = {
  utils,
  options,
  mixins,
  registered
};

let defaultMixin = {
  props: ['blocks', 'index', 'registered', 'options'],
  computed: {
    B() {
      return this.blocks[this.index];
    },
    PREV() {
      return this.index > 0 ? this.blocks[this.index - 1] : null;
    },
    NEXT() {
      return this.index < this.blocks.length - 1 ? this.blocks[this.index + 1] : null;
    },
    R() {
      return this.B['editor-only'].native;
    },
    S() {
      return this.B.data.style || [];
    },
    EVENT_PAYLOAD() {
      return {
        target: this.B,
        ptr: {
          index: this.index,
          blocks: this.blocks
        },
        options: this.options
      };
    }
  },
  mounted() {
    this.fixStructure(this.B);
  },
  methods: {
    fixStructure(block) {
      if (!block.data) {
        this.$set(block, 'data', {});
      }
      if (!block['editor-only']) {
        this.$set(block, 'editor-only', {});
      }
      if (!block['editor-only'].$drafty) {
        this.$set(block['editor-only'], '$drafty', draftyCore);
      }
      if (isBlockCanBeStyled(block) && (!block.data.style || !(block.data.style instanceof Array))) {
        this.$set(block.data, 'style', [])
      }
    },
    bindDOM(block, refName = 'block') {
      this.$set(block['editor-only'], 'native', this.$refs[refName]);
    }
  }
};

function applyMixin(c, mixin) {
  let copy = { ...c };
  if (!copy.mixins) {
    copy.mixins = [];
  }
  copy.mixins.push(mixin);
  return copy;
}

function registerNew({
  type, 
  c, 
  options = {}, 
  icon = 'texture',
  modifier = _ => _
}) {
  let blockUnique = type + '_' + unique();
  Vue.component(blockUnique, applyMixin(c, defaultMixin));
  registered.push({
    type,
    rc: blockUnique,
    options,
    modifier,
    icon
  });
}

(function (blocksArray) {
  for(let block in blocksArray) {
    registerNew({
      type: block, 
      c: blocksArray[block].c, 
      options: blocksArray[block].options
    });
  }
})(initialBlocks);

export { 
  Drafty,        
  DraftyState, 
  setOptions,    
  registerNew,
  knownBlocks,   
  registered,  
  options,
  utils,
  mixins
};