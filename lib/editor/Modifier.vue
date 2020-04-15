<template>
  <div class="modifier">
    <span class="material-icons">
      add
    </span>
  </div>
</template>

<script>
export default {
  props: ['registered', 'blocks', 'index'],
  computed: {
    B() {
      return this.blocks[this.index];
    }
  }
}
</script>

<style scoped lang="scss">
  .modifier {
    user-select: none;
  }
</style>