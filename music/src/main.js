import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import VueLazyload from 'vue-lazyload'
import store from './store/index'
import 'common/css/reset.css'
import 'common/css/font.css'
import loadImage from './assets/default.png'

Vue.use(VueResource)
Vue.config.productionTip = false

Vue.use(VueLazyload, {
  loading: loadImage,
  attempt: 1
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
