import Vue from 'vue';
import Drafty from './editor/Drafty.vue';
import { unique } from '../helpers';
import initialBlocks from './initialBlocks';

const version = 'drafty-vue^1.0';
let registered = [];

let defaultMixin = {
  props: ['blocks', 'index', 'registered'],
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
    }
  },
  methods: {
    fixStructure(block) {
      if (!block.data) {
        this.$set(block, 'data', {});
      }
      if (!block['editor-only']) {
        this.$set(block, 'editor-only', {});
      }
    },
    bindDOM(block, refName = 'block') {
      this.fixStructure(block);
      this.$set(block['editor-only'], 'native', this.$refs[refName]);
    }
  }
};

function applyMixin(c, mixin) {
  let copy = {...c};
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


const isBlockCanBeIndexed = block => {
  let found = registered.find(x => x.type === block.type);
  if (found && found.options.useIndex) return true;
  return false;
}

class DraftyState {
  constructor(content) {
    if (content._packed) {
      this._v = content._v;
      this.blocks = content.articleSkeleton;
      content.articleText.split('\n').forEach((x, index) => {
        isBlockCanBeIndexed(this.blocks[index]) && (this.blocks[index].data.content = x);
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

export { Drafty, registerNew, registered, DraftyState };