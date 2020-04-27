<template>
  <div class="drafty-editor">
    <div 
      class="block"
      v-for="(block, index) in blocks"
      :key="block.key"
      :data-render-key="block.key"
    >
      <component 
        v-if="registered.find(x => x.type === block.type)"
        :is="registered.find(x => x.type === block.type).rc" 
        :blocks="blocks"
        :index="index"
        :registered="registered"
        :options="options"
        v-on="$listeners"
      />
    </div>
  </div>
</template>

<script>
import { registered, options } from '../drafty';
import BlockModifier from './Modifier.vue';

export default {
  props: ['state'],
  data: () => ({
    registered: [ ...registered ],
    options: { ...options }
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
  }
}
</style>