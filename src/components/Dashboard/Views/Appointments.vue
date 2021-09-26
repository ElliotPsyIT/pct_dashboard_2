<template>
  <transition name="fade" mode="out-in">
    <div
      class="content"
      :key="selectedRange"
      :class="{ 'provider-selected': siteProviderSelected }"
    >
      <!-- <button class="btn btn-danger float-right">Button</button> -->
      <div
        class="container-fluid"
        :class="{ filtering: changeBackgroundColor }"
      >
        Scroll Position {{ scrollPosition }}

        <!-- Show Filtered Sites -->
        <div v-if="changeBackgroundColor">
          <div
            class="row d-flex justify-content-center"
            style="position: fixed; right: 50px; z-index: 500"
          >
            <div style="font-size: 0.7rem; border: solid 1px grey">
              {{ selectedInstitutionsNames }}
            </div>
          </div>
        </div>

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

        <hr />

        <!-- Section Header -->
        <div class="row d-flex justify-content-center">
          <h4 class="section-head">No Show & Cancel Summary Stats</h4>
        </div>

        <!-- appointmentNoShowCancelSummary FAQ -->
        <div
          style="align-items: center; display: flex; justify-content: center"
        >
          <div style="width: 60%; margin-bottom: 10px">
            <VueFaqAccordion :items="appointmentNoShowCancelSummary" />
          </div>
        </div>

        <div class="row d-flex justify-content-center">
          <div class="col-xl-3 col-md-3">
            <stats-card>
              <div slot="header" class="icon-danger">
                <i class="nc-icon nc-chart-pie-36 text-danger"></i>
              </div>
              <div slot="content">
                <p class="card-category">
                  No Show/All<br />
                  ({{ formatNumber(siteEncounterApptNoShowTotal) }}/{{
                    siteEncounterApptTotalStr
                  }})
                </p>
                <h4 class="card-title">
                  {{ notNumber(siteEncounterAppNoShowPercent) }}%
                </h4>
              </div>
            </stats-card>
          </div>

          <div class="col-xl-3 col-md-3">
            <stats-card>
              <div slot="header" class="icon-info">
                <i class="nc-icon nc-simple-remove text-danger"></i>
              </div>
              <div slot="content">
                <p class="card-category">
                  Cancelled/All ({{
                    formatNumber(siteEncounterApptCancelTotal)
                  }}/{{ siteEncounterApptTotalStr }})
                </p>
                <h4 class="card-title">
                  {{ notNumber(siteEncounterAppCancelPercent) }}%
                </h4>
              </div>
            </stats-card>
          </div>
        </div>

        <div class="row d-flex justify-content-center">
          <!-- :class="(siteProviderSelected ? 'provider-selected' : '')" -->

          <div class="col-md-8">
            <template>
              <vue-highcharts :options="pieChartOptions" ref="pieChart">
              </vue-highcharts>
            </template>
          </div>
        </div>

        <div v-if="!phipii && !selectedSiteVISNorNATIONAL">
          <!-- Section Header -->
          <!-- Section Header -->
          <div class="row d-flex justify-content-center">
            <h4 class="section-head">Clinic Level Cancel & No Show Summary</h4>
          </div>
          <div class="row d-flex justify-content-center">
            <h3 class="phipii-warning">
              Privileges Required to View Patient Level Data for Station
              <b>{{ selectedSite }}</b> - Request Link Below
            </h3>
          </div>
          <div class="row d-flex justify-content-center">
            <a
              href="https://vaww.cdw.va.gov/sites/security/request/Pages/register.aspx"
              target="_blank"
              ><u>Link to BISL PHI/PII Access Request</u></a
            >
          </div>
        </div>

        <!-- Show table only with PHIPII -->
        <div v-else-if="phipii">
          <!-- Section Header -->
          <div class="row d-flex justify-content-center">
            <h4 class="section-head">Clinic Level Cancel & No Show Summary</h4>
          </div>

          <!-- appointmentNoShowCancelByClinicTable FAQ -->
          <div
            style="align-items: center; display: flex; justify-content: center"
          >
            <div style="width: 60%; margin-bottom: 10px">
              <VueFaqAccordion :items="appointmentNoShowCancelByClinicTable" />
            </div>
          </div>

          <!-- Clinic & NoShow - Detailed CPT Categories Table -->
          <div class="d-flex flex-row justify-content-center">
            <div class="col-md-12">
              <card>
                <template slot="header">
                  <span>Hover Over Column Header to View Menu</span>
                  <button class="float-right" @click="exportCSVgridOptions3">
                    Export to CSV
                  </button>
                </template>
                <!-- {{siteEncounterApptProviderClinicNoShowTotal}} -->
                <ag-grid-vue
                  style="font-size: 12px; height: 400px"
                  class="ag-theme-balham grid"
                  :gridOptions="gridOptions3"
                  :rowData="rowData3"
                  :gridReady="onGridReady3"
                  :enableFilter="true"
                  :enableSorting="true"
                  :enableColResize="true"
                >
                </ag-grid-vue>
                <template slot="footer">
                  <div class="legend">Detailed CPT Categories Listing</div>
                </template>
              </card>
            </div>
          </div>
        </div>
        <!-- PHI -->
      </div>
    </div>
  </transition>
