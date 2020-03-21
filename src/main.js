import Vue from 'vue'
import App from './App.vue'
import { unique } from '@/../helpers';

Vue.config.productionTip = false

Vue.mixin({
  methods: {
    unique
  }
})

new Vue({
  render: h => h(App),
}).$mount('#app')
