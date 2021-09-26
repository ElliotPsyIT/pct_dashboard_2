<template>
  <transition name="fade" mode="out-in">
    <div class="content" :key="selectedRange">
      <div class="container-fluid" >  <!-- :class="{filtering: changeBackgroundColor}" -->

              Scroll Position {{scrollPosition}}

        <!-- Show Filtered Sites -->
        <!-- Not needed if not filtering on Consults -->
        <!-- <div v-if="changeBackgroundColor">
          <div class="row d-flex justify-content-center " style="position: fixed; right: 50px; z-index: 500;">
              <div style="font-size: .7rem; border: solid 1px grey; ">
                  {{ selectedInstitutionsNames }}
              </div>
          </div>
        </div> -->

        <!-- Disclaimer -->
        <div class="row d-flex justify-content-center mt-4 ">
          <p class="category" style="font-size: .8rem; font-style: italic;">
            <span class="font: red;">{{ disclaimer.asterisks}}</span>
            {{ disclaimer.mainText }}
            <span style="font-weight:bold; text-decoration:underline">{{ disclaimer.emphasis }}</span>
          </p>
          <div v-if="dataError">
            <div class="category" style="font-style: italic; text-align: center;">
             <span style="color: red; font-size: 2rem; font-weight: bold; text-align: center; text-decoration: underline;" >
               WARNING! DATA ERROR TODAY - 2/7/2021 
             </span>
             <span style="color: red; font-size: 2rem; font-weight: bold; text-align: center; text-decoration: underline;" >
               WE ARE WORKING TO SOLVE THE PROBLEM
             </span>
            </div> 
          </div> 
        </div>

      <hr/>

        <!-- Section Header -->
        <div class="row d-flex justify-content-center ">
          <h4 class="section-head">Consult Overall Summary</h4>
        </div>

        <!-- ConsultsAll FAQ -->
        <div style="align-items: center; display: flex; justify-content: center; ">
          <div style="width: 60%; margin-bottom: 10px;">
           <VueFaqAccordion :items="consultsAll"/> 
          </div>
        </div>

        <div class="row d-flex justify-content-center">
              <div class="col-xl-3 col-md-4">
                <stats-card >
                  <div slot="header" class="icon-warning">
                    <i class="nc-icon nc-email-85 text-warning"></i>
                  </div>
                  <div slot="content">
                    <p class="card-category">Total Consults</p>
                    <h4 class="card-title">{{ addCommas(asyncValue(siteConsultTotal)) }}</h4>
                  </div>
                  <!-- <div slot="footer">
                    <i class="fa fa-refresh"></i>With Duplicates
                  </div> -->
                </stats-card>
              </div>

              <div class="col-xl-3 col-md-4">
                <stats-card>
                  <div slot="header" class="icon-warning">
                    <i class="nc-icon nc-single-copy-04 text-warning"></i>
                  </div>
                  <div slot="content">
                    <p class="card-category">Total Patients</p>
                    <h4 class="card-title">{{ addCommas(asyncValue(siteConsultPatientTotal)) }}</h4>
                  </div>
                  <!-- <div slot="footer">
                    <i class="fa fa-calendar-o"></i>No Duplicates
                  </div> -->
                </stats-card>
              </div>

              <div class="col-xl-3 col-md-4">
                <div @click="clickedCard('PENDING')" style="cursor: pointer;">
                  <stats-card>
                    <div slot="header" :class="cardStatusIconPending">
                      <i class="nc-icon nc-attach-87 text-warning"></i>
                    </div>
                    <div slot="content">
                      <p class="card-category">Pending</p>
                      <h4 class="card-title">{{ addCommas(asyncValue(siteConsultPendingTotal)) }}</h4>
                    </div>
                    <div slot="footer">
                      <i class="fa fa-refresh"></i>Click To <span :class="cardStatusTextPending">Filter PENDING</span>
                    </div>
                  </stats-card>
                </div>
              </div>

              <div class="col-xl-3 col-md-6">
                <div @click="clickedCard('ACTIVE')" style="cursor: pointer;">
                  <stats-card>
                    <div slot="header" :class="cardStatusIconActive">
                      <i class="nc-icon nc-cloud-upload-94 text-warning"></i>
                    </div>
                    <div slot="content">
                      <p class="card-category">Active</p>
                      <h4 class="card-title">{{ addCommas(asyncValue(siteConsultActiveTotal)) }}</h4>
                    </div>
                    <div slot="footer">
                      <i class="fa fa-refresh"></i>Click To <span :class="cardStatusTextActive">Filter ACTIVE</span>
                    </div>
                  </stats-card>
                </div>
              </div>

            </div>

        <!-- Section Header -->
        <div class="row d-flex justify-content-center ">
          <h4 class="section-head">Consult Uniques and Statuses</h4>
        </div>

        <!-- ConsultsAll FAQ -->
        <div style="align-items: center; display: flex; justify-content: center; ">
          <div style="width: 60%; margin-bottom: 10px;">
           <VueFaqAccordion :items="consultsUniquesAndStatuses"/> 
          </div>
        </div>

        <div class="row">

          <div class="col-md-6">
            <template>
              <vue-highcharts :options="lineChartOptions"  ref="lineChart"></vue-highcharts>
            </template>
          </div>

          <div class="col-md-6">
            <template>
              <vue-highcharts :options="pieChartOptions"  ref="pieChart"></vue-highcharts>
            </template>
          </div>

        </div>

        <!-- phipii is false for everyong for visn and national
        to show this PHIPII message if user has no phipii privileges
        test negation of both phipii and selectedSiteVISNorNATIONAl, 
        then it''l show only if no phipii and no visn/national -->
        <div v-if="!phipii && !selectedSiteVISNorNATIONAL">
          <!-- Section Header -->
          <div class="row d-flex justify-content-center ">
            <h4 class="section-head">Consult Details</h4>
          </div>
          <div class="row d-flex justify-content-center">
            <h3 class="phipii-warning">Privileges Required to View Patient Level Data for Station <b>{{ selectedSite }}</b> - Request Link Below</h3>
          </div>
          <div class="row d-flex justify-content-center ">
            <a href="https://vaww.cdw.va.gov/sites/security/request/Pages/register.aspx" target="_blank"><u>Link to BISL PHI/PII Access Request</u></a>
          </div>

        </div>

      <!-- Show table only with PHIPII -->
      <div v-else-if="!selectedSiteVISNorNATIONAL">
          
        <!-- Section Header -->
        <div class="row d-flex justify-content-center ">
          <h4 class="section-head">Consult Details</h4>
        </div>
        <!-- ConsultsDetails FAQ -->
        <div style="align-items: center; display: flex; justify-content: center; ">
          <div style="width: 60%; margin-bottom: 10px;">
           <VueFaqAccordion :items="consultDetails"/> 
          </div>
        </div>

       <!-- Consult Details Table Data -->
        <div class="row"> 
          <div class="col-md-12">
            <card>
              <template slot="header">
                <span>Consult Details (Hover Over a Header to Filter the Column)</span>
                <button class="float-right" @click="gridOptions.api.exportDataAsCsv()">Export to CSV</button>
              </template>
                <ag-grid-vue style="font-size: 12px; height: 500px" class="ag-theme-balham grid" 
                :gridOptions="gridOptions" 
                :rowData="rowData" 
                :gridReady="onGridReady"
                :enableFilter="true"
                :enableSorting="true"
                :enableColResize="true"
                >
                </ag-grid-vue>
                <!-- :rowDataChanged="onRowDataChanged" -->
              <template slot="footer">
                <div class="legend">
                  Detailed Consult Listing
                </div>
              </template>
            </card>
          </div>

        </div>
      <!-- Display if PHIPII -->
      </div> 

        <!-- <div class="row">

          <div class="col-md-8">
            <chart-card :chart-data="lineChart.data" :chart-options="lineChart.options" :responsive-options="lineChart.responsiveOptions">
              <template slot="header">
                <h4 class="card-title">Users Behavior</h4>
                <p class="card-category">24 Hours performance</p>
              </template>
              <template slot="footer">
                <div class="legend">
                  <i class="fa fa-circle text-info"></i> Open
                  <i class="fa fa-circle text-danger"></i> Click
                  <i class="fa fa-circle text-warning"></i> Click Second Time
                </div>
                <hr>
                <div class="stats">
                  <i class="fa fa-history"></i> Updated 3 minutes ago
                </div>
              </template>
            </chart-card>
          </div>

          <div class="col-md-4">
            <chart-card :chart-data="pieChart.data" chart-type="Pie">
              <template slot="header">
                <h4 class="card-title">Email Statistics</h4>
                <p class="card-category">Last Campaign Performance</p>
              </template>
              <template slot="footer">
                <div class="legend">
                  <i class="fa fa-circle text-info"></i> Open
                  <i class="fa fa-circle text-danger"></i> Bounce
                  <i class="fa fa-circle text-warning"></i> Unsubscribe
                </div>
                <hr>
                <div class="stats">
                  <i class="fa fa-clock-o"></i> Campaign sent 2 days ago
                </div>
              </template>
            </chart-card>
          </div>

        </div> -->

        <!-- <div class="row">

                <div class="col-md-6">
                  hello there!!!!!!!!!!!!!!!!!!!!!!!
                  {{ pieOptions.title.text }}
                </div>
        
            </div> -->

        <!-- <div class="row">
          <div class="col-md-6">
            <chart-card :chart-data="barChart.data" :chart-options="barChart.options" :chart-responsive-options="barChart.responsiveOptions" chart-type="Bar">
              <template slot="header">
                <h4 class="card-title">2014 Sales</h4>
                <p class="card-category">All products including Taxes</p>
              </template>
              <template slot="footer">
                <div class="legend">
                  <i class="fa fa-circle text-info"></i> Tesla Model S
                  <i class="fa fa-circle text-danger"></i> BMW 5 Series
                </div>
                <hr>
                <div class="stats">
                  <i class="fa fa-check"></i> Data information certified
                </div>
              </template>
            </chart-card>
          </div> -->

          <!-- <div class="col-md-6">
            <card>
              <template slot="header">
                <h5 class="title">Tasks</h5>
                <p class="category">Backend development</p>
              </template>
              <l-table :data="tableData.data" :columns="tableData.columns">
                <template slot="columns"></template>

                <template slot-scope="{row}">
                  <td>
                    <Checkbox v-model="row.checked"></Checkbox>
                  </td>
                  <td>{{row.title}}</td>
                  <td class="td-actions text-right">
                    <button type="button" class="btn-simple btn btn-xs btn-info" v-tooltip.top-center="editTooltip">
                      <i class="fa fa-edit"></i>
                    </button>
                    <button type="button" class="btn-simple btn btn-xs btn-danger" v-tooltip.top-center="deleteTooltip">
                      <i class="fa fa-times"></i>
                    </button>
                  </td>
                </template>
              </l-table>
              <div class="footer">
                <hr>
                <div class="stats">
                  <i class="fa fa-history"></i> Updated 3 minutes ago
                </div>
              </div>
            </card> -->

          <!-- </div>
        </div> -->
      </div>
      
      <!-- dialog for comments -->
      <modals-container />
      
      <v-dialog />
      <!-- <modal name="Comment">{{ comments }}</modal> -->
      <!-- <modal name="Comment"/> -->

    </div>
  </transition>
