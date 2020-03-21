<template>
  <div id="app">
    <drafty :state="state"/>
    <div style="margin-top: 160px;">
      <code>
        <pre>{{ JSON.stringify(state, null, 2) }}</pre>
      </code>
    </div>
  </div>
</template>

<script>
import { Drafty, DraftyState } from '@/../lib/drafty'

export default {
  data: () => ({
    state: new DraftyState('hello')
  }),
  components: {
    Drafty
  }
}

</script>

<style scoped>
#app {
  width: 100%;
  max-width: 960px;
  margin: auto;
}
</style>

