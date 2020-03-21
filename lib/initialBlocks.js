import Paragraph from './blocks/Paragraph.vue';

export default {
  'paragraph': {
    c: Paragraph,
    options: {
      useKeyboard: true,
      defaultData: {
        content: '',
        style: []
      }
    }
  }
};