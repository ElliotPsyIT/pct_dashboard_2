<template>
  <div class="wrapper">
    <side-bar title="PTSD Admin">
      <user-menu></user-menu>
      <mobile-menu slot="content"></mobile-menu>
      <sidebar-link to="/admin/overview">
        <i class="nc-icon nc-chart-pie-35"></i>
        <p>Dashboard</p>
      </sidebar-link>
      <!-- <sidebar-link to="/admin/definitions">
        <i class="nc-icon nc-bullet-list-67"></i>
        <p>Definitions</p>
      </sidebar-link> -->
      <sidebar-link to="/admin/consults">
        <i class="nc-icon nc-email-85"></i>
        <p>Consults</p>
      </sidebar-link>
      <sidebar-link to="/admin/appointments">
        <i class="nc-icon nc-chart-pie-36"></i>
        <p>No Shows & Cancels</p>
      </sidebar-link>
      <sidebar-link to="/admin/encounters">
        <i class="nc-icon nc-single-copy-04"></i>
        <p>Encounters</p>
      </sidebar-link>
      <sidebar-link to="/admin/providers">
        <i class="nc-icon nc-circle-09"></i>
        <p>Providers</p>
      </sidebar-link>
      <!-- <sidebar-link to="/admin/surveys">
        <i class="nc-icon nc-paper-2"></i>
        <p>Surveys</p>
      </sidebar-link> -->
      <sidebar-link to="/admin/mbc">
        <i class="nc-icon nc-paper-2"></i>
        <p>MBC & Surveys</p>
      </sidebar-link>
      <sidebar-link to="/admin/ebp">
        <i class="nc-icon nc-notes"></i>
        <p>EBPs</p>
      </sidebar-link>
      <div v-if="viewPrivileges">
        <sidebar-link to="/admin/explore">
          <i class="nc-icon nc-notes"></i>
          <p>Explore</p>
        </sidebar-link>
      </div>
    </side-bar>
    <div class="main-panel">
      <top-navbar></top-navbar>
      <sidebar-share
        :color.sync="sidebarBackground"
        :backgroundImageEnabled.sync="sidebarBackgroundImageEnabled"
        :fixed-navbar.sync="fixedNavbar"
        :sidebarMini.sync="sidebarMini"
        :image.sync="sidebarBackgroundImage"
        >>
      </sidebar-share>
      <dashboard-content @click="toggleSidebar"> </dashboard-content>

      <content-footer></content-footer>
    </div>
  </div>
</template>
<style lang="scss">
</style>
<script>
import TopNavbar from "./TopNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./Content.vue";
import MobileMenu from "./MobileMenu.vue";
import UserMenu from "./UserMenu.vue";

import SidebarShare from "./SidebarShare.vue";

import { mapState, mapGetters, mapActions } from "vuex";

export default {
  components: {
    TopNavbar,
    ContentFooter,
    DashboardContent,
    MobileMenu,
    UserMenu,
    SidebarShare,
  },
  data() {
    return {
      sidebarBackground: "black",
      sidebarBackgroundImage: "static/img/sidebar-5.jpg",
      sidebarBackgroundImageEnabled: true,
      fixedNavbar: false,
      sidebarMini: false,
    };
  },
  computed: {
    ...mapState(["userFirstName", "userLastName"]),
    viewPrivileges() {
      // console.log('this.userFirstName is: ', this.userFirstName)
      // console.log('this.userLastName is : ', this.userLastName)

      if (
        (this.userFirstName == "Elliot" && this.userLastName == "Fielstein0") ||
        (this.userFirstName == "Elliot" && this.userLastName == "Fielstein") ||
        (this.userFirstName == "Samantha" &&
          this.userLastName == "McClelland") ||
        (this.userFirstName == "Wright" && this.userLastName == "Wright")
      ) {
        // console.log('user matched, allowed to see Explore!')
        return true;
      } else {
        // console.log('user did not match, NOT allowed to see Explore!')
        return false;
      }
    },
  },
  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    },
    minimizeSidebar() {
      this.$sidebar.toggleMinimize();
    },
  },
};
</script>

<style>
</style