</template>
<script>
// import ChartCard from 'src/components/UIComponents/Cards/ChartCard.vue'
import StatsCard from 'src/components/UIComponents/Cards/StatsCard.vue'
import Card from 'src/components/UIComponents/Cards/Card.vue'
// import LTable from 'src/components/UIComponents/Table.vue'
// import Checkbox from 'src/components/UIComponents/Inputs/Checkbox.vue'

import VueHighcharts from 'vue2-highcharts'
// import GridTable from 'src/components/UIComponents/GridTable'
import Vue from "vue";
import { AgGridVue } from "ag-grid-vue";
import dateFormat from "dateformat"

import VueFaqAccordion from 'vue-faq-accordion'
import {consultsAll,
      consultsUniquesAndStatuses,
      consultDetails } from '../Documentation/consults_doc.js'

import { mapState, mapGetters, mapActions } from 'vuex'

import { addCommas } from 'src/utils'

// helpers
const isMatch = (oldOne, newOne) => { return oldOne == newOne }
      
export default {
  components: {
    // Checkbox,
    Card,
    // LTable,
    // ChartCard,
    StatsCard,
    VueHighcharts,
    // GridTable,
    AgGridVue,
    VueFaqAccordion
  },
  data() {
    return {
      gridOptions: null,
      cardClickedConsultStatus: '',
      togglingCardStatus: false,
      pieSliceSelected: '',
      comments: '',
      
      // Consult FAQ
      consultsAll: consultsAll,
      consultsUniquesAndStatuses: consultsUniquesAndStatuses,
      consultDetails: consultDetails,
    }
  },
  beforeMount() { 
    
    this.gridOptions = {
      columnDefs: this.createColDefs(),
      rowData: this.rowData, // computed prop
      onFilterChanged: function() {console.log('filter changed!!')},
      suppressPropertyNamesCheck: true,
      rowSelection: 'single',
      onSelectionChanged: this.onSelectionChanged,
      onCellClicked: this.onCellClicked,
      overlayLoadingTemplate: '<span class="ag-overlay-loading-center">Consult Comments Loading ...</span>',
    }
  },
  watch: {
    siteConsultPieChartSeries(newVal, oldVal) {
      // console.log('siteConsultPieChartSeries watcher triggered - oldVal: ', oldVal )
      // console.log('siteConsultPieChartSeries watcher triggered - newVal: ', newVal )
    },
    selectedRange(newVal, oldVal) {
      // console.log('Oh, range change from: ', oldVal)
      // console.log('Oh, range change to: ', newVal)
      // doesn't work, not sure why not
      // this.asyncValue(0) // reset the card data to show 'Loading ...'
    }
  },
  computed: {
    ...mapState([
      'selectedSite', 
      'selectedRange',
      'phipii',
      'selectedInstitutions',
      'selectedInstitutionsNames',
      'disclaimer',
      'dataError',
    ]),
    ...mapGetters([
      'siteConsultTotal',
      'siteConsultPatientTotal',
      'siteConsultActiveTotal',
      'siteConsultPendingTotal',
      'siteConsultPieChartSeries',
      'siteConsultLineChartSeries',
      'siteConsultDetails',
      'getRunMode',

    ]),
    selectedSiteVISNorNATIONAL () {
      return /VISN|NATIONAL/.test(this.selectedSite)
    },
    changeBackgroundColor () {
    // console.log('in changeBackgroundColor selectedInstitutions is: ', this.selectedInstitutions)
    return this.selectedInstitutions.length > 0 || false
    },      
    scrollPosition () {
      console.log('window.pageYOffset: ', window.pageYOffset)    
    },
    cardStatusTextPending () {
      return {
        'text-big' : this.cardClickedConsultStatus === 'PENDING' &&
          !this.togglingCardStatus
      }
    },
    cardStatusTextActive () {
      return {
        'text-big' : this.cardClickedConsultStatus === 'ACTIVE' &&
          !this.togglingCardStatus
      }
    },
    // add another of these computeds for new status card active display
    cardStatusIconPending () {
      return {
        'icon-danger' : true,
        'icon-big': this.cardClickedConsultStatus === 'PENDING' &&
          !this.togglingCardStatus
      }
    },
    // referenced by consult status card
    cardStatusIconActive () {
      return {
        'icon-info' : true,
        'icon-big': this.cardClickedConsultStatus === 'ACTIVE' &&
          !this.togglingCardStatus
      }
    },
    rowData () {
      return this.siteConsultDetails // filters when site changes
    },
    pieChartOptions (vm) {
      return {
        chart:      { type: "pie", 
                      options3d: { enabled: true, alpha: 45 }},
        title:      { text: 'Consult Status' },
        subtitle:   { text: 'Hover over sections for Consult Status data' },
        credits:    { enabled: false },
        plotOptions: { pie: { innerSize: 100, depth: 45 },
                       series: { allowPointSelect: true }},
        series: [
          {
            name: "consults statuses",
            point:{
              events:{
                  click: function (event) {
                    // pull status name of pie slice clicked
                    let pieSliceClicked = this.name
                    // send pie slice status name to handler
                    vm.pieClickHandler(pieSliceClicked)

                  }
              }
            },
            data: this.siteConsultPieChartSeries,
            dataLabels: {
            formatter: function () {
              // console.log('this.point is: ', this.point)
              return this.point.name + ':<br/>' + '(' + this.y + ')'
              // return `${this.point.name}:<br/>(${this.y})`
            }
          }
          }
        ]
      }
    },
    lineChartOptions () {
      return {
        chart: {  type: "spline" },
        title: {  text: 'Consults Over Time' },
        subtitle: {  text: "Monthly Consults Over the Last Year" },
        xAxis: {
          categories: this.siteConsultLineChartSeries.months
        },
        yAxis: {
          title: { text: "Monthly Consults" },
          labels: {
            formatter: function() { return this.value; }
          }
        },
        tooltip: { crosshairs: true, shared: true },
        credits: { enabled: false },
        plotOptions: {
          spline: {
            marker: { radius: 4, lineColor: "#666666", lineWidth: 1 }
          },
          series: {
            dataLabels: {
              enabled: true
            }
          }
        },
        series: [{
          name: 'Monthly Consults',
          data: this.siteConsultLineChartSeries.series
        }]
      }
    }
  },
  mounted() {
    this.CURRENT_PAGE('consults')

    // action gets Consult Details from server
    this.CONSULT_DETAILS()
    this.CONSULT_DATA()
    // potentially trigger USER_PERMISSIONS here
    //this.USER_PERMISSIONS()
    // don't get institutions for consults
    // this.GET_INSTITUTIONS()

  },
  methods: {
    ...mapActions([
      'CONSULT_DETAILS',
      'CONSULT_DATA',

      'CURRENT_PAGE',
      // 'GET_INSTITUTIONS', // no need if not filtering
    ]),
    addCommas,
    asyncValue(val) {
      // show 'Loading..' with default value set to 0
      let v = val == 0 ? 'Loading...' : val
      // then, if no resulting numbers (Pending can return nothing)
      // change 'Loading...' to show 0
      return v == 'Loading...' ? 0 : v
    },
    show (comments) { //simple dialog box for now
      // console.log('in show getting these comments: ', comments)
      this.comments = comments
      // console.log('calling dialog now!') 
      this.$modal.show('dialog', {
        title: 'Consult Comments',
        text: this.comments
      })
      // this.$modal.show('Comment', { hello: 'hello'})
      // this.$modal.show('Comment', {
      //   template: `
      //     <div>
      //       <h4>Hello</h4>
      //       <p>{{ comments }}</p>
      //     </div>
      //   `,
      //   props: ['comments']
      // }, {
      //   comments: 'this is a comment'
      // },
      // {
      //   height: 'auto'
      // })

    },
    pieClickHandler(status) {
      // pie clicked, needs handling
      console.log('in pieClickHandler')

      // is this a toggled pie click
      let prev = this.pieSliceSelected
      let curr = status
      let isToggling = isMatch(prev, curr)

      if (isToggling) {
        // already handled
        console.log('toggling pie slices')
        // turn off card status flag for toggling pie status 
        this.cardClickedConsultStatus = ''

      } else {
        // new slice nee
        console.log('new pie slices selected')
        // update card status flag for this pie status 
        this.cardClickedConsultStatus = status
      }
      // update pieSliceSelected
      this.pieSliceSelected = status
      
      // update consult details filter for this pie status 
      this.filterConsultDetails(status, isToggling)
    
    },
    updatePieSlice(status, isToggle) {
      console.log('in updatePieSlice')
      // reference to the pie chart
      const { chart } = this.$refs.pieChart
      // pie chart data series array
      const dataSeries = chart.series[0].data

      // use for of looping instead of the filter
      for (var pieSlice of dataSeries) {
        let matchesCardStatus = isMatch(status, pieSlice.name)
        let thisPieSliceStatusIsActive = pieSlice.selected
        let thisPieSliceStatus = pieSlice.name
        let shouldDeselectActivePieSlice = thisPieSliceStatusIsActive && matchesCardStatus && isToggle
        let shouldSelectActivePieSlice = (thisPieSliceStatus == status) && !isToggle

        if (shouldDeselectActivePieSlice) { // existing pie slice
            console.log('toggling - deselecting pieslice ', status)
            pieSlice.select(null)
            // reset component data
            this.pieSliceSelected = ''
            break // no need to keep looking
        }

        if( shouldSelectActivePieSlice ) { // toggline
          console.log('noToggling - new status of ', status)        
          pieSlice.select()
          // set component data
          this.pieSliceSelected = status
          break // no need to keep looking
        }
      }
    },
    updateConsultDetailsFilter(status, toToggle) {
      console.log('in updateConsultDetailsFilter')
      if (toToggle) {
        console.log('SAME STATUS CLICKED- toggling off Consult Details filter')
        // toggle Consult Details filter off
        this.filterConsultDetails(null)

      } else {  // not toggle, so new status
        console.log('NEW STATUS ', status)
        // set card consult status flag
        this.cardClickedConsultStatus = `${status}`
        // use status to filter consult details table
        this.filterConsultDetails(status)

      }

    },
    onSelectionChanged() { // click in the Consult Details ag-grid
      
      // call store action to retrieve consult comments for this consultSID

    },
    onReady() {
      console.log('onReady');
    },
    onCellClicked(event) {
      // console.log('onCellClicked: ' + event.rowIndex + ' ' + event.colDef.field);
      // var focusedCell = this.gridOptions.api.getFocusedCell()
      // console.log('is there a focused cell? ', focusedCell)

      var selectedRows = this.gridOptions.api.getSelectedRows()
      var clickedField = event.colDef.field
      var orderStatus = selectedRows[0].OrderStatus
      var permission = this.$store.state.phipii
      var consultCommentRequested = clickedField === 'OrderStatus' && 
        (orderStatus === 'ACTIVE' || orderStatus === 'PENDING' || orderStatus === 'SCHEDULED')
      var consultCommentInvalidRequest = clickedField === 'OrderStatus' && 
        (orderStatus !== 'ACTIVE' || orderStatus !== 'PENDING' || orderStatus !== 'SCHEDULED')
      // check if a non-linked cell was clicked
      // if (clickedField !== 'OrderStatus' || consultCommentInvalidRequest) {
      //   this.show('You May Only Click on a Blue Underlined Status to see Consult Comments!')
      // }
      console.log('consultCommentRequested is: ', consultCommentRequested)
      console.log('consultCommentInvalidRequest is: ', consultCommentInvalidRequest)

      if ( consultCommentRequested && permission == 1) {
        // need cell and row 
        var ConsultSID = selectedRows[0].ConsultSID
    
        this.gridOptions.api.showLoadingOverlay()

        if (!permission) {

        }
        this.$store.dispatch('getSelectedConsultComments', ConsultSID)
        .then((comments) => {  
          // console.log('comments from API: ', comments)
          // console.log('comments from API array length ', comments.length)
          let commentsFormatted = ''
          
          if (Array.isArray(comments) ) { // should be an array of comments
            // console.log('what is the comments in the array? ', comments)
            if (comments.length > 0 ) { 
              let commentsString = comments[0].ConsultActivityComments
              commentsFormatted = commentsString === null ?
              'No Comments' : commentsString.split('|').join('<br/><br/>') 
            } else {
              commentsFormatted = 'No Comments'
            }
          }
          else { // not an array
            // error - something unexpected returned
            commentsFormatted = 'Problem Getting Consult Comments<br/><br/> Contact Administration elliot.m.fielstein@va.gov'
          }

          // show dialog with comments
          this.gridOptions.api.hideOverlay(); // hide loading indicator now
          this.show(commentsFormatted) // call dialog and show comments
  
        })
      } else if (clickedField !== 'OrderStatus') {
        // did not click on the 'OrderStatus' field
        this.show('Only the Status field on this table may be clicked!')
      } else { 
        // no permission to view PII
        this.show('Viewing Consult Comments Requires PHI/PII Permissions!')
      }      
    },
    clickedCard(status) {

      //determine if click is toggling status
      const toToggle = this.cardClickedConsultStatus == status
      this.togglingCardStatus = toToggle // update component
      console.log('in clickedCard toToggle is ', toToggle)

      // update consult detail table filter
      this.updateConsultDetailsFilter(status, toToggle)

      // update pie slice
      this.updatePieSlice(status, toToggle)
      
    },
    filterConsultDetails(status, isToggling) {

      console.log('filterConsultDetails gets ', status)
      let statusFilter = {}
      // define the ag-grid filter status
      if (!isToggling && status !== null ) {
        console.log('statusFilter is being set because status is ', status)
        statusFilter = {
          OrderStatus: { type: 'equals', filter: `${status}` }
        }
      } else {
        console.log('statusFilter is not being set because status is ', status)
        statusFilter = null
      }
      // set the ag-grid filter programmatically
      this.gridOptions.api.setFilterModel(statusFilter)
      this.gridOptions.api.onFilterChanged()
     

      // country: ['Ireland', 'United States'],
      // age: {type: 'lessThan', filter: '30'},
      // athlete: {type: 'startsWith', filter: 'Mich'},
      // date: {type: 'lessThan', dateFrom: '2010-01-01'}
      // console.log('can this format work ', `"${status}"` )
    },
    createColDefs() {
      return [
        {headerName: "Consults",
          children: [
            { headerName: "Site", 
              field: "StaPa", 
              width: 40, 
              cellStyle: { 'text-align': "left" } ,
              filter: "agTextColumnFilter"
            },
            { headerName: "From Location", 
              field: "InstitutionName", 
              width: 100, 
              cellStyle: { 'text-align': "left" } 
            },
            { headerName: "Consult", 
              field: "RequestDateTime", 
              width: 80, 
              cellStyle: { 'text-align': "left" },
              filter: "agDateColumnFilter",
              filterParams: {
                comparator: (filterLocalDateAtMidnight, cellValue) => {
                  var dateAsString = cellValue
                  if (dateAsString == null) return -1
                  var cellDate = new Date(dateAsString)

                  if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
                    // console.log('Equal', cellValue)
                    return 0
                  }
                  if (cellDate < filterLocalDateAtMidnight) {
                    // console.log('Less Than', cellValue)
                    return -1
                  }
                  if (cellDate > filterLocalDateAtMidnight) {
                    // console.log('Greater Than', cellValue)
                    return 1
                  }
                }
              }
            },
            { headerName: "Patient", 
              // field: "InitialsAndL4", 
              field: "NL4",               
              width: 70, 
              cellStyle: { 'text-align': "left" },
              // filter: "agtextColumnFilter" 
            },
            { headerName: "Requested Service", 
              field: "ToRequestServiceName",
              width: 125, 
              cellStyle: { 'text-align': "left" } 
            },
            { headerName: "Status", 
              field: "OrderStatus",
              width: 60, 
              cellStyle: { 'text-align': "left" } ,
              filter: "agTextColumnFilter",
              cellRenderer: (params) => {
                let comments = params.data.ConsultActivityComments
                // console.log('checking the consult comments in consult details: ', comments)
                if ((params.value === 'PENDING' || params.value === 'ACTIVE' || params.value === 'SCHEDULED')) {
                  // console.log('status: ', params.value)
                  // console.log('comments: ', comments)
                  if (comments == 1) { // there are comments for this consult
                    const link = document.createElement("a")
                    link.innerText = params.value
                    link.href = ''
                    link.style.textDecoration = "underline"
                    link.addEventListener("click", e => {
                      // console.log('click event params? ', params)
                      e.preventDefault();
                      // console.log('click event is: ', e)
                      // console.log('clicked on : ', params.value)
                    
                    })
                    return link; // link to get comments        
                  }
                }
                return params.value // return status w/ no link
              }
            },
          ]
        },
        //  {headerName: "Appointments",
        //     children: [
        //       { headerName: "Appt", 
        //         field: "AppointmentDateTime", 
        //         width: 75, 
        //         cellStyle: { 'text-align': "left" },
        //         filter: "agDateColumnFilter",
        //         columnGroupShow: "open" 
        //       },
        //       // { headerName: "Wait", 
        //       //   field: "WaitTime", 
        //       //   width: 40, 
        //       //   cellStyle: { 'text-align': "left" } ,
        //       //   filter: "agNumberColumnFilter"
        //       // },
        //       { headerName: "Status", 
        //         field: "RowCategory",
        //         width: 150, 
        //         cellStyle: { 'text-align': "left" } ,
        //         filter: "agTextColumnFilter",
        //         columnGroupShow: "open" 
        //       },
        //       { headerName: "Patient", 
        //         field: "PatientName",
        //         width: 70, 
        //         cellStyle: { 'text-align': "left" } ,
        //         filter: "agTextColumnFilter",
        //         columnGroupShow: "open" 
        //       },
        //       { headerName: "Clinic", 
        //         field: "LocationName",
        //         width: 70, 
        //         cellStyle: { 'text-align': "left" } ,
        //         filter: "agTextColumnFilter",
        //         columnGroupShow: "open" 
        //       },
        //       { headerName: "Staff", 
        //         field: "StaffName",
        //         width: 70, 
        //         cellStyle: { 'text-align': "left" } ,
        //         filter: "agTextColumnFilter",
        //         columnGroupShow: "open" 
        //       },
        //     ]
        //  }
        // { headerName: "D/C", field: "ConsultFactorType",width: 25, cellStyle: { 'text-align': "left" }, filter: "agTextColumnFilter" },
        // { headerName: "D/C Comment", field: "ConsultFactorText",width: 70, cellStyle: { 'text-align': "left" }, tooltipField: "CONSULTFACTORTEXT" }
      ]
    },
    onGridReady() {
      // console.log('onGridReady fired!')
      this.gridOptions.api.sizeColumnsToFit();
    },
    // onRowDataChanged() {
    //   console.log('row data changed!!')
    //   Vue.nextTick(() => {
    //     this.gridOptions.api.sizeColumnsToFit();
    //   });
    // }
  }
  // data() {
  //   return {
  //     gridOptions: null

  //     editTooltip: 'Edit Task',
  //     deleteTooltip: 'Remove',
      
  //     lineOptions: {
  //       chart: {  type: "spline" },
  //       title: {  text: 'Consults Over Time' },
  //       subtitle: {  text: "Monthly Consults Over the Last Year" },
  //       xAxis: {
  //         categories: ["Jan","Feb","Mar","Apr","May","Jun",
  //           "Jul","Aug","Sep","Oct","Nov","Dec"
  //         ]
  //       },
  //       yAxis: {
  //         title: { text: "Monthly Consults" },
  //         labels: {
  //           formatter: function() { return this.value; }
  //         }
  //       },
  //       tooltip: { crosshairs: true, shared: true },
  //       credits: { enabled: false },
  //       plotOptions: {
  //         spline: {
  //           marker: { radius: 4, lineColor: "#666666", lineWidth: 1 }
  //         }
  //       },
  //       series: [{
  //         name: 'Monthly Consults',
  //         data: [
  //           22361,20777,23470,16856,22840,23383,21351,
  //           25153,21758,23523,21599,19590
  //         ]
  //       }]
  //     },
          
  //     tableData: {
  //       data: [
  //         { title: 'Sign contract for "What are conference organizers afraid of?"', checked: false },
  //         { title: 'Lines From Great Russian Literature? Or E-mails From My Boss?', checked: true },
  //         {
  //           title: 'Flooded: One year later, assessing what was lost and what was found when a ravaging rain swept through metro Detroit',
  //           checked: true
  //         },
  //         { title: 'Create 4 Invisible User Experiences you Never Knew About', checked: false },
  //         { title: 'Read "Following makes Medium better"', checked: false },
  //         { title: 'Unfollow 5 enemies from twitter', checked: false }
  //       ]
  //     }
  //   }
  // }

  // updateSeries() {
  //     console.log('updateSeries called')
  //     this.$refs.pieChart.showLoading()
  //     this.pieOptions.title.text = `Consult Status for ${this.selectedSite}`
  //     this.pieOptions.subtitle.text = `Consult Status for ${this.selectedRange}`
  //     this.pieOptions.series[0].data = this.sitePieChartSeries
  //     this.$refs.pieChart.delegateMethod('update', this.pieOptions )
  //     this.$refs.pieChart.hideLoading()
  //   },
}
</script>

<style scoped>
  .filtering {
    background-color: lightgrey;
  }

  .icon-big {
    /* enlarge icon after clicked */
    font-size: 1.5em;
  }
  .text-big { 
    /* enlarge text size and change font color after clicked */
    font-weight: 800;
    color: green;
  }

  .section-head {
    font-size: 2rem;
  }

  .phipii-warning {
    font-size: 1rem;
  }

  /* fade page in and out when site changes */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity .1s
  }

  .fade-enter,
  .fade-leave-to
    /* .fade-leave-active in <2.1.8 */

  {
    opacity: 0
  }
</style>



