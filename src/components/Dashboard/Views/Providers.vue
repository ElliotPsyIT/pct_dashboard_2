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
            <span class="font: red;">{{ disclaimer.asterisks }}</span
            >{{ disclaimer.mainText
            }}<span style="font-weight: bold; text-decoration: underline">{{
              disclaimer.emphasis
            }}</span>
          </p>
        </div>

        <hr />

        <!-- Section Header -->
        <div class="row d-flex justify-content-center">
          <h4 class="section-head">Provider, Clinic, Patient Stats</h4>
        </div>

        <!--  FAQ -->
        <div
          style="align-items: center; display: flex; justify-content: center"
        >
          <div style="width: 60%; margin-bottom: 10px">
            <VueFaqAccordion :items="ProviderClinicPatientTotals" />
          </div>
        </div>

        <div class="row d-flex justify-content-center">
          <div class="col-xl-3 col-md-4">
            <stats-card>
              <div slot="header" class="icon-warning">
                <i class="nc-icon nc-badge text-warning"></i>
              </div>
              <div slot="content">
                <p class="card-category">Total Providers</p>
                <h4 class="card-title">
                  {{ addCommas(asyncValue(siteProviderProviderCount)) }}
                </h4>
              </div>
            </stats-card>
          </div>

          <div class="col-xl-3 col-md-4">
            <stats-card>
              <div slot="header" class="icon-warning">
                <i class="nc-icon-outline nc-home-52 text-warning"></i>
              </div>
              <div slot="content">
                <p class="card-category">Total Clinics</p>
                <h4 class="card-title">
                  {{ addCommas(asyncValue(siteProviderClinicCount)) }}
                </h4>
              </div>
            </stats-card>
          </div>

          <div class="col-xl-3 col-md-4">
            <stats-card>
              <div slot="header" class="icon-warning">
                <i class="nc-icon-outline nc-multiple-11 text-warning"></i>
              </div>
              <div slot="content">
                <p class="card-category">Total Patients</p>
                <h4 class="card-title">
                  {{ addCommas(asyncValue(siteProviderPatientCount)) }}
                </h4>
              </div>
            </stats-card>
          </div>
        </div>

        <div v-if="!phipii && !selectedSiteVISNorNATIONAL">
          <!-- Section Header -->
          <div class="row d-flex justify-content-center">
            <h4 class="section-head">Provider Activity Summary</h4>
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
            <h4 class="section-head">Provider Activity Summary</h4>
          </div>

          <!--  FAQ -->
          <div
            style="align-items: center; display: flex; justify-content: center"
          >
            <div style="width: 60%; margin-bottom: 10px">
              <VueFaqAccordion :items="ProviderActivitySummary" />
            </div>
          </div>

          <div class="row justify-content-center">
            <div class="col-md-12">
              <card>
                <template slot="header">
                  <span>Hover Over Column Header to View Menu</span>
                  <!-- <button class="float-right" @click="gridOptions3.api.exportDataAsCsv()">Export to CSV</button> -->
                  <button class="float-right" @click="exportCSVgridOptions3">
                    Export to CSV
                  </button>
                </template>
                <ag-grid-vue
                  style="font-size: 12px; height: 500px"
                  class="ag-theme-balham grid"
                  :gridOptions="gridOptions3"
                  :columnDefs="columnDefs3"
                  :rowData="rowData3"
                  :gridReady="onGridReady3"
                  :enableFilter="true"
                  :enableSorting="true"
                  :enableColResize="true"
                  :onFilterChanged="onFilterChanged"
                  :animateRows="true"
                >
                </ag-grid-vue>
                <!-- :rowDataChanged="onRowDataChanged3" -->
                <template slot="footer">
                  <div class="legend">Detailed Encounter Listing</div>
                </template>
              </card>
            </div>
          </div>
          <!-- End Row -->
        </div>
        <!-- End PHIPII -->

        <!-- Show table only with PHIPII -->
        <div v-if="!phipii && !selectedSiteVISNorNATIONAL">
          <!-- Section Header -->
          <div class="row d-flex justify-content-center">
            <h4 class="section-head">Provider Encounter Totals</h4>
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

        <div v-if="phipii">
          <!-- Section Header -->
          <div class="row d-flex justify-content-center">
            <h4 class="section-head">Provider Encounter Totals</h4>
          </div>

          <!--  FAQ -->
          <div
            style="align-items: center; display: flex; justify-content: center"
          >
            <div style="width: 60%; margin-bottom: 10px">
              <VueFaqAccordion :items="ProviderEncounterTotals" />
            </div>
          </div>

          <div class="row justify-content-center">
            <div class="col-md-10">
              <card>
                <template slot="header">
                  <!-- <span>Click On Arrow <span class="nc-icon">></span> Below to Drill Down</span> -->
                  <button @click="gridOptions1.api.collapseAll()">
                    Collapse All
                  </button>
                  <button @click="gridOptions1.api.expandAll()">
                    Expand All
                  </button>
                  <!-- <button class="float-right" @click="gridOptions1.api.exportDataAsCsv()">Export to CSV</button> -->
                  <button class="float-right" @click="exportCSVgridOptions1()">
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
                >
                </ag-grid-vue>
                <!-- :rowDataChanged="onRowDataChanged1" -->
                <template slot="footer">
                  <div class="legend">Provider Encounters</div>
                </template>
              </card>
            </div>
          </div>
          <!-- End Row -->
        </div>
        <!-- End PHIPII -->

        <div v-if="!phipii && !selectedSiteVISNorNATIONAL">
          <!-- Section Header -->
          <div class="row d-flex justify-content-center">
            <h4 class="section-head">Provider Patient Sessions</h4>
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
            <h4 class="section-head">Provider Patient Sessions</h4>
          </div>
          <!--  FAQ -->
          <div
            style="align-items: center; display: flex; justify-content: center"
          >
            <div style="width: 60%; margin-bottom: 10px">
              <VueFaqAccordion :items="ProviderPatientSessions" />
            </div>
          </div>

          <!-- <div class="row d-flex justify-content-center ">
          <h5 class="section-head">(For Testing: One Week's Data Only)</h5>
        </div> -->

          <div class="row justify-content-center">
            <div class="col-md-10">
              <card>
                <template slot="header">
                  <!-- <span>Click On Arrow <span class="nc-icon">></span> Below to Drill Down</span> -->
                  <button @click="gridOptions2.api.collapseAll()">
                    Collapse All
                  </button>
                  <button @click="gridOptions2.api.expandAll()">
                    Expand All
                  </button>
                  <button
                    class="float-right"
                    @click="gridOptions2.api.exportDataAsCsv()"
                  >
                    Export to CSV
                  </button>
                </template>
                <ag-grid-vue
                  style="font-size: 12px; height: 500px"
                  class="ag-theme-balham grid"
                  :gridOptions="gridOptions2"
                  :columnDefs="columnDefs2"
                  :rowData="rowData2"
                  :gridReady="onGridReady2"
                  :enableFilter="true"
                  :enableSorting="true"
                  :enableColResize="true"
                  :animateRows="true"
                  :cellClicked="onCellClicked"
                >
                </ag-grid-vue>
                <!-- :rowDataChanged="onRowDataChanged2" -->
                <template slot="footer">
                  <div class="legend">Providers' Patient Sessions</div>
                </template>
              </card>
            </div>
          </div>
          <!-- Display if PHIPII -->
        </div>
      </div>
      <!-- End container-fluid -->
    </div>
    <!-- End content -->
  </transition>
</template>
<script>
import StatsCard from "src/components/UIComponents/Cards/StatsCard.vue";
import Card from "src/components/UIComponents/Cards/Card.vue";

import Vue from "vue";
import { AgGridVue } from "ag-grid-vue";

import VueFaqAccordion from "vue-faq-accordion";
import {
  ProviderClinicPatientTotals,
  ProviderActivitySummary,
  ProviderEncounterTotals,
  ProviderPatientSessions,
} from "../Documentation/providers_doc.js";

import { mapState, mapGetters, mapActions } from "vuex";

import { addCommas } from "src/utils";

export default {
  name: "providers",
  components: {
    Card,
    StatsCard,
    AgGridVue,
    VueFaqAccordion,
  },
  data() {
    return {
      ProviderClinicPatientTotals: ProviderClinicPatientTotals,
      ProviderActivitySummary: ProviderActivitySummary,
      ProviderEncounterTotals: ProviderEncounterTotals,
      ProviderPatientSessions: ProviderPatientSessions,
    };
  },
  computed: {
    ...mapState([
      "selectedSite",
      "selectedRange",
      "phipii",
      "selectedInstitutions",
      "selectedInstitutionsNames",
      "disclaimer",
    ]),
    ...mapGetters([
      "siteProviderDetailsCPT",

      "siteProviderInfo",
      "siteProviderInfoEBP", // EBP info for Provider Activity Summary table
      "siteProviderDetails",
      "siteProviderPatientDetailsCPT",

      "siteProviderProviderCount",
      "siteProviderClinicCount",
      "siteProviderPatientCount",
    ]),
    selectedSiteVISNorNATIONAL() {
      return /VISN|NATIONAL/.test(this.selectedSite);
    },
    changeBackgroundColor() {
      // console.log('in changeBackgroundColor siteProviderSelected is: ', this.siteProviderSelected)
      // console.log('in changeBackgroundColor selectedInstitutions is: ', this.selectedInstitutions)
      // return this.siteProviderSelected || this.selectedInstitutions.length > 0 || false
      return this.selectedInstitutions.length > 0 || false;
    },
    scrollPosition() {
      console.log("window.pageYOffset: ", window.pageYOffset);
    },
    rowData1() {
      // console.log('in computed, this.siteProviderDetails is: ', this.siteProviderDetails)
      return this.siteProviderDetails;
    }, // siteProviderDetails/Provider Encounters Details
    rowData2() {
      // console.log('in computed, this.siteProviderPatientDetailsCPT is: ', this.siteProviderPatientDetailsCPT)
      return this.siteProviderPatientDetailsCPT;
    }, // siteProviderPatientDetailsCPT/Provider Sessions Details
    rowData3() {
      // console.log('in computed, this.siteProviderInfo is: ', this.siteProviderInfo)
      return this.siteProviderInfo;
    }, // siteProviderInfo/Provider Activity Details
  },
  beforeMount() {
    (this.columnDefs1 = this.createColDefs1()),
      (this.columnDefs2 = this.createColDefs2()),
      (this.columnDefs3 = this.createColDefs3()), // siteProviderInfo/Provider Activity Details
      (this.onFilterChanged = function () {
        console.log("filter changed!!");
      });

    (this.gridOptions1 = {
      // groupHideOpenParents: true,
      autoGroupColumnDef: {
        headerName: "Staff / Site",
        field: "LocationName",
        // field: 'InstitutionName'
        suppressPropertyNamesCheck: true,
        // deltaRowDataMode : true
      },
      // groupMultiAutoColumn:true,
    }),
      (this.gridOptions2 = {
        // groupHideOpenParents: true,
        autoGroupColumnDef: {
          headerName: "Staff / Site / Clinic / Patient",
          // field: 'InitialsAndL4',
          field: "NL4",
          // field: 'LocationName'
          suppressPropertyNamesCheck: true,
        },
        // groupMultiAutoColumn:true,
        // groupSuppressAutoColumn: true
      }),
      (this.gridOptions3 = {
        suppressPropertyNamesCheck: true,
      });
  },
  mounted() {
    this.CURRENT_PAGE("providers");

    this.PROVIDER_COUNT();
    this.PROVIDER_DETAILS();
    this.PROVIDER_PATIENT_DETAILS_CPT();
    this.PROVIDER_INFO();

    // might be needed to assure institutions are available
    //    when app is opened and saved station is used
    this.GET_INSTITUTIONS();
  },
  methods: {
    ...mapActions([
      "PROVIDER_COUNT",
      "PROVIDER_DETAILS",
      "PROVIDER_PATIENT_DETAILS_CPT",
      "PROVIDER_INFO",

      "CURRENT_PAGE",
      "GET_INSTITUTIONS",
    ]),
    addCommas,
    asyncValue(val) {
      return val == 0 ? "Loading..." : val;
    },
    exportCSVgridOptions1() {
      let params = {
        // define the fields for export
        columnKeys: [
          "STAFFNAME",
          "InstitutionName",
          "LocationName",
          "EncountersByProvider",
          "numPatients",
        ],
        fileName: "provider_encounter_totals",
        allColumns: true,
        columnGroups: false,
        processCellCallback: (params) => {
          // console.log('processCellCallback params.value: ', params.value)
          return params.value;
        },
        shouldRowBeSkipped: (params) => {
          // don't export if it's a grouped row
          if (params.node.group == true) {
            return true;
          }
        },
      };

      this.gridOptions1.api.exportDataAsCsv(params);
    },
    exportCSVgridOptions3() {
      this.gridOptions3.api.exportDataAsCsv({
        processCellCallback: (params) => {
          if (params.column.colId == "visitEBPpercent") {
            // need params.node.data to access the grid columns
            // see below in cellRenderer for similar formating of output values
            let encounters = params.node.data.numEncounters;
            let encountersEBP =
              params.node.data.numEncountersEBP === null
                ? 0
                : params.node.data.numEncountersEBP;
            let encountersEBPpercent =
              params.node.data.PercentageEncountersCPT === null
                ? 0
                : params.node.data.PercentageEncountersCPT;

            // return `${encountersEBP} (${encountersEBPpercent}%)`
            return `${encountersEBP}`; // just return value not percent
          }
          if (params.column.colId == "patientEBPpercent") {
            // need params.node.data to access the grid columns
            // see below in cellRenderer for similar formating of output values
            let patients = params.node.data.numPatients;
            let patientsEBP =
              params.node.data.numPatientsEBP === null
                ? 0
                : params.node.data.numPatientsEBP;
            let patientsEBPpercent =
              params.node.data.PercentagePatientsCPT === null
                ? 0
                : params.node.data.PercentagePatientsCPT;

            // return `${patientsEBP} (${patientsEBPpercent}%)`
            return `${patientsEBP}`; // just return value not percent
          }
          return params.value;
        },
        processHeaderCallback: (params) => {
          // return custom header name
          if (params.column.getColDef().headerName == "Visit EBPs (%)") {
            return "Visit EBPs";
          }
          if (params.column.getColDef().headerName == "Patient EBPs (%)") {
            return "Patient EBPs";
          }

          // return grid header name
          return params.column.colDef.headerName;
        },
      });
    },
    createColDefs1() {
      //experimental
      return [
        {
          headerName: "Provider (# Sessions Total)",
          field: "STAFFNAME",
          width: 150,
          cellStyle: { "text-align": "left" },
          filter: "agTextColumnFilter",
          rowGroup: true,
          // hide:true
        },
        {
          headerName: "Institution (# Sessions)",
          field: "InstitutionName",
          width: 200,
          cellStyle: { "text-align": "left" },
          filter: "agTextColumnFilter",
          rowGroup: true,
          hide: true,
        },
        {
          headerName: "Clinic Name",
          field: "LocationName",
          width: 150,
          cellStyle: { "text-align": "left" },
          filter: "agTextColumnFilter",
          hide: true,
        },
        {
          headerName: "Sessions",
          field: "EncountersByProvider",
          width: 80,
          cellStyle: { "text-align": "left" },
          filter: "agNumberColumnFilter",
        },
        {
          headerName: "Patients",
          field: "numPatients",
          width: 80,
          cellStyle: { "text-align": "left" },
          filter: "agNumberColumnFilter",
        },
      ];
    },
    createColDefs2() {
      return [
        {
          headerName: "Staff Name",
          field: "StaffName",
          width: 150,
          cellStyle: { "text-align": "left" },
          filter: "agTextColumnFilter",
          rowGroup: true,
          // hide:true,
        },
        {
          headerName: "Institution",
          field: "InstitutionName",
          width: 100,
          cellStyle: { "text-align": "left" },
          filter: "agTextColumnFilter",
          rowGroup: true,
          hide: true,
        },
        {
          headerName: "Clinic (# Sessions)",
          field: "LocationName",
          width: 200,
          cellStyle: { "text-align": "left" },
          filter: "agTextColumnFilter",
          rowGroup: true,
          hide: true,
        },
        // { headerName: "Patient",
        //   field: "InitialsAndL4",
        //   width: 100,
        //   cellStyle: { 'text-align': "left" } ,
        //   filter: "agTextColumnFilter",
        // },
        {
          headerName: "CPT Name",
          field: "CPTName",
          width: 350,
          cellStyle: { "text-align": "left" },
          filter: "agTextColumnFilter",
        },
        // { headerName: "Sessions",
        //   field: "EncountersByProvider",
        //   width: 100,
        //   cellStyle: { 'text-align': "left" } ,
        //   filter: "agNumberColumnFilter"
        // },
        // { headerName: "Date",
        //   field: "VisitDateTime",
        //   width: 150,
        //   cellStyle: { 'text-align': "left" } ,
        //   filter: "agDateColumnFilter"
        // },
      ];
    },
    createColDefs3() {
      return [
        {
          headerName: "Provider Information",
          children: [
            {
              headerName: "Site",
              field: "StaPa",
              width: 15,
              cellStyle: { "text-align": "left" },
              filter: "agTextColumnFilter",
            },
            {
              headerName: "Staff Name",
              field: "STAFFNAME",
              width: 40,
              cellStyle: { "text-align": "left" },
              filter: "agTextColumnFilter",
            },
            {
              headerName: "Institution",
              field: "InstitutionName",
              width: 40,
              cellStyle: { "text-align": "left" },
              filter: "agTextColumnFilter",
            },
            // { headerName: "Clinics",
            //   field: "numLocations",
            //   width: 20,
            //   cellStyle: { 'text-align': "left" } ,
            //   filter: "agTextColumnFilter"
            // },
            {
              headerName: "Patients",
              field: "numPatients",
              width: 23,
              cellStyle: { "text-align": "left" },
              filter: "agNumberColumnFilter", //,
              // cellRenderer: (params) => {
              //   let patients = params.data.numPatients
              //   let patientsEBP = params.data.numPatientsEBP === null ? 0 : params.data.numPatientsEBP
              //   let patientsEBPpercent= params.data.PercentagePatientsCPT === null ? 0 : params.data.PercentagePatientsCPT
              //   return `${patients} / ${patientsEBP} (${patientsEBPpercent}%)`
              // }
            },
            {
              headerName: "Visits",
              field: "numEncounters",
              width: 18,
              cellStyle: { "text-align": "left" },
              filter: "agNumberColumnFilter", //,
              // cellRenderer: (params) => {
              //   let encounters = params.data.numEncounters
              //   let encountersEBP = params.data.numEncountersEBP === null ? 0 : params.data.numEncountersEBP
              //   let encountersEBPpercent= params.data.PercentageEncountersCPT === null ? 0 : params.data.PercentageEncountersCPT
              //   return `${encounters} / ${encountersEBP} (${encountersEBPpercent}%)`
            },
            {
              headerName: "Visit EBPs (%)",
              field: "visitEBPpercent",
              width: 30,
              cellStyle: { "text-align": "left" },
              filter: "agNumberColumnFilter",
              cellRenderer: (params) => {
                // console.log('params.data is: ', params.data)
                let encounters = params.data.numEncounters;
                let encountersEBP =
                  params.data.numEncountersEBP === null
                    ? 0
                    : params.data.numEncountersEBP;
                let encountersEBPpercent =
                  params.data.PercentageEncountersCPT === null
                    ? 0
                    : params.data.PercentageEncountersCPT;

                return `${encountersEBP} (${encountersEBPpercent}%)`;
              },
            },
            {
              headerName: "Patient EBPs (%)",
              field: "patientEBPpercent",
              width: 30,
              cellStyle: { "text-align": "left" },
              filter: "agNumberColumnFilter",
              cellRenderer: (params) => {
                // console.log('params.data is: ', params.data)
                let patients = params.data.numPatients;
                let patientsEBP =
                  params.data.numPatientsEBP === null
                    ? 0
                    : params.data.numPatientsEBP;
                let patientsEBPpercent =
                  params.data.PercentagePatientsCPT === null
                    ? 0
                    : params.data.PercentagePatientsCPT;

                return `${patientsEBP} (${patientsEBPpercent}%)`;
              },
            },
          ],
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

    onGridReady1() {
      // console.log('onGridReady1 fires sizeColumnsToFit!')
      this.gridOptions1.api.sizeColumnsToFit();
    },
    onGridReady2() {
      // console.log('onGridReady2 fires sizeColumnsToFit!')
      this.gridOptions2.api.sizeColumnsToFit();
    },
    onGridReady3() {
      // console.log('onGridReady3 fires sizeColumnsToFit!')
      this.gridOptions3.api.sizeColumnsToFit();
    },
    // onRowDataChanged1() {
    //   console.log('row1 data change calledd!!')

    //   // Vue.nextTick(() => {
    //   //   this.gridOptions1.api.sizeColumnsToFit();
    //   //   // this.gridOptions1.api.expandAll();
    //   // });
    // },
    // onRowDataChanged2() {
    //   console.log('row2 data change called!!')
    //   // Vue.nextTick(() => {
    //   //   this.gridOptions2.api.sizeColumnsToFit()
    //   //   // this.gridOptions2.api.expandAll();
    //   // });
    // },
    // onRowDataChanged3() {
    //   console.log('row3 data change called!!')
    //   Vue.nextTick(() => {
    //     this.gridOptions3.api.sizeColumnsToFit();
    //   });
    // }
  },
};
</script>
<style>
/* institutions being filtered */
.filtering {
  background-color: lightgrey;
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
  transition: opacity 0.1s;
}

.fade-enter,
  .fade-leave-to
    /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>
