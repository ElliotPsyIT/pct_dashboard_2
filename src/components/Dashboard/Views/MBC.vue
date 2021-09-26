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

        <!-- Section Header PCL5 -->
        <div class="row d-flex justify-content-center">
          <h4 class="section-head">PCL5 Administrations</h4>
        </div>
        <div class="d-flex flex-row justify-content-center mt-2 mb-2">
          All PCL5 Listings Below Include Both PCL5 Weekly and PCL5 Monthly
        </div>

          <!--  FAQ -->
          <div
            style="
              align-items: center;
              display: flex;
              justify-content: center;
              margin-top: 20px;
            "
          >
            <div style="width: 60%; margin-bottom: 10px">
              <VueFaqAccordion :items="PCL5Administrations" />
            </div>
          </div>
 
        <div class="row d-flex justify-content-center">
          <div class="col-xl-3 col-md-3">
            <stats-card :key="siteMBCPCL5">
              <div slot="header" class="icon-warning">
                <i class="nc-icon nc-paper-2 text-warning"></i>
              </div>
              <div slot="content">
                <p class="card-category">Total PCL5s</p>
                <h4 class="card-title">{{ addCommas(siteMBCPCL5) }}</h4>
              </div>
            </stats-card>
          </div>
        </div>

        <!-- Section Header PCL5 -->
        <!-- <div class="row d-flex justify-content-center">
          <h4 class="section-head">Providers</h4>
        </div> -->

        <!-- Now deprecated because need to separate administering provider-->
        <!-- from primary providers who order and primary providers who don't order-->
        <!-- <div class="d-flex flex-row justify-content-center">
          <div class="col-xl-3 col-md-3">
            <stats-card>
              <div slot="header" class="icon-warning">
                <i class="nc-icon-outline nc-single-01 text-warning"></i>
              </div>
              <div slot="content">
                <p class="card-category">
                  Providers PCL5s<br />
                  ({{ formatNumber(siteMBCProvidersPCL5Total) }}/
                  {{ formatNumber(siteMBCProvidersTotal) }})
                </p>
                <h4 class="card-title">
                  <transition name="fade" mode="out-in">
                    <span :key="siteMBCProvidersPCL5Percent">
                      {{ siteMBCProvidersPCL5Percent }}%
                    </span>
                  </transition>
                </h4>
              </div>
            </stats-card>
          </div>
        </div> -->

        <!-- Section Header PCL5 -->
        <div class="row d-flex justify-content-center">
          <h4 class="section-head">Patients</h4>
        </div>

          <!--  FAQ -->
          <div
            style="
              align-items: center;
              display: flex;
              justify-content: center;
              margin-top: 20px;
            "
          >
            <div style="width: 60%; margin-bottom: 10px">
              <VueFaqAccordion :items="PCL5AdministrationsAndPatientEncounters" />
            </div>
          </div>
 

 
        <div class="d-flex flex-row justify-content-center">
          <div class="col-xl-3 col-md-3">
            <div class="d-flex flex-row justify-content-center mt-2 mb-2">
              All Patients
            </div>
            <stats-card>
              <div slot="header" class="icon-warning">
                <i class="nc-icon-outline nc-single-01 text-warning"></i>
              </div>
              <div slot="content">
                <p class="card-category">
                  At Least One PCL5<br />
                  ({{ formatNumber(siteMBCPatientsPCL5oneOrMore) }}/
                  {{ formatNumber(siteMBCPatientsTotal) }})
                </p>
                <h4 class="card-title">
                  <transition name="fade" mode="out-in">
                    <span :key="siteMBCPatientsPCL5oneOrMorePercent">
                      {{ siteMBCPatientsPCL5oneOrMorePercent }}%
                    </span>
                  </transition>
                </h4>
              </div>
            </stats-card>
          </div>

          <div class="col-xl-3 col-md-3">
            <div class="d-flex flex-row justify-content-center mt-2 mb-2">
              Patients Seen 2 or More Times
            </div>
            <stats-card>
              <div slot="header" class="icon-warning">
                <i class="nc-icon-outline nc-single-01 text-warning"></i>
              </div>
              <div slot="content">
                <p class="card-category">
                  Two or More PCL5s<br />
                  ({{ formatNumber(siteMBCPatientsPCL5moreThanOne) }}/
                  {{ formatNumber(siteMBCPatientsTotalWith2orMoreSessions) }})
                </p>
                <h4 class="card-title">
                  <transition name="fade" mode="out-in">
                    <span :key="siteMBCPatientsPCL5moreThanOnePercent">
                      {{ siteMBCPatientsPCL5moreThanOnePercent }}%
                    </span>
                  </transition>
                </h4>
              </div>
            </stats-card>
          </div>
        </div>

        <!-- Provider Section Header PCL5 -->
        <div class="row d-flex justify-content-center">
          <h4 class="section-head">Providers</h4>
        </div>

          <!--  FAQ -->
          <div
            style="
              align-items: center;
              display: flex;
              justify-content: center;
              margin-top: 20px;
            "
          >
            <div style="width: 60%; margin-bottom: 10px">
              <VueFaqAccordion :items="PCL5AdministrationsAndProviders" />
            </div>
          </div>

        <div class="d-flex flex-row justify-content-center">
          <!-- <div class="col-xl-3 col-md-3">
            <div class="d-flex flex-row justify-content-center mt-2 mb-2">
              Administering Providers PCL5s
            </div>
            <stats-card>
              <div slot="header" class="icon-warning">
                <i class="nc-icon-outline nc-single-01 text-warning"></i>
              </div>
              <div slot="content">
                <p class="card-category">
                  Administering Providers<br />
                </p>
                <h4 class="card-title">
                  <transition name="fade" mode="out-in">
                    <span :key="siteMBCPatientsPCL5oneOrMorePercent">
                      {{ formatNumber(siteMBCProvidersPCL5Total) }}
                    </span>
                  </transition>
                </h4>
              </div>
            </stats-card>
          </div>  -->

          <div class="col-xl-3 col-md-3">
            <div class="d-flex flex-row justify-content-center mt-2 mb-2">
              Encounter Providers PCL5s
            </div>
            <stats-card>
              <div slot="header" class="icon-warning">
                <i class="nc-icon-outline nc-single-01 text-warning"></i>
              </div>
              <div slot="content">
                <p class="card-category">
                  Primary Providers<br />
                  ({{ formatNumber(siteMBCProvidersPrimaryPCL5Total) }}/
                  {{ formatNumber(siteMBCProvidersTotal) }})
                </p>
                <h4 class="card-title">
                  <transition name="fade" mode="out-in">
                    <span :key="siteMBCProvidersPrimaryPCL5Percent">
                      {{ siteMBCProvidersPrimaryPCL5Percent }}%
                    </span>
                  </transition>
                </h4>
              </div>
            </stats-card>
          </div>
        </div>

        <div v-if="!phipii && !selectedSiteVISNorNATIONAL">
          <!-- Section Header -->
          <div class="row d-flex justify-content-center">
            <h4 class="section-head">
              Team-Based Care PCL5 Data Details for Patient Panels
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
        <div v-else-if="!selectedSiteVISNorNATIONAL">
          <!-- Section Header -->
          <div class="row d-flex justify-content-center">
            <h4 class="section-head">
              Team-Based Care PCL5 Data Details for Patient Panels
            </h4>
          </div>
          <!-- <div class="d-flex flex-row justify-content-center mt-2 mb-2">
            Encounters Are Number of Encounters Where Provider is Listed as
            Primary
          </div> -->
          <div class="d-flex flex-row justify-content-center mt-2 mb-2">
            <b>Note:&nbsp;&nbsp;&nbsp;</b> This table displays the number of patients who have received PCL-5s that a primary PCT encounter provider has seen during the selected time-frame. The provider does not have to be the person who administered the PCL. For this table, if a veteran is seen by more than one provider for the timeframe both providers are credited for the patient’s PCL-5 information (as consistent with team-based-care it does not matter who in the PCT gave them the PCL-5).
          </div>


          <!-- Section Header Survey Provider Primary and Orderer Table-->
          <div class="row d-flex justify-content-center">
            <h4 class="section-head">
              <!-- Administering Providers and Encounter Providers Details -->
            </h4>
          </div>

          <div class="row justify-content-center">
            <div class="col-md-12">
              <card>
                <template slot="header">
                  <span>Hover Over Column Header to View Menu</span>
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
                  :rowDataChanged="onRowDataChanged2"
                  :enableFilter="true"
                  :enableSorting="true"
                  :enableColResize="true"
                >
                </ag-grid-vue>
                <template slot="footer">
                  <div class="legend">
                    Detailed Orderers and Encounter Providers
                  </div>
                </template>
              </card>
            </div>
          </div>
        </div>

        <!-- Section Header -->
        <div class="row d-flex justify-content-center">
          <h4 class="section-head">All Surveys Summary</h4>
        </div>

        <!--  FAQ -->
        <div
          style="align-items: center; display: flex; justify-content: center"
        >
          <div style="width: 60%; margin-bottom: 10px">
            <VueFaqAccordion :items="SurveysSummary" />
          </div>
        </div>

        <div class="row d-flex justify-content-center">
          <!-- siteSurveyTotals -->
          <div class="col-xl-3 col-md-3">
            <stats-card :key="siteSurveyTotals.surveysGivenOverall">
              <div slot="header" class="icon-warning">
                <i class="nc-icon nc-paper-2 text-warning"></i>
              </div>
              <div slot="content">
                <p class="card-category">Total Surveys Given</p>
                <!-- <h4 class="card-title">{{ siteEncounterCPTAssessment.total }}/{{ siteEncounterCPTAssessment.percent }}%</h4> -->
                <h4 class="card-title">
                  {{ addCommas(siteSurveyTotals.surveysGivenOverall) }}
                </h4>
              </div>
            </stats-card>
          </div>
        </div>

        <!--  FAQ -->
        <!-- <div
          style="align-items: center; display: flex; justify-content: center"
        >
          <div style="width: 60%; margin-bottom: 10px">
            <VueFaqAccordion :items="ClinicsProvidersPatients" />
          </div>
        </div> -->

        <!-- Section Header -->
        <!-- <div class="row d-flex justify-content-center"></div> -->
        <!-- <div class="row d-flex justify-content-center">
          <div class="col-xl-3 col-md-4">
            <h4 class="section-head d-flex justify-content-center">Clinics</h4>
            <stats-card :key="siteSurveyClinicTotals.surveysGivenClinics">
              <div slot="header" class="icon-warning">
                <i class="nc-icon-outline nc-home-52 text-warning"></i>
              </div>
              <div slot="content">
                <p class="card-category">
                  Surveys in Clinics / <br />All Clinics
                </p>
                <h4 class="card-title">
                  {{ addCommas(siteSurveyClinicTotals.surveysGivenClinics) }}/{{
                    addCommas(siteSurveyClinicTotals.surveysTotalClinics)
                  }}
                </h4>
              </div>
            </stats-card>
          </div>
         
          <div class="col-xl-3 col-md-4">
            <h4 class="section-head d-flex justify-content-center">
              Providers
            </h4>
            <div class="d-flex flex-row justify-content-center mt-2 mb-2">
              Administering and Encounter Providers
            </div>
            <stats-card :key="siteSurveyProviderTotals.surveysGivenProviders">
              <div slot="header" class="icon-warning">
                <i class="nc-icon nc-badge text-warning"></i>
              </div>
              <div slot="content">
                <p class="card-category">
                  Surveys by Providers / <br />All Providers
                </p>
                <h4 class="card-title">
                  {{
                    addCommas(siteSurveyProviderTotals.surveysGivenProviders)
                  }}/{{
                    addCommas(siteSurveyProviderTotals.surveysTotalProviders)
                  }}
                </h4>
              </div>
            </stats-card>
          </div>

          <div class="col-xl-3 col-md-4">
            <h4 class="section-head d-flex justify-content-center">Patients</h4>
            <div class="d-flex flex-row justify-content-center mt-2 mb-2">
              Patients Being Administered Surveys
            </div>
            <stats-card :key="siteSurveyPatientTotals.surveysGivenPatients">
              <div slot="header" class="icon-warning">
                <i class="nc-icon-outline nc-multiple-11 text-warning"></i>
              </div>
              <div slot="content">
                <p class="card-category">
                  Surveys by Patients / <br />All Patients Seen
                </p>
                <h4 class="card-title">
                  {{
                    addCommas(siteSurveyPatientTotals.surveysGivenPatients)
                  }}/{{
                    addCommas(siteSurveyPatientTotals.surveysTotalPatients)
                  }}
                </h4>
              </div>
            </stats-card>
          </div>
        </div> -->

        <!-- Section Header -->
        <div class="row d-flex justify-content-center">
          <h4 class="section-head">Survey Types Given</h4>
        </div>

        <!--  FAQ -->
        <div
          style="align-items: center; display: flex; justify-content: center"
        >
          <div style="width: 60%; margin-bottom: 10px">
            <VueFaqAccordion :items="SurveyTypesGiven" />
          </div>
        </div>

        <div class="row justify-content-center">
          <div class="col-md-6">
            <card>
              <template slot="header">
                <span>Hover Over Column Header to View Menu</span>
                <button
                  class="float-right"
                  @click="gridOptions.api.exportDataAsCsv()"
                >
                  Export to CSV
                </button>
              </template>
              <ag-grid-vue
                style="font-size: 12px; height: 500px"
                class="ag-theme-balham grid"
                :gridOptions="gridOptions"
                :columnDefs="columnDefs"
                :rowData="rowData"
                :rowDataChanged="onRowDataChanged"
                :enableFilter="true"
                :enableSorting="true"
                :enableColResize="true"
              >
              </ag-grid-vue>
              <template slot="footer">
                <div class="legend">Detailed Survey Listing</div>
              </template>
            </card>
          </div>
        </div>

        <div v-if="!phipii && !selectedSiteVISNorNATIONAL">
          <!-- Section Header -->
          <div class="row d-flex justify-content-center">
            <h4 class="section-head">Surveys to Patients - By Provider</h4>
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
        <div v-else-if="!selectedSiteVISNorNATIONAL">
          <!-- Section Header -->
          <div class="row d-flex justify-content-center">
            <h4 class="section-head">Surveys to Patients - By Provider</h4>
          </div>
          <div class="row d-flex justify-content-center">
            (Surveys Without a Total Score Are Listed Item-By-Item, e.g. C-SSRS)
          </div>

          <!--  FAQ -->
          <div
            style="
              align-items: center;
              display: flex;
              justify-content: center;
              margin-top: 20px;
            "
          >
            <div style="width: 60%; margin-bottom: 10px">
              <VueFaqAccordion :items="SurveysToPatientsByProvider" />
            </div>
          </div>

          <div class="row justify-content-center">
            <div class="col-md-12">
              <card>
                <template slot="header">
                  <!-- <span>Hover Over Column Header to View Menu</span> -->
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
                  :rowDataChanged="onRowDataChanged1"
                  :enableFilter="true"
                  :enableSorting="true"
                  :enableColResize="true"
                >
                </ag-grid-vue>
                <template slot="footer">
                  <div class="legend">Patient Survey Listing</div>
                </template>
              </card>
            </div>
          </div>
          <!-- Display if PHIPII -->
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import StatsCard from "src/components/UIComponents/Cards/StatsCard.vue";
import Card from "src/components/UIComponents/Cards/Card.vue";

