<template>
  <div class="fixed-plugin" style="position: fixed; width: 35px; " v-click-outside="closeDropDown" 
      :class="{hide: !canFilterBySite}">
    <div class="dropdown show-dropdown" :class="{show: isOpen}">
      
      <!-- PROVIDERS IMAGE -->
      <!-- <div class="image-stack" style="margin-top: 10px; " @click="toggleProviders">
        <div style="padding-bottom: 5px; border-bottom: 1px dotted;" >
          <div style="font-size: .7rem;">Filter<br/>By</div>
        </div>
        <div style="cursor: pointer; padding-top: 14px;">
          <div class="image-stack__item image-stack__item--top">
            <i class="fa fa-user" > </i>
          </div>
          <div class="image-stack__item image-stack__item--bottom">
            <i class="fa fa-user" > </i>
          </div>
        </div> 
        <p style="text-transform: uppercase; font-size: .6rem; font-weight: normal; cursor: pointer;">Staff</p>
      </div> -->

      <!-- INSTIUTION IMAGE -->
      <!-- <div class="image-stack" @click="toggleSites" style="cursor: pointer; padding-top: 10px;">
        <div class="image-stack__item image-stack__item--top">
          <i class="fa fa-building" > </i>
        </div>
        <div class="image-stack__item image-stack__item--bottom">
          <i class="fa fa-building" > </i>
        </div>
      </div> -->
      
      <!-- DROPDOWN - PROVIDERS -->
      <!-- <p style="text-transform: uppercase; font-size: .6rem; font-weight: normal; cursor: pointer;">Sites</p> -->
      <ul class="dropdown-menu" style="left: -453px !important; width: 440px; margin-top: 10px; ">
        <div v-if="chooseProvider">
          <li  class="header-title">Providers</li>
          <div v-for="provider in providers" :key="provider.STAFFSID" ref="listProviders">
            <input type=checkbox id="provider.STAFFNAME" @click="selectProvider(provider.STAFFNAME)"/>
            <label :for="provider.STAFFNAME">{{ provider.STAFFNAME }}</label>
          </div>
        </div>

        <!-- DROPDOWN - INSTITUTIONS -->
        <!-- vue-treeselect widget to allow multiple selections and tags -->
        <div v-if="isOpen" >
          <!-- <div style="text-align: center; margin-bottom: 10px; ">
            {{ selectedSiteName.StaPa}} {{ selectedSiteName.InstitutionName }} 
          </div> -->
          <div >
            <li style="margin-left: 10px; width: 100%; display:inline; vertical-align:middle; border-color: red;  box-shadow:rgba(0, 0, 0, 0);">
              <treeselect
              v-model="institutionsSelected"
              :multiple="true"
              :options="options"
              :load-options="configTreeselect"
              placeholder="Select Site(s) to Filter Data ..."
              :alwaysOpen=true
              @input="selectInstitutions"
              >
              </treeselect>
            </li>
          </div>

        </div>
      </ul>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'

import Treeselect from '@riophae/vue-treeselect'
import { LOAD_ROOT_OPTIONS} from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

