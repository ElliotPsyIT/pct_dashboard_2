<template>
  <transition name="fade" mode="out-in">
    <div class="content" :key="selectedSite">
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
        <div class="row d-flex justify-content-center mt-4">
          <p class="category" style="font-size: 0.8rem; font-style: italic">
            <span class="font: red;">{{ disclaimer.asterisks }}</span>
            {{ disclaimer.mainText }}
            <span style="font-weight: bold; text-decoration: underline">{{
              disclaimer.emphasis
            }}</span>
          </p>
          <div v-if="dataError">
            <div
              class="category"
              style="font-style: italic; text-align: center"
            >
              <span
                style="
                  color: red;
                  font-size: 2rem;
                  font-weight: bold;
                  text-align: center;
                  text-decoration: underline;
                "
              >
                WARNING! DATA ERROR TODAY - 2/7/2021
              </span>
              <span
                style="
                  color: red;
                  font-size: 2rem;
                  font-weight: bold;
                  text-align: center;
                  text-decoration: underline;
                "
              >
                WE ARE WORKING TO SOLVE THE PROBLEM
              </span>
            </div>
          </div>
        </div>

        <hr />

        <!-- EBP Headers -->
        <div class="row d-flex justify-content-center">
          <h4 class="section-head">EBPs</h4>
        </div>

        <!-- EBPs FAQ -->
        <div
          style="align-items: center; display: flex; justify-content: center"
        >
          <div style="width: 60%; margin-bottom: 10px">
            <VueFaqAccordion :items="ebps" />
          </div>
        </div>

        <!-- EBP Headers -->
        <!-- Start Row -->
        <div class="row d-flex justify-content-center">
          <div class="col-xl-4 col-md-2">
            <stats-card>
              <div slot="header" class="icon-warning">
                <i class="nc-icon-outline nc-layers-3 text-warning"></i>
              </div>
              <div slot="content">
                <p
                  class="card-category"
                  v-tooltip.top-center="TotalEBPsSessions"
                >
                  Sessions ({{ addCommas(siteEBPSessionsAny) }}/{{
                    addCommas(siteALLSessions)
                  }})
                </p>
                <h4 class="card-title">{{ siteEBPSessionsAnyPercent }}%</h4>
              </div>
            </stats-card>
          </div>

          <div class="col-xl-4 col-md-2">
            <stats-card>
              <div slot="header" class="icon-warning">
                <i class="nc-icon nc-single-02 text-warning"></i>
              </div>
              <div slot="content">
                <p
                  class="card-category"
                  v-tooltip.top-center="TotalEBPsPatients"
                >
                  Patients ({{ addCommas(siteEBPPatientsAny) }}/{{
                    addCommas(siteALLPatients)
                  }})
                </p>
                <h4 class="card-title">{{ siteEBPPatientsAnyPercent }}%</h4>
              </div>
            </stats-card>
          </div>
        </div>
        <!-- End Row -->

        <!-- PEorCPT Headers -->
        <div class="row d-flex justify-content-center">
          <h4 class="section-head">PE or CPT</h4>
        </div>

        <!-- PEorCPT FAQ -->
        <div
          style="align-items: center; display: flex; justify-content: center"
        >
          <div style="width: 60%; margin-bottom: 10px">
            <VueFaqAccordion :items="PEorCPT" />
          </div>
        </div>

        <!-- Individual & Group Tx Headers -->
        <!-- Start Row -->
        <div class="row d-flex justify-content-center">
          <div class="col-xl-4 col-md-2">
            <stats-card>
              <div slot="header" class="icon-warning">
                <i class="nc-icon-outline nc-layers-3 text-warning"></i>
              </div>
              <div slot="content">
                <p
                  class="card-category"
                  v-tooltip.top-center="TotalPECPTSessions"
                >
                  Sessions ({{ addCommas(siteEBPSessionsPECPT) }}/{{
                    addCommas(siteALLSessions)
                  }})
                </p>
                <h4 class="card-title">{{ siteEBPSessionsPECPTPercent }}%</h4>
              </div>
            </stats-card>
          </div>

          <div class="col-xl-4 col-md-2">
            <stats-card>
              <div slot="header" class="icon-warning">
                <i class="nc-icon nc-single-02 text-warning"></i>
              </div>
              <div slot="content">
                <p
                  class="card-category"
                  v-tooltip.top-center="TotalPECPTPatients"
                >
                  Patients ({{ addCommas(siteEBPPatientsPECPT) }}/{{
                    addCommas(siteALLPatients)
                  }})
                </p>
                <h4 class="card-title">{{ siteEBPPatientsPECPTPercent }}%</h4>
              </div>
            </stats-card>
          </div>
        </div>
        <!-- End Row -->

        <hr class="style1" />

        <!-- Section Headers -->
        <div class="row d-flex justify-content-center">
          <h4 class="section-head"></h4>
        </div>

        <!-- EBPs Individual Tx FAQ -->
        <div
          style="align-items: center; display: flex; justify-content: center"
        >
          <div style="width: 60%; margin-bottom: 10px">
            <VueFaqAccordion :items="IndividualAndGroupTxEBPs" />
          </div>
        </div>

        <!-- Section Headers -->
        <div class="row d-flex justify-content-around">
          <h4 class="section-head">Individual Tx EBPs</h4>
          <h4 class="section-head">Group Tx EBPs</h4>
        </div>

        <!-- Start Row -->
        <div class="row d-flex justify-content-center">
          <div class="col-xl-3 col-md-2">
            <stats-card>
              <div slot="header" class="icon-warning">
                <i class="nc-icon-outline nc-layers-3 text-warning"></i>
              </div>
              <div slot="content">
                <p
                  class="card-category"
                  v-tooltip.top-center="IndividualTxEBPSessions"
                >
                  Sessions ({{ addCommas(siteEBPSessionsInd) }}/{{
                    addCommas(siteALLSessionsInd)
                  }})
                </p>
                <h4 class="card-title">{{ siteEBPSessionsIndPercent }}%</h4>
              </div>
            </stats-card>
          </div>

          <div class="col-xl-3 col-md-2">
            <stats-card>
              <div slot="header" class="icon-warning">
                <i class="nc-icon nc-single-02 text-warning"></i>
              </div>
              <div slot="content">
                <p
                  class="card-category"
                  v-tooltip.top-center="IndividualTxEBPPatients"
                >
                  Patients ({{ addCommas(siteEBPPatientsInd) }}/{{
                    addCommas(siteALLPatientsInd)
                  }})
                </p>
                <h4 class="card-title">{{ siteEBPPatientsIndPercent }}%</h4>
              </div>
            </stats-card>
          </div>

          <!-- <div class="row d-flex justify-content-center "> -->
          <div class="col-xl-3 col-md-2">
            <stats-card>
              <div slot="header" class="icon-warning">
                <i class="nc-icon-outline nc-layers-3 text-warning"></i>
              </div>
              <div slot="content">
                <p
                  class="card-category"
                  v-tooltip.top-center="GroupTxEBPSessions"
                >
                  Sessions ({{ addCommas(siteEBPSessionsGrp) }}/{{
                    addCommas(siteALLSessionsGrp)
                  }})
                </p>
                <h4 class="card-title">{{ siteEBPSessionsGrpPercent }}%</h4>
              </div>
            </stats-card>
          </div>

          <div class="col-xl-3 col-md-2">
            <stats-card>
              <div slot="header" class="icon-warning">
                <i class="nc-icon nc-single-02 text-warning"></i>
              </div>
              <div slot="content">
                <p
                  class="card-category"
                  v-tooltip.top-center="GroupTxEBPPatients"
                >
                  Patients ({{ addCommas(siteEBPPatientsGrp) }}/{{
                    addCommas(siteALLPatientsGrp)
                  }})
                </p>
                <h4 class="card-title">{{ siteEBPPatientsGrpPercent }}%</h4>
              </div>
            </stats-card>
          </div>
        </div>
        <!-- End Row -->

        <hr class="style1" />

        <!-- Section Headers -->
        <div class="row d-flex justify-content-center">
          <h4 class="section-head"></h4>
        </div>

        <!-- Section Header -->
        <div class="row d-flex justify-content-center">
          <h4 class="section-head">EBP Activity Summary</h4>
        </div>

        <!-- EBP Activity Summary FAQ -->
        <div
          style="align-items: center; display: flex; justify-content: center"
        >
          <div style="width: 60%; margin-bottom: 10px">
            <VueFaqAccordion :items="ebpActivitySummary" />
          </div>
        </div>

        <!-- Start Row -->
        <div class="row">
          <div class="col-md-6">
            <span v-if="!selectedSiteVISNorNATIONAL">
              <br />
              <card>
                <template slot="header">
                  <!-- <button @click="getSelectedRows()"> Get Selected Rows</button> -->
                  <button
                    class="float-right"
                    @click="gridOptions.api.exportDataAsCsv()"
                  >
                    Export to CSV
                  </button>
                </template>
                <ag-grid-vue
                  style="font-size: 12px; height: 425px"
                  class="ag-theme-balham grid"
                  :gridOptions="gridOptions"
                  :columnDefs="columnDefs"
                  :rowData="rowData"
                  :gridReady="onGridReady"
                  :enableFilter="true"
                  :enableSorting="true"
                  :enableColResize="true"
                  :cellClicked="onCellClicked"
                >
                </ag-grid-vue>
                <!-- :rowDataChanged="onRowDataChanged" -->
                <!-- <template slot="footer">
                <div class="legend">
                  EBP Patient Totals
                </div>
              </template> -->
              </card>
            </span>
          </div>

          <div class="col-md-6">
            <template>
              <vue-highcharts
                :options="pieChartOptions"
                ref="pieChart"
              ></vue-highcharts>
            </template>
          </div>
        </div>
        <!-- End Row -->

        <div v-if="!phipii && !selectedSiteVISNorNATIONAL">
          <!-- Section Header -->
          <div class="row d-flex justify-content-center">
            <h4 class="section-head">
              Providers' EBPs and Surveys By Clinic and Patient
            </h4>
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
            <h4 class="section-head">
              Providers' EBPs and Surveys By Clinic and Patient
            </h4>
          </div>

          <!-- Providers EBPs And Surveys By Clinic And Patient Summary FAQ -->
          <div
            style="align-items: center; display: flex; justify-content: center"
          >
            <div style="width: 60%; margin-bottom: 10px">
              <VueFaqAccordion
                :items="ProvidersEBPsAndSurveysByClinicAndPatient"
              />
            </div>
          </div>

          <!-- Show table if PHIPII permissions -->
          <!-- Start Role -->
          <div class="row justify-content-center">
            <div class="col-md-12">
              <card>
                <template slot="header">
                  <button @click="gridOptions1.api.collapseAll()">
                    Collapse All
                  </button>
                  <button @click="gridOptions1.api.expandAll()">
                    Expand All
                  </button>
                  <button
                    class="float-right"
                    @click="gridOptions1.api.exportDataAsCsv()"
                  >
                    Export to CSV
                  </button>
                </template>
                <ag-grid-vue
                  style="font-size: 12px; height: 500px"
                  class="ag-theme-balham grid"
                  :gridOptions="gridOptions1"
                  :columnDefs="columnDefs1"
                  :rowData="rowData1"
                  :gridReady="onGridReady1"
                  :enableFilter="true"
                  :enableSorting="true"
                  :enableColResize="true"
                  :animateRows="true"
                  :cellClicked="onCellClicked"
                >
                </ag-grid-vue>
                <!-- :rowDataChanged="onRowDataChanged1" -->
              </card>
            </div>
          </div>
          <!-- End Row -->
        </div>
        <!-- PHIPII Restricted -->
      </div>
      <!-- End Container -->
    </div>
    <!-- End of Content -->
  </transition>
