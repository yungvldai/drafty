export default {
  methods: {
    safeInput(text) {
      let result = text;
      result = result.replace(/&/g, '&amp;');
      result = result.replace(/</g, '&lt;');
      result = result.replace(/>/g, '&gt;');
      return result;
    }
  }
};