</template>

<script>
import ChartCard from "src/components/UIComponents/Cards/ChartCard.vue";
import StatsCard from "src/components/UIComponents/Cards/StatsCard.vue";
import Card from "src/components/UIComponents/Cards/Card.vue";
import LTable from "src/components/UIComponents/Table.vue";
import Checkbox from "src/components/UIComponents/Inputs/Checkbox.vue";

import VueHighcharts from "vue2-highcharts";

import Vue from "vue";
import { AgGridVue } from "ag-grid-vue";

import { addCommas, totalAndPercent } from "src/utils";

import VueFaqAccordion from "vue-faq-accordion";
import {
  appointmentNoShowCancelSummary,
  appointmentNoShowCancelByClinicTable,
} from "../Documentation/appointments_doc.js";

import { mapState, mapGetters, mapActions } from "vuex";

export default {
  name: "encounters",
  components: {
    Card,
    ChartCard,
    StatsCard,
    VueHighcharts,
    AgGridVue,
    VueFaqAccordion,
  },
  computed: {
    ...mapState([
      "selectedSite",
      "selectedRange",
      "whitelisted",
      "phipii",
      "selectedInstitutions",
      "selectedInstitutionsNames",
      "disclaimer",
      "dataError",
    ]),
    ...mapGetters([
      "siteEncounterApptClinicNoShowTotal",
      "siteEncounterApptCancelNoShowPieChart",
      "siteEncounterApptNoShowTotal",
      "siteEncounterApptCancelTotal",
      "siteEncounterApptTotalStr", // for display
      "siteEncounterApptTotal", // for computation
      "siteProviderSelected",
    ]),
    selectedSiteVISNorNATIONAL() {
      // console.log('in selectedSiteVISNorNATIONAL, selectedSite is: ', this.selectedSite)
      return /VISN|NATIONAL/.test(this.selectedSite);
    },
    changeBackgroundColor() {
      // console.log('in changeBackgroundColor selectedInstitutions is: ', this.selectedInstitutions)
      return this.selectedInstitutions.length > 0 || false;
    },

    scrollPosition() {
      console.log("window.pageYOffset: ", window.pageYOffset);
    },

    siteEncounterAppNoShowPercent() {
      return Math.round(
        (this.siteEncounterApptNoShowTotal / this.siteEncounterApptTotal) * 100
      );
    },

    siteEncounterAppCancelPercent() {
      return Math.round(
        (this.siteEncounterApptCancelTotal / this.siteEncounterApptTotal) * 100
      );
      // return precise_round((this.siteEBPSessionsPECPT/this.siteALLSessions) * 100, 1)
    },
    pieChartOptions() {
      return {
        chart: {
          type: "pie",
          options3d: { enabled: true, alpha: 45 },
          // borderColor: '#EBBA95',
          // borderWidth: 2,
          // type: "line"
        },
        title: { text: "Cancel No Show Totals" },
        subtitle: { text: "Hover over sections for Patient data" },
        credits: { enabled: false },
        plotOptions: {
          pie: { innerSize: 100, depth: 45 },
          series: { allowPointSelect: true },
        },
        series: [
          {
            name: "patient totals",
            events: {
              click: function (event) {
                console.log("pie slice clicked, here is event: ", event);
                let points = this.chart.getSelectedPoints();
                console.log("getSelectedPoints: ", typeof points[0]);
              },
            },
            data: this.siteEncounterApptCancelNoShowPieChart,
            dataLabels: {
              formatter: function () {
                // console.log('this.point is: ', this.point)
                return this.point.name + ":<br/>" + "(" + this.y + ")";
                // return `${this.point.name}:<br/>(${this.y})`
              },
            },
          },
        ],
      };
    },
    rowData3() {
      return this.siteEncounterApptClinicNoShowTotal;
    },
  },
  beforeMount() {
    this.gridOptions3 = {
      columnDefs: this.createColDefs3(),
      rowData: this.rowData, // computed prop
      suppressPropertyNamesCheck: true,
      onRowDataChanged: this.onRowDataChanged,
      overlayLoadingTemplate:
        '<span class="ag-overlay-loading-center">Appointment Details Comments Loading ...</span>',
    };
  },
  mounted() {
    this.APPOINTMENT_CLINIC_CANCEL_NOSHOW_TOTALS();
    this.APPOINTMENT_CANCEL_NOSHOW_TOTALS();
    this.APPOINTMENT_COUNT();

    this.CURRENT_PAGE("appointments");
    this.GET_INSTITUTIONS();
  },
  methods: {
    ...mapActions([
      "APPOINTMENT_CLINIC_CANCEL_NOSHOW_TOTALS",
      "APPOINTMENT_CANCEL_NOSHOW_TOTALS",
      "APPOINTMENT_COUNT",

      "CURRENT_PAGE",
      "GET_INSTITUTIONS",
    ]),
    asyncValue(val) {
      return val == 0 ? "Loading..." : val;
    },
    notNumber(val) {
      // this.$nextTick(
      return isNaN(val) ? "Loading..." : val;
      // )
    },
    formatNumber(num) {
      return addCommas(num);
    },
    exportCSVgridOptions3() {
      this.gridOptions3.api.exportDataAsCsv({
        processCellCallback: (params) => {
          // console.log("params.data is: ", params);
          // if (params.column.colId == "CancelNoShowCount") {
          //   // need params.node.data to access the grid columns
          //   // see below in cellRenderer for similar formating of output values
          //   let cancelnoshowcount = params.data.CancelNoShowCount;
          //   let appointmentTot = params.data.ClinicAppointmentTotal;
          //   let cancelnoshowPercent = Math.round(
          //     (cancelnoshowcount / appointmentTot) * 100
          //   );
          //   return `${cancelnoshowcount}`;
          // }
          return params.value;
        },
      });
    },
    createColDefs3() {
      return [
        {
          headerName: "Provider Clinic Cancel NoShow",
          children: [
            {
              headerName: "Site",
              field: "StaPa",
              width: 15,
              cellStyle: { "text-align": "left" },
              filter: "agTextColumnFilter",
            },
            // { headerName: "Staff",
            //   field: "StaffName",
            //   width: 30,
            //   cellStyle: { 'text-align': "left" } ,
            //   filter: "agTextColumnFilter"
            // },
            {
              headerName: "Clinic",
              field: "LocationName",
              width: 30,
              cellStyle: { "text-align": "left" },
              filter: "agTextColumnFilter",
            },
            {
              headerName: "Appt Type",
              field: "CancelNoShow",
              width: 30,
              cellStyle: { "text-align": "left" },
              filter: "agTextColumnFilter",
            },
            {
              headerName: "Cancel/NS & Visits",
              field: "CancelNoShowCount",
              width: 25,
              cellStyle: { "text-align": "left" },
              filter: "agNumberColumnFilter",
              cellRenderer: (params) => {
                // console.log('params.data is: ', params.data)
                let cancelnoshowcount = params.data.CancelNoShowCount;
                let appointmentTot = params.data.ClinicAppointmentTotal;
                let cancelnoshowPercent = Math.round(
                  (cancelnoshowcount / appointmentTot) * 100
                );

                return `${cancelnoshowcount} (${cancelnoshowPercent}%)`;
              },
            },
            // {
            //   headerName: "% Per Clinic",
            //   colId: 'PercentCancelNsPerClinic',
            //   valueGetter: function(params) {
            //     return ((params.data.CancelNoShow / params.data.ClinicAppointmentTotal) * 100)
            //   }
            // },
            {
              headerName: "Clinic Appts",
              field: "ClinicAppointmentTotal",
              width: 20,
              cellStyle: { "text-align": "left" },
              filter: "agNumberColumnFilter",
            },
            {
              headerName: "Site Appts",
              field: "StaPaTotal",
              width: 20,
              cellStyle: { "text-align": "left" },
              filter: "agNumberColumnFilter",
            },
          ],
        },
      ];
    },
    onGridReady3() {
      this.gridOptions3.api.sizeColumnsToFit();
    },
    onRowDataChanged(event) {
      // console.log('onRowDataChanged event triggered!!')
      this.gridOptions3.api.showLoadingOverlay();
      Vue.nextTick(() => {
        this.gridOptions3.api.hideOverlay();
        this.gridOptions3.api.sizeColumnsToFit();
      });
    },
  },
  data() {
    return {
      gridOptions3: null,
      appointmentNoShowCancelSummary,
      appointmentNoShowCancelByClinicTable,
    };
  },
};
</script>

<style>
.filtering {
  background-color: lightgrey;
}

.provider-selected {
  /* border: 4px solid red; */
  background-color: lightgray;
}

.section-head {
  font-size: 2rem;
}

/* fade page in and out when site changes */

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}

.fade-enter,
  .fade-leave-to
    /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>