import { mapState, mapGetters, mapActions } from 'vuex'

  export default {
    
    components: {
      Treeselect
    },
    mounted() {
      // Retrive the providers for selected Station
      // this.PROVIDER_INFO() //
      // console.log('IN MOUNTED: this.currentpage is: ', this.currentpage )
      
      // Retrieve the institutions for selected Station
      // console.log('IN SidebarShare MOUNTED GET_INSTITUTIONS from selectedSite: ', this.selectedSite)
      this.GET_INSTITUTIONS()
    
    },
    props: ['color', 'image'],
    
    data () {
      return {
        //flags for provider and institution
        chooseProvider: false,
        chooseSite: false,
        enableProviderIcon: true,  // display flag for filtering

        selectedProvider: '',
        previousProvider: '',
        providers: [],

        isOpen: false,             //default for sidebar is closed

        // data for selected providers and institutions
        // institutionsSelected: [],
        // flags for vue-treeselect
        institutionsSelected: null,
        options: null, // signals delayed root level options - see optionLoader below
      }
    },
    computed: {
      ...mapState([
        'selectedSite',
        'selectedRange',
        'currentpage', 
        'siteNames',
        'institutions', // INSTITUTIONS OBJECT FROM DATABASE CALL
        'institutionSidebarShow',
      ]),

      ...mapGetters([
        // 'siteProviderList',
        'siteProviders',
        'siteProviderSelected',
        'canFilterBySite',
        'siteInstitutions'
      ]),
      
      // SELECTED SITE(INSTITUTION) IN TREESELECT
      selectedSiteName () {
        // console.log('SidebarShare treeseelect selectedSite is: ', this.selected)
        return this.siteNames.find(o => o.StaPa === this.selectedSite)
      },
      // CREATE OBJ OF INSTITUTIONS TO USE THEIR NAMES
      // MAY NOT NEED THIS IF VUEX SET_INSTITUTIONS MUTATIONS CHANGES
      institutionsNames () {
        // we should also set a list of institution names
        const arrayToObject = (array, keyField) =>
          array.reduce((obj, item) => {
            // console.log('item is: ', item)
            obj[item[keyField]] = item
            return obj
          }, {})
        
        return arrayToObject(this.institutions, 'id')
      },
    },
    watch: {
      // WATCH VUEX institutionSidebarShow show/hide 
      institutionSidebarShow() { // TRIGGERED when Filter BUTTON/LINK Clicked 

        // toggle show/hide sidebar
        this.toggleSites()
      },
      // WATCH VUEX selectedSite to RESET TREESELECT
      selectedSite () {

        // TREESELECT SELECTED INSTITUTIONS (TWO-WAY BINDING)
        //  Station Changed!! So reset the institutions user selected for filtering
        if(this.institutionsSelected != undefined) {
          console.log('User institutions selected reset because new stations!')
          this.institutionsSelected.length = 0
          
          // CREATE 'institutionsChoosen',
          // MATCH selectInstitutions version of 
          let sids = new Array()
          let names = new Array()
          let institutionsChoosen = { 'sids': sids, 'names': names }
          
          /*
          VUEX MESSAGE TO RESET 'selectInstitutions' (VUEX)
            DOMAIN PAGE WATCHES 'selectInstitutions' 
            EMPTY 'selectInstitutions' CAUSES NORMAL BACKGROUND COLOR
          */
          this.INSTITUTIONS_SELECTED(institutionsChoosen) 
        }        
      }
    },
    methods: {
      ...mapActions([
          // PROVIDER
          // 'PROVIDER_INFO',
          'PROVIDER_SELECTED',

          // SITES
          'GET_INSTITUTIONS',
          'INSTITUTIONS_SELECTED',
        ]), 

      /*
          INSTITUTION/SITE AND TREESELECT
      */
      configTreeselect({ action, parentNode, callback}) {
        if (action === LOAD_ROOT_OPTIONS) {
          // this is the delayed load of the treeselect options 
          console.log('in configTreeselect institutions are: ', this.institutions)
          this.options = this.institutions
                   
          callback() // treeselect internal callback signalling ready
        }
      },

      // TREESELECT click handler -- VUEX save selected site(s)
      selectInstitutions (institutionSIDs) { // array of SIDs
        // console.log('in treeselect selectedInstitution click handler, monitoring institutionsSIDs: ', institutionSIDs)
        
        // create the selected institution names
        // MAY NOT NEED THIS HERE - LATER USE this.institutionsNames
        let names = institutionSIDs.map(sid => 
            this.institutionsNames[sid].label
          )
        
        // build object of arrays to send to central VUEX state
        let institutionsChoosen = { 
          'sids': institutionSIDs, 
          'names': names
        }

        // VUEX action to  store selected INSTITUTIONS
        this.INSTITUTIONS_SELECTED(institutionsChoosen) 
      },

      // VUE CLICK AWAY - click handler
      closeDropDown (e) { // from cick_away        
        // do not consider the site filter button click as a 'click away'
        if (e.srcElement.name === 'siteFilterClick') return

        // usual case, close the sidebar
        this.isOpen = false

        // tell sidebar provider and site selection flags 
        // it's closed
        // this.chooseProvider = false
        // this.chooseSite = false

      },

      // Institution/Site click handler to show/hide sidebar
      toggleSites () {
               
        // load institutions after togling
        this.options = this.institutions

        // just toggle isOpen to show/hide
        this.isOpen = !this.isOpen

        // Next, disable the Provider sidebar when Site sidebar invoked
        // this.chooseProvider = false

      },

      /*
          PROVIDER AND TREESELECT
      */
      // Provider Names to display
      providerlist () {
        // list of provider uniques
        this.providers = [...new Set(this.siteProviders)]
        
        // Privider Icon Show/Hide
        this.enableProviderIcon = this.canFilterBySite

      },
      // Provider Icon click handler to show/hide the sidebar
      toggleProviders () {
       // First, management the Provider sidebar open/close
       if (this.chooseProvider == true) {
          this.chooseProvider = false
          this.isOpen = false
        } else {
          this.chooseProvider = true
          this.isOpen = true
        }
        
        // Next, disable the Site sidebar when Provider  is invoked
        this.chooseSite = false

        // Now, call providerlist to collect/display Stations providers
        this.providerlist()
 
      },

      // Provider Filter mini-application work flow
      // - selecting/deselecting individual provider for data filtering
      selectProvider (provider) {
        // clean the provider name
        provider = provider.trim()
        // color the label to show selected
        this.$refs.listProviders.map(p => {
          if (p.innerText.trim() == provider.trim() ) {// it's the clicked provider
            // console.log('looking at this label style', p.childNodes[0].nextElementSibling.style) 
            p.childNodes[0].nextElementSibling.style.background = 'lightgrey'
          }
        })
        // set the previous provider for later comparision w/ current provider
        let previous = this.previousProvider

        if (!previous) { 
          // if there's no previousProvider, set it as current provider
          this.previousProvider = provider
          this.PROVIDER_SELECTED(provider) // action to set in store
        } 
        else if (previous != provider) { 
          // uncheck previous. leaving one box checked at a time
          this.$refs.listProviders.map(p => {
            if (p.innerText.trim() == previous.trim()) {
              // console.log('p.childNodes are: ', p.childNodes)
              // console.log('p.childNodes[0].nextElementSibling.innerText is: ', p.childNodes[0].nextElementSibling.innerText )
              p.childNodes[0].checked = false
              p.childNodes[0].nextElementSibling.style.background = ''
            }
          })
          // set previous provider, and update the current provider
          this.previousProvider = provider
          this.PROVIDER_SELECTED(provider) // action to set in store
        } 
        else { 
          // there's a previous provider and is same as selected provider
          this.previousProvider = null
          this.PROVIDER_SELECTED(null) // action to set in store

          this.$refs.listProviders.map(p => {
          if (p.innerText.trim() == provider.trim() ) {// it's the clicked provider
            // make text red
            // console.log('looking at this label style', p.childNodes[0].nextElementSibling.style) 
            p.childNodes[0].nextElementSibling.style.background = ''
          }
        })
        }
      },

      /*
        ORIGIN SIDEBAR METHODS 
      */
      //  Change Image or Background Color 
      toggleList (list, itemToActivate) {
        list.forEach((listItem) => {
          listItem.active = false
        })
        itemToActivate.active = true
      },
      // In progress, only need if button needed to go to site level
      uncheckAll () { 
        this.PROVIDER_SELECTED(null)
        this.selectedProvider = null
      },
      changeSidebarBackground (item) {
        this.$emit('update:color', item.color)
        this.toggleList(this.sidebarColors, item)
      },
      changeSidebarImage (item) {
        this.$emit('update:image', item.src)
        this.toggleList(this.images, item)
      }
    }
  }