</template>
<script>
import StatsCard from "src/components/UIComponents/Cards/StatsCard.vue";
import Card from "src/components/UIComponents/Cards/Card.vue";

import Vue from "vue";
import { AgGridVue } from "ag-grid-vue";

import VueHighcharts from "vue2-highcharts";

import VueFaqAccordion from "vue-faq-accordion";
import {
  ebps,
  PEorCPT,
  IndividualAndGroupTxEBPs,
  ebpActivitySummary,
  ProvidersEBPsAndSurveysByClinicAndPatient,
} from "../Documentation/ebp_doc.js";

import { mapState, mapGetters, mapActions } from "vuex";

import { precise_round, addCommas } from "src/utils";

function computePercent(num, denom) {
  // console.log('numerator: ', num)
  // console.log('denominator', denom)
  let percent = (+num / +denom) * 100;
  return isNaN(percent) ? 0 : precise_round(percent, 1);
}

export default {
  name: "EBP",
  components: {
    StatsCard,
    Card,
    AgGridVue,
    VueHighcharts,
    VueFaqAccordion,
  },
  data() {
    return {
      // Tooltips
      TotalEBPsSessions: "All EBP Sessions / All PCT Sessions",
      TotalEBPsPatients: "All EBP Patients / All PCT Patients",
      TotalPECPTSessions: "PE and CPT Sessions / All PCT Sessions",
      TotalPECPTPatients: "PE and CPT Patients / All PCT Patients",
      IndividualTxEBPSessions: "EBP Ind Tx Sessions / All PCT Ind Tx Sessions",
      IndividualTxEBPPatients: "EBP Ind Tx Patients / All PCT Ind Tx Patients",
      GroupTxEBPSessions: "EBP Group Tx Sessions / All PCT Group Tx Sessions",
      GroupTxEBPPatients: "EBP Group Tx Patients / All PCT Group Tx Patients",
      IndTherapyOnly:
        "Patients with EBP Ind Tx Sessions Only / All Therapy Patients",
      GroupTherapyOnly:
        "Patients with EBP Group Tx Sessions Only / All Therapy Patients",
      BothIndGroupTherapy:
        "Patients with EBP Ind and Group Tx Sessions / All Therapy Patients",

      // documentation widgets
      ebps: ebps,
      PEorCPT: PEorCPT,
      IndividualAndGroupTxEBPs: IndividualAndGroupTxEBPs,
      ebpActivitySummary: ebpActivitySummary,
      ProvidersEBPsAndSurveysByClinicAndPatient:
        ProvidersEBPsAndSurveysByClinicAndPatient,
    };
  },

  computed: {
    ...mapState([
      "selectedSite",
      "phipii",
      "selectedInstitutions",
      "selectedInstitutionsNames",
      "disclaimer",
      "dataError",
    ]),

    ...mapGetters([
      "siteEBPSessionsAny",
      "siteALLSessions",

      "siteEBPPatientsAny",
      "siteALLPatients", // inconsistent with Encounter therapy sum
      "siteEncounterPatientTotal", // pull from Encounters

      "siteEncounterCPTPatientsEither", // from Encounter to sync #s

      "siteEBPSessionsPECPT",
      // 'siteALLSessions',

      "siteEBPPatientsPECPT",
      // 'siteALLPatients',

      "siteEBPSessionsInd",
      "siteALLSessionsInd",

      "siteEBPPatientsInd",
      "siteALLPatientsInd",

      "siteEBPSessionsGrp",
      "siteALLSessionsGrp",

      "siteEBPPatientsGrp",
      "siteALLPatientsGrp",

      "siteEBPPieChartSeries",
      "siteEBPDetailsTypes",
      "siteEBPDetailsSessionsSurveys",
    ]),

    siteEBPSessionsAnyPercent() {
      return computePercent(this.siteEBPSessionsAny, this.siteALLSessions);
      // return Math.round((this.siteEBPSessionsAny/this.siteALLSessions) * 100)
    },
    siteEBPPatientsAnyPercent() {
      return computePercent(this.siteEBPPatientsAny, this.siteALLPatients);
      // return Math.round((this.siteEBPPatientsAny/this.siteALLPatients) * 100)
    },

    siteEBPSessionsPECPTPercent() {
      return computePercent(this.siteEBPSessionsPECPT, this.siteALLSessions);
      // return Math.round((this.siteEBPSessionsPECPT/this.siteALLSessions) * 100)
    },
    siteEBPPatientsPECPTPercent() {
      return computePercent(this.siteEBPPatientsPECPT, this.siteALLPatients);
      // return Math.round((this.siteEBPPatientsPECPT/this.siteALLPatients) * 100)
    },

    siteEBPSessionsIndPercent() {
      return computePercent(this.siteEBPSessionsInd, this.siteALLSessionsInd);
      // return Math.round((this.siteEBPSessionsInd/this.siteALLSessionsInd) * 100)
    },
    siteEBPPatientsIndPercent() {
      return computePercent(this.siteEBPPatientsInd, this.siteALLPatientsInd);
      // return Math.round((this.siteEBPPatientsInd/this.siteALLPatientsInd) * 100)
    },

    siteEBPSessionsGrpPercent() {
      return computePercent(this.siteEBPSessionsGrp, this.siteALLSessionsGrp);
      // return Math.round((this.siteEBPSessionsGrp/this.siteALLSessionsGrp) * 100)
    },
    siteEBPPatientsGrpPercent() {
      return computePercent(this.siteEBPPatientsGrp, this.siteALLPatientsGrp);
      // return Math.round((this.siteEBPPatientsGrp/this.siteALLPatientsGrp) * 100)
    },
    siteEBPProvidersPercent() {
      return computePercent(this.siteEBPProviders, this.siteEBPProvidersAll);
      // return Math.round((this.siteEBPProviders/this.siteEBPProvidersAll) * 100)
    },
    siteEBPProvidersCPTPercent() {
      return computePercent(this.siteEBPProvidersCPT, this.siteEBPProvidersAll);
      // return Math.round((this.siteEBPProvidersCPT/this.siteEBPProvidersAll) * 100)
    },
    siteEBPProvidersPEIPercent() {
      return computePercent(this.siteEBPProvidersPEI, this.siteEBPProvidersAll);
      // return Math.round((this.siteEBPProvidersPEI/this.siteEBPProvidersAll) * 100)
    },

    // Utility Computed Functions
    selectedSiteVISNorNATIONAL() {
      return /VISN|NATIONAL/.test(this.selectedSite);
    },
    changeBackgroundColor() {
      // console.log('in changeBackgroundColor selectedInstitutions is: ', this.selectedInstitutions)
      return this.selectedInstitutions.length > 0 || false;
    },
    scrollPosition() {
      console.log("window.pageYOffset: ", window.pageYOffset);
    },

    // Table Data
    rowData() {
      return this.siteEBPDetailsTypes;
    },
    // rowData1 () { return this.siteEBPClinicSummary },
    rowData1() {
      return this.siteEBPDetailsSessionsSurveys;
    },

    pieChartOptions(vm) {
      return {
        chart: { type: "pie", options3d: { enabled: true, alpha: 45 } },
        title: { text: "EBP Types" },
        subtitle: { text: "Hover over sections for EBP Type data" },
        credits: { enabled: false },
        plotOptions: {
          pie: { innerSize: 100, depth: 45 },
          series: { allowPointSelect: true },
        },
        series: [
          {
            name: "ebp types",
            point: {
              events: {
                click: function (event) {
                  // pull status name of pie slice clicked
                  let pieSliceClicked = this.name;
                  // send pie slice status name to handler
                  vm.pieClickHandler(pieSliceClicked);
                },
              },
            },
            data: this.siteEBPPieChartSeries,
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
  },
  beforeMount() {
    (this.columnDefs = this.createColDefs()),
      (this.columnDefs1 = this.createColDefs1()),
      (this.onFilterChanged = function () {
        console.log("filter changed!!");
      });

    (this.gridOptions = {
      suppressPropertyNamesCheck: true,
    }),
      (this.gridOptions1 = {
        // groupHideOpenParents: true,
        autoGroupColumnDef: {
          headerName: "Site / Staff / Clinic / Patient",
          field: "LocationName",
          // field: 'InstitutionName'
        },
        suppressPropertyNamesCheck: true,
        // floatingFilter: true
        // groupMultiAutoColumn:true,
      });
  },
  mounted() {
    this.CURRENT_PAGE("ebp");

    this.EBP_SUMMARY();
    this.EBP_DETAILS();
    this.EBP_PIE_CHART();
    this.EBP_DETAILS_TYPES();
    this.EBP_DETAILS_SESSIONS_SURVEYS();

    this.GET_INSTITUTIONS();
  },
  methods: {
    ...mapActions([
      "EBP_SUMMARY",
      "EBP_DETAILS",
      "EBP_PIE_CHART",
      "EBP_DETAILS_TYPES",
      "EBP_DETAILS_SESSIONS_SURVEYS",

      "CURRENT_PAGE",
      "GET_INSTITUTIONS",
    ]),
    addCommas,
    onGridReady() {
      this.gridOptions.api.sizeColumnsToFit();
    },
    onGridReady1() {
      this.gridOptions1.api.sizeColumnsToFit();
    },
    createColDefs() {
      return [
        {
          headerName: "EBPs",
          children: [
            {
              headerName: "Site",
              field: "StaPa",
              width: 30,
              cellStyle: { "text-align": "left" },
              filter: "agTextColumnFilter",
              // checkboxSelection: true,
            },
            {
              headerName: "Institution",
              field: "InstitutionName",
              width: 70,
              cellStyle: { "text-align": "left" },
              filter: "agTextColumnFilter",
            },
            {
              headerName: "EBP Name",
              field: "HealthFactorCategoryShort",
              width: 50,
              cellStyle: { "text-align": "left" },
              filter: "agTextColumnFilter",
            },
            {
              headerName: "Patients",
              field: "numPatients",
              width: 50,
              cellStyle: { "text-align": "left" },
              filter: "agNumberColumnFilter",
            },
          ],
        },
      ];
    },
    createColDefs1() {
      //experimental
      return [
        {
          headerName: "Patients",
          // field: "InitialsAndL4",
          field: "InitialsAndL4",
          width: 80,
          cellStyle: { "text-align": "left" },
          filter: "agTextColumnFilter",
        },
        {
          headerName: "Institution",
          field: "InstitutionName",
          width: 120,
          cellStyle: { "text-align": "left" },
          filter: "agTextColumnFilter",
          rowGroup: true,
          hide: true,
        },
        // { headerName: "Clinic Name",
        //   field: "LocationName",
        //   width: 150,
        //   cellStyle: { 'text-align': "left" } ,
        //   filter: "agTextColumnFilter",
        // },
        {
          headerName: "EBP",
          field: "HealthFactorCategoryShort",
          width: 80,
          cellStyle: { "text-align": "left" },
          filter: "agTextColumnFilter",
        },
        {
          headerName: "Session#",
          field: "SessionNumberValue",
          width: 80,
          cellStyle: { "text-align": "left" },
          filter: "agTextColumnFilter",
        },
        {
          headerName: "Visit DateTime",
          field: "VisitDateTime",
          width: 120,
          cellStyle: { "text-align": "left" },
          filter: "agDateColumnFilter",
          // suppressFilter: true,
        },
        {
          headerName: "PCL-5",
          field: "SurveyName",
          width: 70,
          cellStyle: { "text-align": "left" },
          filter: "agTextColumnFilter",
        },
        {
          headerName: "Score",
          field: "RawScore",
          width: 70,
          cellStyle: { "text-align": "left" },
          filter: "agTextColumnFilter",
        },
        {
          headerName: "Survey DateTime",
          field: "SurveyGivenDateTime",
          width: 120,
          cellStyle: { "text-align": "left" },
          filter: "agDateColumnFilter",
          // suppressFilter: true,
        },
        {
          headerName: "Provider",
          field: "STAFFNAME",
          width: 150,
          cellStyle: { "text-align": "left" },
          filter: "agTextColumnFilter",
          rowGroup: true,
          hide: true,
        },
      ];
    },
    onCellClicked(event) {
      let clickedCellFieldName = event.colDef.field;
      let clickedCellDataSimple = event.value;
      let clickedCellDataWithFieldReference =
        event.node.data[clickedCellFieldName];
      let clickedCellRowIndex = event.rowIndex;
      let clickedCellNode = event.node;

      console.log("onCellClicked node.data is ****: ", event.node.data);
    },
    // onRowDataChanged() {
    //   console.log('row data changed!!')
    //   Vue.nextTick(() => {
    //     this.gridOptions.api.sizeColumnsToFit();
    //   });
    // },
  },
};
</script>
<style>
.filtering {
  background-color: lightgrey;
}

.section-head {
  font-size: 2rem;
}

.phipii-warning {
  font-size: 1rem;
}

hr.style1 {
  border-top: 3px double #8c8b8b;
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