import Vue from "vue";
import { AgGridVue } from "ag-grid-vue";

import VueFaqAccordion from "vue-faq-accordion";
import {
  PCL5Administrations,
  PCL5AdministrationsAndPatientEncounters,
  PCL5AdministrationsAndProviders,
  SurveysSummary,
  ClinicsProvidersPatients,
  SurveyTypesGiven,
  SurveysToPatientsByProvider,
} from "../Documentation/mbc_doc.js";

import { addCommas, totalAndPercent, precise_round } from "src/utils";

import { mapState, mapGetters, mapActions } from "vuex";
// surveysGivenOverall
export default {
  name: "mbc",
  components: {
    Card,
    StatsCard,
    AgGridVue,
    VueFaqAccordion,
  },
  data() {
    return {
      //     gridOptions: null,
      //     gridOptions1: null,
      PCL5Administrations: PCL5Administrations, 
      PCL5AdministrationsAndPatientEncounters: PCL5AdministrationsAndPatientEncounters,
      PCL5AdministrationsAndProviders: PCL5AdministrationsAndProviders,
      SurveysSummary: SurveysSummary,
      ClinicsProvidersPatients: ClinicsProvidersPatients,
      SurveyTypesGiven: SurveyTypesGiven,
      SurveysToPatientsByProvider: SurveysToPatientsByProvider,

      // SurveysSummary: [
      //   {
      //     title: "Surveys Summary",
      //     value: "<u><b>Description</b></u>: These are the total number of surveys (measures) administered.  Only completed surveys are tallied and displayed here.",
      //     category: "Surveys Summary Defined..."
      //   }
      // ],
      // ClinicsProvidersPatients: [
      //   {
      //     title: "Clinics",
      //     value: "<u><b>Description</b></u>: These are the number of PCT clinics administering surveys among all PCT clinics at this site. The intent is to show how many PCT Clinics " +
      //     "are administering surveys in the course of their activities.<br/><br/>" +
      //     "The numerator is the number of PCT clinics (based on clinic PCT Stop Codes) administering surveys, and the denominator is the number of PCT clinics at this site.  ",
      //     category: "Clinics, Providers, Patients Defined ..."
      //   },
      //   {
      //     title: "Providers",
      //     value: "<u><b>Description</b></u>:These are the number of PCT providers administering surveys among all PCT providers at this site. The intent is to show how many PCT providers " +
      //     "are administering surveys in the course of their activities.<br/><br/>" +
      //     "The numerator is the number of PCT providers (based on PCT Stop Codes) administering surveys, and the denominator is the number of PCT providers seeing patients at this site.  ",
      //     category: "Clinics, Providers, Patients Defined ..."
      //   },
      //   {
      //     title: "Patients",
      //     value: "<u><b>Description</b></u>:These are the number of PCT patients administering surveys among all PCT patients at this site. The intent is to show the relative percentage of PCT patients " +
      //     "are administerered surveys in the course of their assessment/treatment.<br/><br/>" +
      //     "The numerator is the number of PCT patients (based on PCT Stop Codes) being administered surveys, and the denominator is the number of PCT patients with encounters at this site.  ",
      //     category: "Clinics, Providers, Patients Defined ..."
      //   }
      // ],
      // SurveyTypesGiven: [
      //   {
      //     title: "SurveyTypesGiven",
      //     value: "<u><b>Description</b></u>: Theses are counts of the number of surveys (measures) administered within PCT clinics at this site. ",
      //     category: "Survey Types Given Defined..."
      //   }
      // ],
      // SurveysToPatientsByProvider: [
      //   {
      //     title: "Surveys To Patients By Provider",
      //     value: "<u><b>Description</b></u>: The Surveys To Patients By Provider table lists the surveys and survey scores administered to each patient by each provider in each PCT Clinic. " +
      //     "<br/><br/><font color='red'><b>NOTE:</b> While most PCT administered surveys are listed in the table with a total score on one table row (e.g. PCL-5, PHQ9), several of the FY19 screening measures are listed by individual item score - one row per item (e.g. PHQ2-I9, CSSRS). " +
      //     "As a result, at first glance it may appear that a screening measure is incorrectly duplicated, but a closer look will reveal the multiple rows are correctly listing item level scores. ",
      //     category: "Surveys To Patients By Provider Defined..."
      //   }
      // ]
    };
  },
  computed: {
    ...mapGetters([
      "siteSurveyTotals",
      "siteSurveyClinicTotals",
      "siteSurveyProviderTotals",
      "siteSurveyPatientTotals",
      "siteSurveyDetails",
      "siteSurveyPatientDetails",

      "siteMBCPCL5",
      "siteMBCProvidersTotal",
      "siteMBCProvidersPCL5Total",
      "siteMBCProvidersPrimaryPCL5Total",
      "siteMBCPatientsTotalWith2orMoreSessions",
      "siteMBCPatientsTotal",
      "siteMBCPatientsPCL5oneOrMore",
      "siteMBCPatientsPCL5moreThanOne",
      "siteMBCProvidersPrimaryAndOrdererPCL5Totals",
    ]),
    ...mapState([
      "selectedSite",
      "phipii",
      "selectedInstitutions",
      "selectedInstitutionsNames",
      "disclaimer",
      "dataError",
    ]),
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
    rowData() {
      // console.log('here is siteSurveyDetails from store ', this.siteSurveyDetails)
      return this.siteSurveyDetails; // filters when site changes
    },
    rowData1() {
      // console.log('here is siteSurveyPatientDetails from store ', this.siteSurveyPatientDetails)
      return this.siteSurveyPatientDetails; // filters when site changes
    },
    rowData2() {
      // console.log(
      //   // "here is siteMBCProvidersPrimaryAndOrdererPCL5Totals from store ",
      //   this.siteMBCProvidersPrimaryAndOrdererPCL5Totals
      // );
      return this.siteMBCProvidersPrimaryAndOrdererPCL5Totals; // filters when site changes
    },

    siteMBCProvidersPCL5Percent() {
      let percent =
        (+this.siteMBCProvidersPCL5Total / +this.siteMBCProvidersTotal) * 100;
      return precise_round(percent, 1);
    },
    siteMBCProvidersPrimaryPCL5Percent() {
      let percent =
        (+this.siteMBCProvidersPrimaryPCL5Total / +this.siteMBCProvidersTotal) *
        100;
      return precise_round(percent, 1);
    },
    siteMBCPatientsPCL5oneOrMorePercent() {
      let percent =
        (+this.siteMBCPatientsPCL5oneOrMore / +this.siteMBCPatientsTotal) * 100;
      return precise_round(percent, 1);
    },
    siteMBCPatientsPCL5moreThanOnePercent() {
      let percent =
        (+this.siteMBCPatientsPCL5moreThanOne /
          +this.siteMBCPatientsTotalWith2orMoreSessions) *
        100;
      return precise_round(percent, 1);
    },
  },
  beforeMount() {
    (this.gridOptions = {
      suppressPropertyNamesCheck: true,
    }),
      (this.gridOptions1 = {
        // groupHideOpenParents: true,

        autoGroupColumnDef: {
          headerName: "Staff / Patient / Clinic",
          field: "StaffName",
          field: "LocationName",
          cellRendererParams: {
            suppressCount: true,
          },
        },
        suppressPropertyNamesCheck: true,
      }),
      (this.gridOptions2 = {
        suppressPropertyNamesCheck: true,
      }),
      (this.columnDefs = this.createColDefs()),
      (this.columnDefs1 = this.createColDefs1()),
      (this.columnDefs2 = this.createColDefs2()),
      (this.onFilterChanged = function () {
        console.log("filter changed!!");
      });
  },
  mounted() {
    this.CURRENT_PAGE("surveys");

    this.SURVEY_TOTALS();
    this.SURVEY_DETAILS();
    this.SURVEY_PATIENT_DETAILS();
    this.SURVEY_PCL5();
    this.SURVEY_PCL5_PROVIDERS();

    this.GET_INSTITUTIONS();
  },
  methods: {
    ...mapActions([
      "SURVEY_TOTALS",
      "SURVEY_DETAILS",
      "SURVEY_PATIENT_DETAILS",
      "SURVEY_PCL5",
      "SURVEY_PCL5_PROVIDERS",
      "CURRENT_PAGE",
      "GET_INSTITUTIONS",
    ]),
    addCommas,
    formatNumber(num) {
      return addCommas(num);
    },
    exportCSVgridOptions1() {
      let params = {
        // define the fields for export
        columnKeys: [
          "OrderedBy",
          "LocationName",
          "NL4",
          "SurveyGivenDateTime",
          "SurveyName",
          "RawScore",
        ],
        fileName: "survey_details",
        columnGroups: false,
        allColumns: true,
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
    createColDefs() {
      return [
        {
          headerName: "Surveys",
          children: [
            {
              headerName: "Site",
              field: "StaPa",
              width: 25,
              cellStyle: { "text-align": "left" },
              filter: "agTextColumnFilter",
              cellRenderer: "agGroupCellRenderer",
            },
            {
              headerName: "Survey Name",
              field: "SurveyName",
              width: 50,
              cellStyle: { "text-align": "left" },
              filter: "agTextColumnFilter",
            },
            {
              headerName: "Total",
              field: "numSurveys",
              width: 25,
              cellStyle: { "text-align": "left" },
              filter: "agNumberColumnFilter",
            },
          ],
        },
      ];
    },
    createColDefs1() {
      return [
        // {
        // headerName: "Surveys By Patient",
        // children: [
        {
          headerName: "Provider",
          field: "OrderedBy",
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
          hidden: true,
        },
        {
          headerName: "Patient",
          // field: "InitialsAndL4",
          field: "NL4",
          width: 100,
          cellStyle: { "text-align": "left" },
          filter: "agTextColumnFilter",
          rowGroup: true,
          hide: true,
        },
        {
          headerName: "Survey",
          field: "SurveyName",
          width: 100,
          cellStyle: { "text-align": "left" },
          filter: "agTextColumnFilter",
          // rowGroup: true,
          // hide:true,
        },
        {
          headerName: "Date",
          field: "SurveyGivenDateTime",
          width: 100,
          cellStyle: { "text-align": "left" },
          filter: "agDateColumnFilter",
        },
        {
          headerName: "Score",
          field: "RawScore",
          width: 100,
          cellStyle: { "text-align": "left" },
          filter: "agNumberColumnFilter",
        },
        // ]
        // }
      ];
    },

    createColDefs2() {
      return [
        {
          headerName:
            "Team-Based Care PCL5 Data Details for Patient Panels",
          children: [
            {
              headerName: "Site",
              field: "StaPa",
              width: 15,
              cellStyle: { "text-align": "left" },
              filter: "agTextColumnFilter",
              // cellRenderer: "agGroupCellRenderer",
            },
            {
              headerName: "Provider",
              field: "StaffName",
              width: 45,
              cellStyle: { "text-align": "left" },
              filter: "agTextColumnFilter",
            },
            {
              headerName: "Position Title",
              field: "PositionTitle",
              width: 35,
              cellStyle: { "text-align": "left" },
              filter: "agTextColumnFilter",
            },
            {
              headerName: "Patients w/ At Least One PCL5",
              field: "PatientOneOrMorePCL5",
              width: 45,
              cellStyle: { "text-align": "left" },
              filter: "agTextColumnFilter",
              tooltipField: 'Patients At Least One PCL5'
            },
            {
              headerName: "Patients Seen 2 or More w/ At Least Two PCL5",
              field: "Patient2orMoreSessions2orMorePCL5",
              width: 65,
              cellStyle: { "text-align": "left" },
              filter: "agNumberColumnFilter",
              tooltipField: 'Patients Seen 2 or More and at least One PCL5'
            },
          ]
        }
          
      ];
    },
    createColDefs2a() {
      return [

        {
          headerName:
            "Administering Providers and Primary Providers - Survey and Encounters",
          children: [
            {
              headerName: "Site",
              field: "StaPa",
              width: 11,
              cellStyle: { "text-align": "left" },
              filter: "agTextColumnFilter",
              // cellRenderer: "agGroupCellRenderer",
            },
            {
              headerName: "Provider",
              field: "ProviderOrdererName",
              width: 30,
              cellStyle: { "text-align": "left" },
              filter: "agTextColumnFilter",
            },
            {
              headerName: "Position Title",
              field: "PositionTitle",
              width: 25,
              cellStyle: { "text-align": "left" },
              filter: "agTextColumnFilter",
            },
            {
              headerName: "PCL5s Given",
              field: "sumTotalPCL5",
              width: 20,
              cellStyle: { "text-align": "left" },
              filter: "agNumberColumnFilter",
              tooltipField: 'Total PCL5s Ordered'
            },
            {
              headerName: "Visits",
              field: "sumTotalVisits",
              width: 12,
              cellStyle: { "text-align": "left" },
              filter: "agNumberColumnFilter",
              tooltipField: 'Total Encounters as Primary Provider'
            },
            {
              headerName: "Unique Pts",
              field: "NumPatientsUnique",
              width: 18,
              cellStyle: { "text-align": "left" },
              filter: "agNumberColumnFilter",
              tooltipField: 'Total Unique Patients Seen'
            },
            {
              headerName: "Pts w PCL5 > 1",
              field: "NumPatientsWithMoreThanOnePCL5",
              width: 20,
              cellStyle: { "text-align": "left" },
              filter: "agNumberColumnFilter",
              tooltipField: 'Total Patients Given More Than 1 PCL5'
             },
            {
//     "": "6",
              headerName: "Pts w Visits > 1",
              field: "NumPatientsWithMoreThanOneVisit",
              width: 20,
              cellStyle: { "text-align": "left" },
              filter: "agNumberColumnFilter",
              tooltipField: 'Total Patients Seen More Than Once'
            }
          ],
        },
      ];
    },

    onRowDataChanged() {
      // console.log('row data changed!!')
      Vue.nextTick(() => {
        this.gridOptions.api.sizeColumnsToFit();
      });
    },
    onRowDataChanged1() {
      // console.log('row1 data changed!!')
      Vue.nextTick(() => {
        this.gridOptions1.api.sizeColumnsToFit();
        // this.gridOptions1.api.expandAll();
      });
    },
    onRowDataChanged2() {
      // console.log('row1 data changed!!')
      Vue.nextTick(() => {
        this.gridOptions2.api.sizeColumnsToFit();
        // this.gridOptions2.api.expandAll();
      });
    },
  },
};
</script>
<style>
.filtering {
  background-color: lightgrey;
}

/* fade page in and out when site changes */
.section-head {
  font-size: 2rem;
}

.phipii-warning {
  font-size: 1rem;
}

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
