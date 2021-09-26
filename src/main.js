import Vue from 'vue'
import VueRouter from 'vue-router'
import { sync } from 'vuex-router-sync'
import NProgress from 'nprogress'
import App from './App.vue'

//css
import "../node_modules/ag-grid/dist/styles/ag-grid.css"
import "../node_modules/ag-grid/dist/styles/ag-theme-balham.css"
import "../node_modules/nprogress/nprogress.css"

// ag grid enterprise
import 'ag-grid-enterprise'

// store
import store from './store/store'

// LightBootstrap plugin
import LightBootstrap from './light-bootstrap-main'

// router setup
import routes from './routes/routes'

// modal
import VModal from 'vue-js-modal'
Vue.use(VModal, {dynamic: true, dialog: true, injectModalsContainer: true}) 

// plugin setup
Vue.use(VueRouter)
Vue.use(LightBootstrap)

// tooltip mixin
import VTooltip from 'v-tooltip'
Vue.use(VTooltip)

// configure router
const router = new VueRouter({
  // mode: 'history',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      // console.log('in saved position!')
        return savedPosition;
    }
    if (to.hash) {
      // console.log('to.hash is: ', to.hash)
        return { selector: to.hash };
    }
    // console.log('in scrollbehavior but neither savedPosition or to.hash triggered!!')
    return { x: 0, y: 0 };
  },
  routes, // short for routes: routes
  linkActiveClass: 'nav-item active'
})

// configure the nprogress bard
NProgress.configure({ easing: 'ease', speed: 500 })

router.beforeResolve((to, from, next) => {
  // If this isn't an initial page load.
  if (to.name) {
      // Start the route progress bar.
      NProgress.start()
  }
  next()
})

router.afterEach((to, from) => {
  // Complete the animation of the route progress bar.
  NProgress.done()
})

// allow router access within vuex
const unsync = sync(store, router)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store,
  watch: {
    '$route' (to, from) {
      // console.log('watching route as: ', this.$route)
      if (to != 'undefined' && from != 'undefined') {   
        // console.log('calling LOC_USAGE FROM ROUTE: ', this.$route) 
        this.$store.dispatch('LOG_USAGE', { to, from})
      }
    }
  },
  mounted() {   
    this.$store.dispatch('CURRENT_USER')
    this.$store.dispatch('USER_PERMISSIONS')
    
  }
})
