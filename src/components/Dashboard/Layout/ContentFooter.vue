<template>
  <footer class="footer">
    <div class="container-fluid">
      <nav>
        <ul class="footer-menu">
          <li>
            <router-link :to="{path:'/admin'}">Dashboard v.{{appVersion}}</router-link>
          </li>
        </ul>
      </nav>
      <div class="copyright text-center">
        &copy; Coded by MH Informatics with Dashboard Inspiration from
        <a href="https://github.com/cristijora" target="_blank">Cristi Jora</a>.
      </div>
    </div>
  </footer>
</template>
<script>
import { mapState } from 'vuex'
  export default {
    computed: {
    ...mapState([
      'appVersion',
    ]),
    }
  }

</script>
<style>

</style>