</script>

<style>
  .hide {
    display: none;
  }

/* OVERLAP THE FA IMAGES */
  /* clearfix */
.image-stack::after {
  content: ' ';
  display: table;
  clear: both;
}
.image-stack__item--top {
    float: left;
    width: 85%;
    margin-right: -100%;
    padding-top: 15%; /* arbitrary */
    position: relative;
    z-index: 1;
}
.image-stack__item--bottom {
    float: right;
    width: 75%;
}

</style>

<style lang="scss">

/* How to Modify Sidebar Size and Placement  

   left: -303px width: 290px is base, from _sidebar-and-main-panel.scss 
   to widen:
    increase negative left, widens sidebar dropdown to left, 
    at same time, increase positive width similarly to widen to right */

  @import "~assets/sass/lbd/variables";
  /* fixed plugin on the right */
  .fixed-plugin li > a,
  .fixed-plugin .badge {
    transition: all .34s;
    -webkit-transition: all .34s;
    -moz-transition: all .34s;
  }

  .fixed-plugin {
    position: absolute;
    top: 150px;
    right: 0;
    width: 64px;
    // background: rgba(0, 0, 0, .3);
    background: transparent;
    z-index: 1031;
    border-radius: 8px 0 0 8px;
    border-color: grey; /* border color on icon for sidebarshare */
    border-width: 1px;  
    border-style: none none none none; /* border on icon for sidebarshare */
    box-shadow: 1px 2px 3px rgba(0, 0, 0, 0); /* clear the box shadow */
    text-align: center;
  }

   .fixed-plugin .dropdown-menu {
    right: 80px;
    /*left: auto; */
    
    /* Widen sidebar here * 
    /* Also modify left in large scale @media query; */
    width: 530px; 
    border-radius: 10px;
    padding: 10px;
    overflow: hidden;
    background: transparent;
    max-height: 300px;
    border-color: transparent;
    transition: all 1s;
    -webkit-transition: all 1s;
    -moz-transition: all 1s;
  }

  .fixed-plugin .dropdown-menu:after, .fixed-plugin .dropdown-menu:before {
    right: 10px;
    margin-left: auto;
    left: auto;
  }

 .fixed-plugin .fa-cog {
    color: #FFFFFF;
    padding: 10px;
    border-radius: 0 0 6px 6px;
    width: auto;
  }


  .fixed-plugin .fa-circle-thin {
    color: #FFFFFF;
  }

  .fixed-plugin .active .fa-circle-thin {
    color: #00bbff;
  }

  .fixed-plugin .dropdown-menu > .active > a,
  .fixed-plugin .dropdown-menu > .active > a:hover,
  .fixed-plugin .dropdown-menu > .active > a:focus {
    color: #777777;
    text-align: center;
  }

  .fixed-plugin img {
    border-radius: 0;
    width: 100%;
    margin: 0 auto;
  }

  .fixed-plugin .badge,
  .fixed-plugin .badge:empty{
    border: 3px solid #FFFFFF;
    border-radius: 50%;
    cursor: pointer;
    display: inline-block;
    height: 28px;
    margin-right: 5px;
    position: relative;
    width: 28px;
  }

  .fixed-plugin .badge.active,
  .fixed-plugin .badge:hover {
    border-color: #00bbff;
  }

  .fixed-plugin .badge-white {
    background-color: #FFFFFF;
  }

  .fixed-plugin .badge-blue {
    background-color: #35495E;
  }

  .fixed-plugin .badge-azure {
    background-color: $new-blue;
  }

  .fixed-plugin .badge-green {
    background-color: $new-green;
  }

  .fixed-plugin .badge-orange {
    background-color: $new-orange;
  }

  .fixed-plugin .badge-purple {
    background-color: $new-purple;
  }

  .fixed-plugin .badge-red {
    background-color: $new-red;
  }

  .fixed-plugin h5 {
    font-size: 14px;
    margin: 10px;
  }

  .fixed-plugin .dropdown-menu li {
    display: block;
    padding: 5px 5px;
    width: 25%;
    float: left;
    text-align: center;
  }

  .fixed-plugin li.adjustments-line,
  .fixed-plugin li.header-title,
  .fixed-plugin li.button-container {
    width: 100%;
    min-height: inherit;
  }

  .fixed-plugin li.button-container {
    height: auto;
  }

  .fixed-plugin #sharrreTitle {
    text-align: center;
    padding: 10px 0;
    height: 50px;
  }

  .fixed-plugin li.header-title {
    height: auto;
    padding: 0;
    line-height: 35px;
    font-size: 12px;
    font-weight: 600;
    text-align: center;
    text-transform: uppercase;
  }

  .fixed-plugin .adjustments-line p {
    // float: left;
    display: inline-block;
    margin-bottom: 0;
    font-size: 1em;
  }

  .fixed-plugin .adjustments-line .switch {
    float: right;
  }

  .fixed-plugin .dropdown-menu > li.adjustments-line > a {
    padding-right: 0;
    padding-left: 0;
    border-bottom: 1px solid #ddd;
    margin: 0;
    padding-top: 0;
  }

  .fixed-plugin .gh-button-container {
    float: none;
    margin: 0;
  }

  .fixed-plugin .dropdown-menu > li > a.switch-trigger:hover,
  .fixed-plugin .dropdown-menu > li > a.switch-trigger:focus {
    background-color: transparent;
  }

  .fixed-plugin .dropdown-menu > li > a img {
    margin-top: auto;
  }

  .fixed-plugin .btn-social {
    display: block;
    width: 48%;
    float: left;
    font-weight: 600;
  }

  .fixed-plugin .btn-social i {
    margin-right: 5px;
  }

  .fixed-plugin .btn-social:first-child {
    margin-right: 2%;
  }

  .fixed-plugin .dropdown-menu {
    background: #FFFFFF;
  }

  .btn-facebook {
    border-color: $social-facebook;
    color: $social-facebook;

    &:hover {
      background-color: $social-facebook;
      border-color: $social-facebook;
      color: $white-color;
    }
  }

  .btn-twitter {
    border-color: $social-twitter;
    color: $social-twitter;
    &:hover {
      background-color: $social-twitter;
      border-color: $social-twitter;
      color: $white-color;
    }
  }

  .btn-pinterest {
    border-color: $social-pinterest;
    color: $social-pinterest;
    &:hover {
      background-color: $social-pinterest;
      border-color: $social-pinterest;
      color: $white-color;
    }
  }

  .fixed-plugin .dropdown-menu > li > a.img-holder {
    font-size: 16px;
    text-align: center;
    border-radius: 10px;
    background-color: #FFF;
    border: 3px solid #FFF;
    opacity: 1;
    cursor: pointer;
    max-height: 86px;
    overflow: hidden;
    padding: 0;
  }

  .fixed-plugin .dropdown-menu > li > a.switch-trigger:hover,
  .fixed-plugin .dropdown-menu > li > a.switch-trigger:focus {
    background-color: transparent;
  }

  .fixed-plugin .dropdown-menu > li:hover > a.img-holder,
  .fixed-plugin .dropdown-menu > li:focus > a.img-holder {
    border-color: rgba(0, 187, 255, 0.53);;
  }

  .fixed-plugin .dropdown-menu > .active > a.img-holder,
  .fixed-plugin .dropdown-menu > .active > a.img-holder {
    border-color: #00bbff;
    background-color: #FFFFFF;
  }

  .fixed-plugin .dropdown-menu > li > a img {
    margin-top: auto;
  }

  @media (min-width: 992px) {
    .fixed-plugin .dropdown .dropdown-menu {
      -webkit-transform: translateY(-50%);
      -moz-transform: translateY(-50%);
      -o-transform: translateY(-50%);
      -ms-transform: translateY(-50%);
      transform: translateY(-50%);
      top: 27px;
      opacity: 0;
      border-color: transparent;
      box-shadow: 1px 2px 3px rgba(0, 0, 0, 0); /* clear the box shadow */
      transform-origin: 0 0;
    }

    .fixed-plugin .dropdown-menu li.colors-line{
      width: 100%;
      border-bottom: 1px solid #ddd;
    }

    .fixed-plugin .dropdown.show .dropdown-menu {
      opacity: 1;
      /* add here for wider and longer sidebar w/ media query > 992px */
      left: -540px !important; /* widen sidebar from the left */
      height: 500px;
      background: transparent;

      -webkit-transform: translateY(-50%);
      -moz-transform: translateY(-50%);
      -o-transform: translateY(-50%);
      -ms-transform: translateY(-50%);
      transform: translateY(-50%);

      transform-origin: 0 0;
    }

    .fixed-plugin .dropdown-menu:before,
    .fixed-plugin .dropdown-menu:after {
      content: "";
      display: inline-block;
      position: absolute;
      top: 50%;
      width: 16px;
      transform: translateY(-50%);
      -webkit-transform: translateY(-50%);
      -moz-transform: translateY(-50%);

    }
    .fixed-plugin .dropdown-menu:before {
      border-bottom: 16px solid rgba(0, 0, 0, 0);
      border-left: 16px solid #F1EAE0;
      border-top: 16px solid rgba(0, 0, 0, 0);
      right: -16px;
    }

    .fixed-plugin .dropdown-menu:after {
      border-bottom: 16px solid rgba(0, 0, 0, 0);
      border-left: 16px solid #FFFFFF;
      border-top: 16px solid rgba(0, 0, 0, 0);
      right: -15px;
    }

    .typo-line {
      padding-left: 140px;
      margin-bottom: 40px;
      position: relative;
    }

    .typo-line .category {
      transform: translateY(-50%);
      top: 50%;
      left: 0px;
      position: absolute;
    }
  }

  @media (max-width: 991px) {
    .fixed-plugin .dropdown-menu {
      right: 60px;
      width: 220px;
    }
    .fixed-plugin .dropdown.show .dropdown-menu {
      left: -240px !important;
    }
    .fixed-plugin .dropdown-menu li {
      width: 50%;
    }

    .fixed-plugin .dropdown-menu li.colors-line{
      width: 100%;
      border-bottom: 1px solid #ddd;
    }

    .fixed-plugin li.adjustments-line,
    .fixed-plugin li.header-title,
    .fixed-plugin li.button-container {
      width: 100%;
      height: 55px;
      min-height: inherit;
    }

    .fixed-plugin li.button-container {
      height: auto;
    }

    .fixed-plugin .adjustments-line .switch {
      float: right;
      margin: 0 0px;
    }

    .fixed-plugin li.header-title {
      height: 40px;
    }
    .fixed-plugin .dropdown .dropdown-menu {
      top: -170px;
    }

    .fixed-plugin .dropdown-menu:before,
    .fixed-plugin .dropdown-menu:after {
      display: none;
    }

  }
</style>