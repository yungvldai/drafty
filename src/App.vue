<template>
  <div id="app">
    <drafty 
      :state="state"
      
      @block-text-selected="a"
    />
    <div style="margin-top: 160px;">
      <code>
        <pre>{{ JSON.stringify(state.getPacked(), null, 2) }}</pre>
      </code>
    </div>
  </div>
</template>

<script>
import { Drafty, DraftyState, setOptions, knownBlocks, utils } from '../lib/drafty';
import '../drafty.css'



setOptions({
  paragraphClass: 'hello',
  placeholder: {
    textWhereStart: 'tut nachat`',
    color: 'blue'
  }
})

console.log(knownBlocks())

export default {
  data: () => ({
    state: new DraftyState('hello')
  }),
  components: {
    Drafty
  },
  methods: {
    a(event) {

      if (event.range[0] === event.range[1]) return;

      console.log(event)
      let y = { tag: 'b', range: event.range }

      utils.style.addStyle(event.target, y)
    }
  }
}

</script>

<style>
.hello {
  font-size: 20px;
  font-family: Arial;
}

#app {
  width: 100%;
  max-width: 960px;
  margin: auto;
}
</style>

