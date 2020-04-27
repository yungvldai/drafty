import { unique } from '@/../helpers';
import log from '../log';

export default {
  focusBlock(block, reactiveSetter) {
    reactiveSetter(block['editor-only'], 'focus', true);
  },
  blurBlock(block) {
    block['editor-only'].focus = false;
  },
  createNew({ 
    blocks, 
    after, 
    type = 'paragraph', 
    data = { content: '', style: [] }
  }) {
    blocks.splice(after + 1, 0, {
      key: unique(),
      type,
      data
    });
  },
  deleteBy({ blocks, index }) {
    let deleted = {...blocks[index]};
    blocks.splice(index, 1);
    return deleted;
  },
  replaceBy(block, newBlock = {}) {
    let foundIndex = this.blocks.findIndex(x => x.key === block.key);
    if (foundIndex !== -1) {
      this.blocks[foundIndex] = newBlock;
    } else {
      log.warn('Cannot find block to replace!');
    }
  },
  modifyBy(block, newBlock = {}) {
    for (let prop in newBlock) {
      if (prop !== 'key') {
        block[prop] = newBlock[prop];
      }
    }
  }
}