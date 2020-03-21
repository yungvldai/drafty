<template>
  <div class="drafty-editor">
    <div 
      class="block"
      v-for="(block, index) in blocks"
      :key="block.key"
    >
      <component 
        v-if="registered.find(x => x.type === block.type)"
        :is="registered.find(x => x.type === block.type).rc" 
        :blocks="blocks"
        :index="index"
        :registered="registered"
      />
    </div>
  </div>
</template>

<script>
import { registered } from '../drafty';

export default {
  props: ['state'],
  data: () => ({
    registered
  }),
  computed: {
    blocks() {
      return this.state.blocks;
    }
  }
}
</script>

<style scoped>
.drafty-editor {
  border: 1px solid #ccc;
}
</style>