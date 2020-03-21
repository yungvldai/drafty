import { unique } from '@/../helpers';

export default {
  createNew({ 
    blocks, 
    after, 
    type = 'paragraph', 
    content = '', 
    style = []
  }) {
    blocks.splice(after + 1, 0, {
      key: unique(),
      type,
      data: {
        content,
        style
      }
    });
  },
  deleteBy({ blocks, index }) {
    let deleted = {...blocks[index]};
    blocks.splice(index, 1);
    return deleted;
  }
}