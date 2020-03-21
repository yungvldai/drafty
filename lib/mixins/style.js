export default {
  methods: {
    bindStyle(block) {
      !block.data.style && this.$set(block.data, 'style', []);
    }
  }
}