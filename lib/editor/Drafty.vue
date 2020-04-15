<template>
  <div class="drafty-editor">
    <div 
      class="block"
      v-for="(block, index) in blocks"
      :key="block.key"
    >
      <div 
        class="modifier-container" 
        v-if="block.type === 'paragraph' && block.data.content.length === 0 && block['editor-only'] && block['editor-only'].focus"
      >
        <block-modifier 
          :registered="registered" 
          :blocks="blocks" 
          :index="index" 
        />
      </div>
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
import BlockModifier from './Modifier.vue';

export default {
  props: ['state'],
  data: () => ({
    registered
  }),
  computed: {
    blocks() {
      return this.state.blocks;
    }
  },
  components: {
    BlockModifier
  }
}
</script>

<style scoped lang="scss">
.drafty-editor {
  .block {
    position: relative;
    margin-bottom: 20px;
    .modifier-container {
      position: absolute;
      top: -2px;
      left: -30px;
    }
  }
}
</style>