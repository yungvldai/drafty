import { unique } from '@/../helpers';

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
  }
}