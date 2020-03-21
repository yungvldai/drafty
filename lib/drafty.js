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
      return this.B.data.native;
    },
    S() {
      return this.B.data.style || [];
    }
  },
  methods: {
    bindDOM(block, refName = 'block') {
      this.$set(block.data, 'native', this.$refs[refName]);
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

function registerType(type, c, options = {}) {
  let blockUnique = type + '_' + unique();
  Vue.component(blockUnique, applyMixin(c, defaultMixin));
  registered.push({
    type,
    rc: blockUnique,
    ...(options.useKeyboard ? {useKeyboard: true} : {}),
    ...(options.defaultData ? {defaultData: options.defaultData} : {}) 
  });
}

(function (blocksArray) {
  for(let block in blocksArray) {
    registerType(block, blocksArray[block].c, blocksArray[block].options);
  }
})(initialBlocks);

class DraftyState {
  constructor(content) {
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
  version() {
    return this._v;
  }
  textContent() {
    let string = '';
    this.blocks.forEach(block => {
      if (block.data && block.data.content) {
        string += block.data.content;
      }
      string += '\n';
    });
    return string;
  }
  json() {
    // todo delete ref
    return this.blocks;
  }
}

export { Drafty, registerType, registered, DraftyState };