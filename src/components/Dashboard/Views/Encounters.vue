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

        <!-- <div class="row d-flex justify-content-center"> -->

        <!-- <div class="col-xl-3 col-md-3">
            <stats-card>
              <div slot="header" class="icon-danger">
                <i class="nc-icon nc-vector text-danger"></i>
              </div>
              <div slot="content">
                <p class="card-category">No Show Appts/All ({{ siteEncounterApptNoShowTotal }}/{{ siteEncounterApptTotalStr}})</p>
                <h4 class="card-title">{{  siteEncounterAppNoShowPercent }}%</h4>
              </div>
            </stats-card>
          </div> -->

        <!-- <div class="col-xl-3 col-md-3">
            <stats-card>
              <div slot="header" class="icon-info">
                <i class="nc-icon nc-favourite-28 text-primary"></i>
              </div>
              <div slot="content">
                <p class="card-category">Any Cancelled Appts/All ({{ formatNumber(siteEncounterApptCancelTotal) }}/{{ siteEncounterApptTotalStr }})</p>
                <h4 class="card-title">{{ siteEncounterAppCancelPercent }}%</h4>
              </div>
            </stats-card>
          </div> -->

        <!-- </div> -->

        <!-- <div class="row d-flex justify-content-center">

          <div class="col-md-8">
            <template>
              <vue-highcharts :options="pieChartOptions"  ref="pieChart"></vue-highcharts>
            </template>
          </div>

        </div> -->

        <!-- Section Header -->
        <!-- <div class="row d-flex justify-content-center ">
          <h4 class="section-head">Clinic Level Cancel & No Show Summary</h4>
        </div> -->

        <!-- <div class="d-flex flex-row justify-content-center">

          <div class="col-md-12 ">
            <card>
              <template slot="header">
                <span>Hover Over Column Header to View Menu</span>
              </template>
                <ag-grid-vue style="font-size: 12px; height: 400px" class="ag-theme-balham grid" 
                :gridOptions="gridOptions3" 
                :rowData="rowData3" 
                :gridReady="onGridReady3"
                :enableFilter="true"
                :enableSorting="true"
                :enableColResize="true"
                >
                </ag-grid-vue>
              <template slot="footer">
                <div class="legend">
                  Detailed CPT Categories Listing
                </div>
              </template>
            </card>
          </div>

        </div> -->

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

        <!-- Section Header -->
        <div class="row d-flex justify-content-center">
          <h4 class="section-head">Encounters and Patients</h4>
        </div>

        <!-- EncountersAll FAQ -->
        <div
          style="align-items: center; display: flex; justify-content: center"
        >
          <div style="width: 60%; margin-bottom: 10px">
            <VueFaqAccordion :items="encountersAll" />
          </div>
        </div>

        <div class="row d-flex justify-content-center">
          <div class="col-xl-3 col-md-3">
            <stats-card>
              <div slot="header" class="icon-warning">
                <i class="nc-icon-outline nc-layers-3 text-warning"></i>
              </div>
              <div slot="content">
                <p class="card-category">Total Encounters</p>
                <h4 class="card-title">
                  <transition name="fade" mode="out-in">
                    <span :key="siteEncounterTotal">
                      {{ siteEncounterTotalCount }}
                    </span>
                  </transition>
                </h4>
              </div>
              <!-- <div slot="footer">
                <i class="fa fa-calendar-o"></i>No Duplicates
              </div> -->
            </stats-card>
          </div>

          <div class="col-xl-3 col-md-3">
            <stats-card>
              <div slot="header" class="icon-success">
                <i class="nc-icon nc-single-02 text-warning"></i>
              </div>
              <div slot="content">
                <p class="card-category">Patient Uniques</p>
                <h4 class="card-title">
                  <transition name="fade" mode="out-in">
                    <span :key="siteEncounterPatientTotal">
                      {{ siteEncounterPatientCount }}
                    </span>
                  </transition>
                </h4>
              </div>
            </stats-card>
          </div>
        </div>
        <!-- end of row -->

        <!-- Chart Row -->
        <div class="row d-flex justify-content-center">
          <div class="col-md-8">
            <template>
              <vue-highcharts
                :options="lineChartOptions"
                ref="lineChart"
              ></vue-highcharts>
            </template>
          </div>
        </div>

        <hr />

        <!-- Psychotherapy Section -->
        <div class="row d-flex justify-content-center">
          <h4 class="section-head">Individual Psychotherapy Sessions</h4>
        </div>

        <!-- EncountersPsychotherapy FAQ -->
        <div
          style="align-items: center; display: flex; justify-content: center"
        >
          <div style="width: 60%; margin-bottom: 10px">
            <VueFaqAccordion :items="encountersPsychotherapy" />
          </div>
        </div>

        <div class="d-flex flex-row justify-content-center">
          <div class="col-xl-3 col-md-3">
            <stats-card>
              <div slot="header" class="icon-warning">
                <i class="nc-icon-outline nc-single-01 text-warning"></i>
              </div>
              <div slot="content">
                <p class="card-category">
                  Individual<br />
                  <!-- <transition name="fade" mode="out-in">  -->
                  ({{ formatNumber(siteEncounterCPTIndividual) }}/
                  {{ formatNumber(siteEncounterTotal) }})
                  <!-- </transition> -->
                </p>
                <h4 class="card-title">
                  <transition name="fade" mode="out-in">
                    <span :key="siteEncounterCPTIndividualPercent">
                      {{ siteEncounterCPTIndividualPercent }}%
                    </span>
                  </transition>
                </h4>
              </div>
            </stats-card>
          </div>
        </div>

        <div class="row d-flex justify-content-center">
          <h4 class="section-head">Group Psychotherapy Sessions</h4>
        </div>

        <!-- EncountersPsychotherapy FAQ -->
        <div
          style="align-items: center; display: flex; justify-content: center"
        >
          <div style="width: 60%; margin-bottom: 10px">
            <VueFaqAccordion :items="encounterTelehealthGrp" />
          </div>
        </div>

        <div class="d-flex flex-row justify-content-center">
          <div class="col-xl-3 col-md-3">
            <stats-card>
              <div slot="header" class="icon-warning">
                <i class="nc-icon-outline nc-multiple-11 text-warning"></i>
              </div>
              <div slot="content">
                <p class="card-category">
                  Group<br />
                  <!-- <transition name="fade" mode="out-in">  -->
                  ({{ formatNumber(siteEncounterCPTGroup) }}/
                  {{ formatNumber(siteEncounterTotal) }})
                  <!-- </transition> -->
                </p>
                <h4 class="card-title">
                  <transition name="fade" mode="out-in">
                    <span :key="siteEncounterCPTGroupPercent">
                      {{ siteEncounterCPTGroupPercent }}%
                    </span>
                  </transition>
                </h4>
              </div>
            </stats-card>
          </div>
        </div>

        <!-- Telehealth All -->
        <div class="row d-flex justify-content-center">
          <h4 class="section-head">Telehealth All</h4>
        </div>

        <!-- encounterTelehealthAll FAQ -->
        <div
          style="align-items: center; display: flex; justify-content: center"
        >
          <div style="width: 60%; margin-bottom: 10px">
            <VueFaqAccordion :items="encounterTelehealthAll" />
          </div>
        </div>

        <div class="d-flex flex-row justify-content-center">
          <div class="col-xl-3 col-md-4">
            <stats-card>
              <div slot="header" class="icon-warning">
                <i class="nc-icon-outline nc-single-01 text-success"></i>
              </div>
              <div slot="content">
                <p class="card-category">
                  <b>Video</b><br />To Home<br />
                  <!-- <transition name="fade" mode="out-in">  -->
                  ({{ formatNumber(telehealthHomeAll) }}/
                  {{ formatNumber(formatNumber(siteEncounterTotal)) }})
                  <!-- </transition> -->
                </p>
                <h4 class="card-title">
                  <transition name="fade" mode="out-in">
                    <span :key="siteEncounterTelehealthHomeGrpPercentAll">
                      {{ siteEncounterTelehealthHomeGrpPercentAll }}%
                    </span>
                  </transition>
                </h4>
              </div>
            </stats-card>
          </div>

          <div class="col-xl-3 col-md-4">
            <stats-card>
              <div slot="header" class="icon-warning">
                <i class="nc-icon-outline nc-multiple-11 text-success"></i>
              </div>
              <div slot="content">
                <p class="card-category">
                  <b>Video</b><br />To Associate Facility<br />
                  <!-- <transition name="fade" mode="out-in">  -->
                  ({{ formatNumber(telehealthSameStationAll) }}/
                  {{ formatNumber(formatNumber(siteEncounterTotal)) }})
                  <!-- </transition> -->
                </p>
                <h4 class="card-title">
                  <transition name="fade" mode="out-in">
                    <span
                      :key="siteEncounterTelehealthSameStationGrpPercentAll"
                    >
                      {{ siteEncounterTelehealthSameStationGrpPercentAll }}%
                    </span>
                  </transition>
                </h4>
              </div>
            </stats-card>
          </div>

          <div class="col-xl-3 col-md-4">
            <stats-card>
              <div slot="header" class="icon-warning">
                <i
                  class="nc-icon nc-preferences-circle-rotate text-success"
                ></i>
              </div>
              <div slot="content">
                <p class="card-category">
                  <b>Video</b><br />To Different Station<br />
                  <!-- <transition name="fade" mode="out-in">  -->
                  ({{ formatNumber(telehealthDiffStationAll) }}/
                  {{ formatNumber(formatNumber(siteEncounterTotal)) }})
                  <!-- </transition> -->
                </p>
                <h4 class="card-title">
                  <transition name="fade" mode="out-in">
                    <span
                      :key="siteEncounterTelehealthDiffStationGrpPercentAll"
                    >
                      {{ siteEncounterTelehealthDiffStationGrpPercentAll }}%
                    </span>
                  </transition>
                </h4>
              </div>
            </stats-card>
          </div>
        </div>

        <div class="d-flex flex-row justify-content-center">
          <div class="col-xl-3 col-md-3">
            <stats-card>
              <div slot="header" class="icon-warning">
                <i class="nc-icon-outline nc-single-01 text-warning"></i>
              </div>
              <div slot="content">
                <p class="card-category">
                  Phone Therapy<br />
                  <!-- <transition name="fade" mode="out-in">  -->
                  ({{ formatNumber(telehealthPhoneAllTherapy) }}/
                  {{ formatNumber(siteEncounterTotal) }})
                  <!-- </transition> -->
                </p>
                <h4 class="card-title">
                  <transition name="fade" mode="out-in">
                    <span :key="siteEncounterAllPhoneTherapyPercent">
                      {{ siteEncounterAllPhoneTherapyPercent }}%
                    </span>
                  </transition>
                </h4>
              </div>
            </stats-card>
          </div>
        </div>

        <!-- Psychotherapy Patients Section -->
        <div class="row d-flex justify-content-center">
          <h4 class="section-head">Psychotherapy Patients by Session Types</h4>
        </div>

        <div class="d-flex flex-row justify-content-center">
          <div class="col-xl-3 col-md-4">
            <stats-card>
              <div slot="header" class="icon-warning">
                <i class="nc-icon-outline nc-single-01 text-success"></i>
              </div>
              <div slot="content">
                <p class="card-category">Individual Tx Only</p>
                <h4 class="card-title">
                  <transition name="fade" mode="out-in">
                    <span :key="siteEncounterCPTPatientsIndTherapyOnly">
                      {{ siteEncounterCPTPatientsIndTherapyOnly }} Pts
                    </span>
                  </transition>
                </h4>
              </div>
            </stats-card>
          </div>

          <div class="col-xl-3 col-md-4">
            <stats-card>
              <div slot="header" class="icon-warning">
                <i class="nc-icon-outline nc-multiple-11 text-success"></i>
              </div>
              <div slot="content">
                <p class="card-category">Group Tx Only</p>
                <h4 class="card-title">
                  <transition name="fade" mode="out-in">
                    <span :key="siteEncounterCPTPatientsGrpTherapyOnly">
                      {{ siteEncounterCPTPatientsGrpTherapyOnly }} Pts
                    </span>
                  </transition>
                </h4>
              </div>
            </stats-card>
          </div>

          <div class="col-xl-3 col-md-4">
            <stats-card>
              <div slot="header" class="icon-warning">
                <i
                  class="nc-icon nc-preferences-circle-rotate text-success"
                ></i>
              </div>
              <div slot="content">
                <p class="card-category">Both Ind and Grp Tx</p>
                <h4 class="card-title">
                  <transition name="fade" mode="out-in">
                    <span :key="siteEncounterCPTPatientsBothTherapyOnly">
                      {{ siteEncounterCPTPatientsBothTherapyOnly }} Pts
                    </span>
                  </transition>
                </h4>
              </div>
            </stats-card>
          </div>
        </div>

        <!-- Psychotherapy Patients Section -->
        <div class="row d-flex justify-content-center">
          <h4 class="section-head">Individual Psychotherapy Format</h4>
        </div>

        <!-- encounterTelehealthInd FAQ -->
        <div
          style="align-items: center; display: flex; justify-content: center"
        >
          <div style="width: 60%; margin-bottom: 10px">
            <VueFaqAccordion :items="encounterTelehealthInd" />
          </div>
        </div>

        <div class="d-flex flex-row justify-content-center">
          <div class="col-xl-3 col-md-4">
            <stats-card>
              <div slot="header" class="icon-warning">
                <i class="nc-icon-outline nc-single-01 text-warning"></i>
              </div>
              <div slot="content">
                <p class="card-category">
                  Face To Face<br />
                  <!-- <transition name="fade" mode="out-in">  -->
                  ({{ formatNumber(telehealthFaceToFaceInd) }}/
                  {{ formatNumber(siteEncounterCPTIndividual) }})
                  <!-- </transition> -->
                </p>
                <h4 class="card-title">
                  <transition name="fade" mode="out-in">
                    <span :key="siteEncounterTelehealthFaceToFaceIndPercent">
                      {{ siteEncounterTelehealthFaceToFaceIndPercent }}%
                    </span>
                  </transition>
                </h4>
              </div>
            </stats-card>
          </div>
          | | | |

          <div class="col-xl-3 col-md-4">
            <stats-card>
              <div slot="header" class="icon-warning">
                <i class="nc-icon-outline nc-single-01 text-success"></i>
              </div>
              <div slot="content">
                <p class="card-category">
                  <b>Video</b><br />To Home<br />
                  <!-- <transition name="fade" mode="out-in">  -->
                  ({{ formatNumber(telehealthHomeInd) }}/
                  {{ formatNumber(siteEncounterCPTIndividual) }})
                  <!-- </transition> -->
                </p>
                <h4 class="card-title">
                  <transition name="fade" mode="out-in">
                    <span :key="siteEncounterTelehealthHomeIndPercent">
                      {{ siteEncounterTelehealthHomeIndPercent }}%
                    </span>
                  </transition>
                </h4>
              </div>
            </stats-card>
          </div>

          <div class="col-xl-3 col-md-4">
            <stats-card>
              <div slot="header" class="icon-warning">
                <i class="nc-icon-outline nc-multiple-11 text-success"></i>
              </div>
              <div slot="content">
                <p class="card-category">
                  <b>Video</b><br />To Associate Facility<br />
                  <!-- <transition name="fade" mode="out-in">  -->
                  ({{ formatNumber(telehealthSameStationInd) }}/
                  {{ formatNumber(siteEncounterCPTIndividual) }})
                  <!-- </transition> -->
                </p>
                <h4 class="card-title">
                  <transition name="fade" mode="out-in">
                    <span :key="siteEncounterTelehealthSameStationIndPercent">
                      {{ siteEncounterTelehealthSameStationIndPercent }}%
                    </span>
                  </transition>
                </h4>
              </div>
            </stats-card>
          </div>

          <div class="col-xl-3 col-md-4">
            <stats-card>
              <div slot="header" class="icon-warning">
                <i
                  class="nc-icon nc-preferences-circle-rotate text-success"
                ></i>
              </div>
              <div slot="content">
                <p class="card-category">
                  <b>Video</b><br />To Different Station<br />
                  <!-- <transition name="fade" mode="out-in">  -->
                  ({{ formatNumber(telehealthDiffStationInd) }}/
                  {{ formatNumber(siteEncounterCPTIndividual) }})
                  <!-- </transition> -->
                </p>
                <h4 class="card-title">
                  <transition name="fade" mode="out-in">
                    <span :key="siteEncounterTelehealthDiffStationIndPercent">
                      {{ siteEncounterTelehealthDiffStationIndPercent }}%
                    </span>
                  </transition>
                </h4>
              </div>
            </stats-card>
          </div>
        </div>

        <div class="d-flex flex-row justify-content-center">
          <div class="col-xl-3 col-md-3">
            <stats-card>
              <div slot="header" class="icon-warning">
                <i class="nc-icon-outline nc-single-01 text-warning"></i>
              </div>
              <div slot="content">
                <p class="card-category">
                  By Phone<br />
                  <!-- <transition name="fade" mode="out-in">  -->
                  ({{ formatNumber(telehealthPhoneIndTherapy) }}/
                  {{ formatNumber(siteEncounterCPTIndividual) }})
                  <!-- </transition> -->
                </p>
                <h4 class="card-title">
                  <transition name="fade" mode="out-in">
                    <span :key="siteEncounterIndividualPhoneTherapyPercent">
                      {{ siteEncounterIndividualPhoneTherapyPercent }}%
                    </span>
                  </transition>
                </h4>
              </div>
            </stats-card>
          </div>
        </div>


        <!-- Psychotherapy Patients Section -->
        <div class="row d-flex justify-content-center">
          <h4 class="section-head">
            Individual Psychotherapy Format (with E&M)
          </h4>
        </div>

        <!-- encounterTelehealthInd FAQ -->
        <div
          style="align-items: center; display: flex; justify-content: center"
        >
          <div style="width: 60%; margin-bottom: 10px">
            <VueFaqAccordion :items="encounterTelehealthIndEM" />
          </div>
        </div>

        <div class="d-flex flex-row justify-content-center">
          <div class="col-xl-3 col-md-4">
            <stats-card>
              <div slot="header" class="icon-warning">
                <i class="nc-icon-outline nc-single-01 text-warning"></i>
              </div>
              <div slot="content">
                <p class="card-category">
                  Face To Face<br />
                  <!-- <transition name="fade" mode="out-in">  -->
                  ({{ formatNumber(telehealthFaceToFaceIndEM) }}/
                  {{ formatNumber(siteEncounterCPTIndividual) }})
                  <!-- </transition> -->
                </p>
                <h4 class="card-title">
                  <transition name="fade" mode="out-in">
                    <span :key="siteEncounterTelehealthFaceToFaceIndPercentEM">
                      {{ siteEncounterTelehealthFaceToFaceIndPercentEM }}%
                    </span>
                  </transition>
                </h4>
              </div>
            </stats-card>
          </div>
          | | | |

          <div class="col-xl-3 col-md-4">
            <stats-card>
              <div slot="header" class="icon-warning">
                <i class="nc-icon-outline nc-single-01 text-success"></i>
              </div>
              <div slot="content">
                <p class="card-category">
                  <b>Video</b><br />To Home<br />
                  <!-- <transition name="fade" mode="out-in">  -->
                  ({{ formatNumber(telehealthHomeIndEM) }}/
                  {{ formatNumber(siteEncounterCPTIndividual) }})
                  <!-- </transition> -->
                </p>
                <h4 class="card-title">
                  <transition name="fade" mode="out-in">
                    <span :key="siteEncounterTelehealthHomeIndPercentEM">
                      {{ siteEncounterTelehealthHomeIndPercentEM }}%
                    </span>
                  </transition>
                </h4>
              </div>
            </stats-card>
          </div>

          <div class="col-xl-3 col-md-4">
            <stats-card>
              <div slot="header" class="icon-warning">
                <i class="nc-icon-outline nc-multiple-11 text-success"></i>
              </div>
              <div slot="content">
                <p class="card-category">
                  <b>Video</b><br />To Associate Facility<br />
                  <!-- <transition name="fade" mode="out-in">  -->
                  ({{ formatNumber(telehealthSameStationIndEM) }}/
                  {{ formatNumber(siteEncounterCPTIndividual) }})
                  <!-- </transition> -->
                </p>
                <h4 class="card-title">
                  <transition name="fade" mode="out-in">
                    <span :key="siteEncounterTelehealthSameStationIndPercentEM">
                      {{ siteEncounterTelehealthSameStationIndPercentEM }}%
                    </span>
                  </transition>
                </h4>
              </div>
            </stats-card>
          </div>

          <div class="col-xl-3 col-md-4">
            <stats-card>
              <div slot="header" class="icon-warning">
                <i
                  class="nc-icon nc-preferences-circle-rotate text-success"
                ></i>
              </div>
              <div slot="content">
                <p class="card-category">
                  <b>Video</b><br />To Different Station<br />
                  <!-- <transition name="fade" mode="out-in">  -->
                  ({{ formatNumber(telehealthDiffStationIndEM) }}/
                  {{ formatNumber(siteEncounterCPTIndividual) }})
                  <!-- </transition> -->
                </p>
                <h4 class="card-title">
                  <transition name="fade" mode="out-in">
                    <span :key="siteEncounterTelehealthDiffStationIndPercentEM">
                      {{ siteEncounterTelehealthDiffStationIndPercentEM }}%
                    </span>
                  </transition>
                </h4>
              </div>
            </stats-card>
          </div>
        </div>

        <div class="d-flex flex-row justify-content-center">
          <div class="col-xl-3 col-md-3">
            <stats-card>
              <div slot="header" class="icon-warning">
                <i class="nc-icon-outline nc-single-01 text-warning"></i>
              </div>
              <div slot="content">
                <p class="card-category">
                  By Phone<br />
                  <!-- <transition name="fade" mode="out-in">  -->
                  ({{ formatNumber(telehealthPhoneIndTherapyEM) }}/
                  {{ formatNumber(siteEncounterCPTIndividual) }})
                  <!-- </transition> -->
                </p>
                <h4 class="card-title">
                  <transition name="fade" mode="out-in">
                    <span :key="siteEncounterIndividualPhoneTherapyPercentEM">
                      {{ siteEncounterIndividualPhoneTherapyPercentEM }}%
                    </span>
                  </transition>
                </h4>
              </div>
            </stats-card>
          </div>
        </div>

        <!-- <div class="d-flex flex-row justify-content-center">

          <div class="col-xl-3 col-md-3">
             <stats-card>
              <div slot="header" class="icon-warning">
                <i class="nc-icon-outline nc-single-01 text-warning"></i>
              </div> 
              <div slot="content">
                <p class="card-category">Phone and Telehealth<br/>
                  <transition name="fade" mode="out-in"> 
                   CODING ERROR!!
                  </transition>
                </p>
                <h4 class="card-title">
                  <transition name="fade" mode="out-in">
                    <span :key="siteEncounterIndividualPhoneTherapyPercent">
                      {{ siteEncounterIndividualPhoneTherapyPercent}}%
                    </span>
                  </transition>
                </h4>
                <table style="width: 100%;">
                  <tr><th>Station</th><th>Station Name</th><th>Psychotherapy</th><th>Primary Stop</th><th>Secondary Stop</th></tr>
                  <tr><td>637</td><td>Jesse Brown</td><td>Individual</td><td>542</td><td>179</td></tr>
                </table>

              </div>

          </div>

        </div> -->

        <!-- Group Psychotherapy Section -->
        <!-- Psychotherapy Patients Section -->
        <div class="row d-flex justify-content-center">
          <h4 class="section-head">Group Psychotherapy Format</h4>
        </div>

        <!-- encounterTelehealthGrp FAQ -->
        <div
          style="align-items: center; display: flex; justify-content: center"
        >
          <div style="width: 60%; margin-bottom: 10px">
            <VueFaqAccordion :items="encounterTelehealthGrp" />
          </div>
        </div>

        <div class="d-flex flex-row justify-content-center">
          <div class="col-xl-3 col-md-4">
            <stats-card>
              <div slot="header" class="icon-warning">
                <i class="nc-icon-outline nc-single-01 text-warning"></i>
              </div>
              <div slot="content">
                <p class="card-category">
                  Face To Face<br />
                  <!-- <transition name="fade" mode="out-in">  -->
                  ({{ formatNumber(telehealthFaceToFaceGrp) }}/
                  {{ formatNumber(siteEncounterCPTGroup) }})
                  <!-- </transition> -->
                </p>
                <h4 class="card-title">
                  <transition name="fade" mode="out-in">
                    <span :key="siteEncounterTelehealthFaceToFaceGrpPercent">
                      {{ siteEncounterTelehealthFaceToFaceGrpPercent }}%
                    </span>
                  </transition>
                </h4>
              </div>
            </stats-card>
          </div>
          | | | |

          <div class="col-xl-3 col-md-4">
            <stats-card>
              <div slot="header" class="icon-warning">
                <i class="nc-icon-outline nc-single-01 text-success"></i>
              </div>
              <div slot="content">
                <p class="card-category">
                  <b>Video</b><br />To Home<br />
                  <!-- <transition name="fade" mode="out-in">  -->
                  ({{ formatNumber(telehealthHomeGrp) }}/
                  {{ formatNumber(siteEncounterCPTGroup) }})
                  <!-- </transition> -->
                </p>
                <h4 class="card-title">
                  <transition name="fade" mode="out-in">
                    <span :key="siteEncounterTelehealthHomeGrpPercent">
                      {{ siteEncounterTelehealthHomeGrpPercent }}%
                    </span>
                  </transition>
                </h4>
              </div>
            </stats-card>
          </div>

          <div class="col-xl-3 col-md-4">
            <stats-card>
              <div slot="header" class="icon-warning">
                <i class="nc-icon-outline nc-multiple-11 text-success"></i>
              </div>
              <div slot="content">
                <p class="card-category">
                  <b>Video</b><br />To Associate Facility<br />
                  <!-- <transition name="fade" mode="out-in">  -->
                  ({{ formatNumber(telehealthSameStationGrp) }}/
                  {{ formatNumber(siteEncounterCPTGroup) }})
                  <!-- </transition> -->
                </p>
                <h4 class="card-title">
                  <transition name="fade" mode="out-in">
                    <span :key="siteEncounterTelehealthSameStationGrpPercent">
                      {{ siteEncounterTelehealthSameStationGrpPercent }}%
                    </span>
                  </transition>
                </h4>
              </div>
            </stats-card>
          </div>

          <div class="col-xl-3 col-md-4">
            <stats-card>
              <div slot="header" class="icon-warning">
                <i
                  class="nc-icon nc-preferences-circle-rotate text-success"
                ></i>
              </div>
              <div slot="content">
                <p class="card-category">
                  <b>Video</b><br />To Different Station<br />
                  <!-- <transition name="fade" mode="out-in">  -->
                  ({{ formatNumber(telehealthDiffStationGrp) }}/
                  {{ formatNumber(siteEncounterCPTGroup) }})
                  <!-- </transition> -->
                </p>
                <h4 class="card-title">
                  <transition name="fade" mode="out-in">
                    <span :key="siteEncounterTelehealthDiffStationGrpPercent">
                      {{ siteEncounterTelehealthDiffStationGrpPercent }}%
                    </span>
                  </transition>
                </h4>
              </div>
            </stats-card>
          </div>
        </div>

        <div class="d-flex flex-row justify-content-center">
          <div class="col-xl-3 col-md-3">
            <stats-card>
              <div slot="header" class="icon-warning">
                <i class="nc-icon-outline nc-single-01 text-warning"></i>
              </div>
              <div slot="content">
                <p class="card-category">
                  By Phone<br />
                  <!-- <transition name="fade" mode="out-in">  -->
                  ({{ formatNumber(telehealthPhoneGrpTherapy) }}/
                  {{ formatNumber(siteEncounterCPTGroup) }})
                  <!-- </transition> -->
                </p>
                <h4 class="card-title">
                  <transition name="fade" mode="out-in">
                    <span :key="siteEncounterGroupPhoneTherapyPercent">
                      {{ siteEncounterGroupPhoneTherapyPercent }}%
                    </span>
                  </transition>
                </h4>
              </div>
            </stats-card>
          </div>
        </div>

        <hr />

        <!-- Other Services Section -->
        <div class="row d-flex justify-content-center">
          <h4 class="section-head">Other Services Sessions</h4>
        </div>

        <!-- OtherServices FAQ -->
        <div
          style="align-items: center; display: flex; justify-content: center"
        >
          <div style="width: 60%; margin-bottom: 10px">
            <VueFaqAccordion :items="otherServices" />
          </div>
        </div>

        <div class="d-flex flex-row justify-content-center">
          <div class="col-xl-3 col-md-3">
            <stats-card>
              <div slot="header" class="icon-warning">
                <i class="nc-icon-outline nc-phone-2 text-info"></i>
              </div>
              <div slot="content">
                <p class="card-category">
                  Telephone Encounters<br />({{
                    formatNumber(siteEncounterCPTTelephone.total)
                  }}/{{ formatNumber(siteEncounterTotal) }})
                </p>
                <h4 class="card-title">
                  <transition name="fade" mode="out-in">
                    <span :key="siteEncounterCPTTelephone.percent">
                      {{ siteEncounterCPTTelephone.percent }}%
                    </span>
                  </transition>
                </h4>
              </div>
            </stats-card>
          </div>

          <div class="col-xl-3 col-md-3">
            <stats-card>
              <div slot="header" class="icon-warning">
                <i class="nc-icon-outline nc-multiple-11 text-info"></i>
              </div>
              <div slot="content">
                <p class="card-category">
                  Group Education<br />({{
                    formatNumber(siteEncounterCPTGroupEducation.total)
                  }}/{{ formatNumber(siteEncounterTotal) }})
                </p>
                <h4 class="card-title">
                  <transition name="fade" mode="out-in">
                    <span :key="siteEncounterCPTGroupEducation.percent">
                      {{ siteEncounterCPTGroupEducation.percent }}%
                    </span>
                  </transition>
                </h4>
              </div>
            </stats-card>
          </div>

          <div class="col-xl-3 col-md-3">
            <stats-card>
              <div slot="header" class="icon-warning">
                <i
                  class="nc-icon-outline nc-single-folded-content text-info"
                ></i>
              </div>
              <div slot="content">
                <p class="card-category">
                  Assessment<br />({{
                    formatNumber(siteEncounterCPTAssessment.total)
                  }}/{{ formatNumber(siteEncounterTotal) }})
                </p>
                <h4 class="card-title">
                  <transition name="fade" mode="out-in">
                    <span :key="siteEncounterCPTAssessment.percent">
                      {{ siteEncounterCPTAssessment.percent }}%
                    </span>
                  </transition>
                </h4>
              </div>
            </stats-card>
          </div>

          <div class="col-xl-3 col-md-3">
            <stats-card>
              <div slot="header" class="icon-warning">
                <i class="nc-icon nc-refresh-02 text-info"></i>
              </div>
              <div slot="content">
                <p class="card-category">
                  Prolonged Service<br />({{
                    formatNumber(siteEncounterCPTProlongedService.total)
                  }}/{{ formatNumber(siteEncounterTotal) }})
                </p>
                <h4 class="card-title">
                  <transition name="fade" mode="out-in">
                    <span :key="siteEncounterCPTProlongedService.percent">
                      {{ siteEncounterCPTProlongedService.percent }}%
                    </span>
                  </transition>
                </h4>
              </div>
            </stats-card>
          </div>
        </div>

        <!-- Encounter Categories Section -->
        <div class="row d-flex justify-content-center">
          <h4 class="section-head">Encounters Categories Summary</h4>
        </div>

        <!-- encounterCategories FAQ -->
        <div
          style="align-items: center; display: flex; justify-content: center"
        >
          <div style="width: 60%; margin-bottom: 10px">
            <VueFaqAccordion :items="encounterCategories" />
          </div>
        </div>

        <div class="d-flex flex-row justify-content-center">
          <div class="col-md-8">
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
                style="font-size: 12px; height: 400px"
                class="ag-theme-balham grid"
                :gridOptions="gridOptions2"
                :rowData="rowData2"
                :gridReady="onGridReady2"
                :enableFilter="true"
                :enableSorting="true"
                :enableColResize="true"
              >
              </ag-grid-vue>
              <template slot="footer">
                <div class="legend">Detailed Procedure Categories Listing</div>
              </template>
            </card>
          </div>
        </div>

        <!-- CPT Details Section -->
        <div class="row d-flex justify-content-center">
          <h4 class="section-head">Procedure Code Details</h4>
        </div>

        <!-- encounterCPTDetails FAQ -->
        <div
          style="align-items: center; display: flex; justify-content: center"
        >
          <div style="width: 60%; margin-bottom: 10px">
            <VueFaqAccordion :items="encounterCPTDetails" />
          </div>
        </div>

        <div class="row">
          <div class="col-md-12">
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
                :rowData="rowData"
                :gridReady="onGridReady"
                :enableFilter="true"
                :enableSorting="true"
                :enableColResize="true"
              >
              </ag-grid-vue>
              <template slot="footer">
                <div class="legend">Detailed Encounter Procedure Codes</div>
              </template>
            </card>
          </div>
        </div>
      </div>
      <!-- container-fluid -->
    </div>
    <!-- content -->
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

import VueFaqAccordion from "vue-faq-accordion";
import {
  encountersAll,
  encountersPsychotherapy,
  otherServices,
  encounterCategories,
  encounterCPTDetails,
  encounterTelehealthInd,
  encounterTelehealthIndEM,
  encounterTelehealthGrp,
  encounterTelehealthAll,
} from "../Documentation/encounter_doc.js";

import { addCommas, totalAndPercent, precise_round } from "src/utils";

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
  beforeMount() {
    this.gridOptions = {
      columnDefs: this.createColDefs(),
      rowData: this.rowData, // computed prop
      suppressPropertyNamesCheck: true,
    };

    this.gridOptions2 = {
      columnDefs: this.createColDefs2(),
      rowData: this.rowData2, // computed prop
      suppressPropertyNamesCheck: true,
    };
  },
  mounted() {
    // call action to signal the active page
    this.CURRENT_PAGE("encounters");

    this.ENCOUNTER_COUNT();
    this.ENCOUNTER_LINE_CHART();
    this.ENCOUNTER_PATIENT_LINE_CHART();
    this.ENCOUNTER_CPT_CATEGORIES_PSYCHOTHERAPY();
    this.ENCOUNTER_CPT_CATEGORIES();
    this.ENCOUNTER_CPT();
    this.ENCOUNTER_PATIENT_CPT_CATEGORIES();
    this.ENCOUNTER_TELEHEALTH();
    this.ENCOUNTER_TELEHEALTH_ALL();
    this.ENCOUNTER_FACE_TO_FACE();
    this.ENCOUNTER_PHONE_THERAPY();
    // call action to signal the active page
    this.CURRENT_PAGE("encounters");
    // might be needed to assure institutions are available
    //    when app is opened and saved station is used
    this.GET_INSTITUTIONS();
  },

  computed: {
    ...mapState([
      "selectedSite",
      "selectedRange",
      "selectedInstitutions",
      "selectedInstitutionsNames",
      "disclaimer",
      "dataError",
    ]),
    ...mapGetters([
      "siteEncounterTotal", // all distinct visitsid w/ CPT filtering
      "siteEncounterPatientTotal", // all distinct patientSID w/ CPT filtering
      "siteEncounterLineChartSeries",
      "siteEncounterPatientLineChartSeries",

      "siteEncounterApptTotalStr", // for display

      "siteEncounterCPTTotal",
      "siteEncounterCPTCategories",
      "siteEncounterCPTIndividual",
      "siteEncounterCPTGroup",
      "siteEncounterCPTGroupEducation",
      "siteEncounterCPTAssessment",
      "siteEncounterCPTTelephone",
      "siteEncounterCPTProlongedService",
      "siteEncounterCPTPatientsIndOnly",
      "siteEncounterCPTPatientsGrpOnly",
      "siteEncounterCPTPatientsBoth",

      // telehealth-relate individual therapy
      "siteEncounterIndividualFaceToFace",
      "siteEncounterIndividualPhoneTherapy",
      "siteEncounterTelehealthHomeInd",
      "siteEncounterTelehealthSameStationInd",
      "siteEncounterTelehealthDiffStationInd",

      // telehealth-related individual therapy with E&M codes
      "siteEncounterIndividualFaceToFaceEM",
      "siteEncounterIndividualPhoneTherapyEM",
      "siteEncounterTelehealthHomeIndEM",
      "siteEncounterTelehealthSameStationIndEM",
      "siteEncounterTelehealthDiffStationIndEM",

      // telehealth-relaed group therapy
      "siteEncounterGroupFaceToFace",
      "siteEncounterGroupPhoneTherapy",
      "siteEncounterTelehealthHomeGrp",
      "siteEncounterTelehealthSameStationGrp",
      "siteEncounterTelehealthDiffStationGrp",

      // telehealth-related all - not restricted to therapy
      "siteEncounterTelehealthHomeAll",
      "siteEncounterTelehealthSameStationAll",
      "siteEncounterTelehealthDiffStationAll",

      "siteProviderSelected",
    ]),

    siteEncounterTotalCount() {
      return this.siteEncounterTotal || 0; // all distinct visitsid w/ CPT filtering
    },
    siteEncounterPatientCount() {
      return this.siteEncounterPatientTotal || 0; // all distinct patientSID w/ CPT filtering
    },
    // Psychotherapy Patients by Sessions types - computed
    siteEncounterCPTPatientsIndTherapyOnly() {
      return this.siteEncounterCPTPatientsIndOnly || 0;
    },
    siteEncounterCPTPatientsGrpTherapyOnly() {
      return this.siteEncounterCPTPatientsGrpOnly || 0;
    },
    siteEncounterCPTPatientsBothTherapyOnly() {
      return this.siteEncounterCPTPatientsBoth || 0;
    },

    // Face to face ind and grp therapy
    telehealthFaceToFaceInd() {
      return this.siteEncounterIndividualFaceToFace || 0;
    },
    telehealthFaceToFaceIndEM() {
      return this.siteEncounterIndividualFaceToFaceEM || 0;
    },

    telehealthFaceToFaceGrp() {
      return this.siteEncounterGroupFaceToFace || 0;
    },

    // PHONE INDIVIDUAL THERAPY, GROUP THERAPY AND ALL (COMBINED)
    telehealthPhoneIndTherapy() {
      return this.siteEncounterIndividualPhoneTherapy == undefined
        ? 0
        : this.siteEncounterIndividualPhoneTherapy;
    },
    telehealthPhoneIndTherapyEM() {
      return this.siteEncounterIndividualPhoneTherapyEM == undefined
        ? 0
        : this.siteEncounterIndividualPhoneTherapyEM;
    },
    telehealthPhoneGrpTherapy() {
      return this.siteEncounterGroupPhoneTherapy == undefined
        ? 0
        : this.siteEncounterGroupPhoneTherapy;
    },
    telehealthPhoneAllTherapy() {
      return +this.telehealthPhoneIndTherapy + +this.telehealthPhoneGrpTherapy;
    },

    // telehealth individual therapy
    telehealthHomeInd() {
      // console.log('in fn telehealthHomeInd, siteEncounterTelehealthHomeInd is: ', this.siteEncounterTelehealthHomeInd)
      return this.siteEncounterTelehealthHomeInd == undefined
        ? 0
        : this.siteEncounterTelehealthHomeInd;
    },
    telehealthHomeIndEM() {
      // console.log('in fn telehealthHomeIndEM, siteEncounterTelehealthHomeIndEM is: ', this.siteEncounterTelehealthHomeIndEM)
      return this.siteEncounterTelehealthHomeIndEM == undefined
        ? 0
        : this.siteEncounterTelehealthHomeIndEM;
    },
    telehealthSameStationInd() {
      return this.siteEncounterTelehealthSameStationInd == undefined
        ? 0
        : this.siteEncounterTelehealthSameStationInd;
    },
    telehealthSameStationIndEM() {
      return this.siteEncounterTelehealthSameStationIndEM == undefined
        ? 0
        : this.siteEncounterTelehealthSameStationIndEM;
    },
    telehealthDiffStationInd() {
      return this.siteEncounterTelehealthDiffStationInd == undefined
        ? 0
        : this.siteEncounterTelehealthDiffStationInd;
    },
    telehealthDiffStationIndEM() {
      return this.siteEncounterTelehealthDiffStationIndEM == undefined
        ? 0
        : this.siteEncounterTelehealthDiffStationIndEM;
    },

    // telehealth group therapy
    telehealthHomeGrp() {
      // console.log('telehealthHomeGrp received this: ', this.siteEncounterTelehealthHomeGrp)
      return this.siteEncounterTelehealthHomeGrp == undefined
        ? 0
        : this.siteEncounterTelehealthHomeGrp;
    },
    telehealthSameStationGrp() {
      return this.siteEncounterTelehealthSameStationGrp == undefined
        ? 0
        : this.siteEncounterTelehealthSameStationGrp;
    },
    telehealthDiffStationGrp() {
      return this.siteEncounterTelehealthDiffStationGrp == undefined
        ? 0
        : this.siteEncounterTelehealthDiffStationGrp;
    },

    // telehealth all - No ind or grp therapy filtering
    telehealthHomeAll() {
      // console.log('telehealthHomeGrp received this: ', this.siteEncounterTelehealthHomeGrp)
      return this.siteEncounterTelehealthHomeAll == undefined
        ? 0
        : this.siteEncounterTelehealthHomeAll;
    },
    telehealthSameStationAll() {
      return this.siteEncounterTelehealthSameStationAll == undefined
        ? 0
        : this.siteEncounterTelehealthSameStationAll;
    },
    telehealthDiffStationAll() {
      return this.siteEncounterTelehealthDiffStationAll == undefined
        ? 0
        : this.siteEncounterTelehealthDiffStationAll;
    },

    // Individual and Group Therapy Percent Computed
    siteEncounterCPTIndividualPercent() {
      let percent =
        (+this.siteEncounterCPTIndividual / +this.siteEncounterTotal) * 100;
      return precise_round(percent, 1);
    },
    siteEncounterCPTGroupPercent() {
      let percent =
        (+this.siteEncounterCPTGroup / +this.siteEncounterTotal) * 100;
      return precise_round(percent, 1);
    },

    // Telehealth Individual Therapy Percent
    siteEncounterTelehealthFaceToFaceIndPercent() {
      let percent =
        (+this.siteEncounterIndividualFaceToFace /
          +this.siteEncounterCPTIndividual) *
        100;
      return precise_round(percent, 1);
    },
    siteEncounterTelehealthFaceToFaceIndPercentEM() {
      let percent =
        (+this.siteEncounterIndividualFaceToFaceEM /
          +this.siteEncounterCPTIndividual) *
        100;
      return precise_round(percent, 1);
    },

    siteEncounterTelehealthHomeIndPercent() {
      let percent =
        (+this.siteEncounterTelehealthHomeInd /
          +this.siteEncounterCPTIndividual) *
        100;
      return precise_round(percent, 1);
    },
    siteEncounterTelehealthHomeIndPercentEM() {
      let percent =
        (+this.siteEncounterTelehealthHomeIndEM /
          +this.siteEncounterCPTIndividual) *
        100;
      return precise_round(percent, 1);
    },

    siteEncounterTelehealthSameStationIndPercent() {
      let percent =
        (+this.siteEncounterTelehealthSameStationInd /
          +this.siteEncounterCPTIndividual) *
        100;
      return precise_round(percent, 1);
    },
    siteEncounterTelehealthSameStationIndPercentEM() {
      let percent =
        (+this.siteEncounterTelehealthSameStationIndEM /
          +this.siteEncounterCPTIndividual) *
        100;
      return precise_round(percent, 1);
    },

    siteEncounterTelehealthDiffStationIndPercent() {
      let percent =
        (+this.siteEncounterTelehealthDiffStationInd /
          +this.siteEncounterCPTIndividual) *
        100;
      return precise_round(percent, 1);
    },
    siteEncounterTelehealthDiffStationIndPercentEM() {
      let percent =
        (+this.siteEncounterTelehealthDiffStationIndEM /
          +this.siteEncounterCPTIndividual) *
        100;
      return precise_round(percent, 1);
    },

    // Telehealth Group Therapy Percent
    siteEncounterTelehealthFaceToFaceGrpPercent() {
      let percent =
        (+this.siteEncounterGroupFaceToFace / +this.siteEncounterCPTGroup) *
        100;
      return isNaN(percent) ? 0 : precise_round(percent, 1);
    },
    siteEncounterTelehealthHomeGrpPercent() {
      let percent =
        (+this.siteEncounterTelehealthHomeGrp / +this.siteEncounterCPTGroup) *
        100;
      return isNaN(percent) ? 0 : precise_round(percent, 1);
    },
    siteEncounterTelehealthSameStationGrpPercent() {
      let percent =
        (+this.siteEncounterTelehealthSameStationGrp /
          +this.siteEncounterCPTGroup) *
        100;
      return isNaN(percent) ? 0 : precise_round(percent, 1);
    },
    siteEncounterTelehealthDiffStationGrpPercent() {
      let percent =
        (+this.siteEncounterTelehealthDiffStationGrp /
          +this.siteEncounterCPTGroup) *
        100;
      return isNaN(percent) ? 0 : precise_round(percent, 1);
    },

    // INDIVIDUAL AND GROUP PHONE THERAPY (PHONE PRIMARY STOP AND THERAPY CPT)
    siteEncounterIndividualPhoneTherapyPercent() {
      let percent =
        (+this.siteEncounterIndividualPhoneTherapy /
          +this.siteEncounterCPTIndividual) *
        100;
      return precise_round(percent, 1);
    },
    siteEncounterIndividualPhoneTherapyPercentEM() {
      let percent =
        (+this.siteEncounterIndividualPhoneTherapyEM /
          +this.siteEncounterCPTIndividual) *
        100;
      return precise_round(percent, 1);
    },
    siteEncounterGroupPhoneTherapyPercent() {
      let percent =
        (+this.siteEncounterGroupPhoneTherapy / +this.siteEncounterCPTGroup) *
        100;
      return precise_round(percent, 1);
    },
    siteEncounterAllPhoneTherapyPercent() {
      let percent =
        (this.telehealthPhoneAllTherapy / +this.siteEncounterTotal) * 100;
      // console.log('computing siteEncounterAllPhoneTherapyPercent: ', percent)
      return precise_round(percent, 1);
    },

    // Telehealth All percent
    siteEncounterTelehealthHomeGrpPercentAll() {
      let percent =
        (+this.siteEncounterTelehealthHomeAll / +this.siteEncounterTotal) * 100;
      return precise_round(percent, 1);
    },
    siteEncounterTelehealthSameStationGrpPercentAll() {
      let percent =
        (+this.siteEncounterTelehealthSameStationAll /
          +this.siteEncounterTotal) *
        100;
      return precise_round(percent, 1);
    },
    siteEncounterTelehealthDiffStationGrpPercentAll() {
      let percent =
        (+this.siteEncounterTelehealthDiffStationAll /
          +this.siteEncounterTotal) *
        100;
      return precise_round(percent, 1);
    },

    // utility computed
    scrollPosition() {
      // console.log('document.body.scrollHeight: ', document.body.scrollHeight)
      console.log("window.pageYOffset: ", window.pageYOffset);
    },
    changeBackgroundColor() {
      // console.log('in changeBackgroundColor selectedInstitutions is: ', this.selectedInstitutions)
      return this.selectedInstitutions.length > 0 || false;
    },

    // widgets computed
    lineChartOptions() {
      return {
        chart: { type: "spline" },
        title: { text: "Encounters and Unique Patients" },
        subtitle: { text: "Monthly Counts" },
        xAxis: {
          categories: this.siteEncounterLineChartSeries.months,
        },
        yAxis: {
          title: { text: "Monthly Data" },
          labels: {
            formatter: function () {
              return this.value;
            },
          },
        },
        tooltip: { crosshairs: true, shared: true },
        credits: { enabled: false },
        plotOptions: {
          spline: {
            marker: { radius: 4, lineColor: "#666666", lineWidth: 1 },
          },
          series: {
            dataLabels: {
              enabled: true,
            },
          },
        },
        series: [
          {
            name: "Monthly Encounters",
            data: this.siteEncounterLineChartSeries.series,
          },
          {
            name: "Monthly Patients",
            data: this.siteEncounterPatientLineChartSeries.series,
          },
        ],
      };
    },
    rowData() {
      return this.siteEncounterCPTTotal; // filters when site changes
    },
    rowData2() {
      return this.siteEncounterCPTCategories; // filters when site changes
    },
  },
  data() {
    return {
      gridOptions: null,
      gridOptions2: null,
      // gridOptions3: null,
      duration: 2000,

      // Encounters FAQ
      encountersAll: encountersAll,
      encountersPsychotherapy: encountersPsychotherapy,
      otherServices: otherServices,
      encounterCategories: encounterCategories,
      encounterCPTDetails: encounterCPTDetails,
      encounterTelehealthInd: encounterTelehealthInd,
      encounterTelehealthIndEM: encounterTelehealthIndEM,
      encounterTelehealthGrp: encounterTelehealthGrp,
      encounterTelehealthAll: encounterTelehealthAll,
    };
  },
  methods: {
    ...mapActions([
      "ENCOUNTER_COUNT",
      "ENCOUNTER_LINE_CHART",
      "ENCOUNTER_PATIENT_LINE_CHART",
      "ENCOUNTER_CPT_CATEGORIES_PSYCHOTHERAPY",
      "ENCOUNTER_CPT_CATEGORIES",
      "ENCOUNTER_CPT",
      "ENCOUNTER_PATIENT_CPT_CATEGORIES",
      "ENCOUNTER_TELEHEALTH",
      "ENCOUNTER_TELEHEALTH_ALL",
      "ENCOUNTER_FACE_TO_FACE",
      "ENCOUNTER_PHONE_THERAPY",
      "CURRENT_PAGE",
      "GET_INSTITUTIONS",
    ]),
    formatNumber(num) {
      return addCommas(num);
    },
    createColDefs() {
      return [
        {
          headerName: "Encounters",
          children: [
            {
              headerName: "Site",
              field: "StaPa",
              width: 30,
              cellStyle: { "text-align": "left" },
              filter: "agTextColumnFilter",
            },
            {
              headerName: "Procedure Code",
              field: "CPTCode",
              width: 50,
              cellStyle: { "text-align": "left" },
              filter: "agTextColumnFilter",
            },
            {
              headerName: "Procedure Code Name",
              field: "CPTName",
              width: 120,
              cellStyle: { "text-align": "left" },
              filter: "agTextColumnFilter",
            },
            // { headerName: "CPT Description",
            //   field: "CPTDescription",
            //   width: 150,
            //   cellStyle: { 'text-align': "left" } ,
            //   filter: "agTextColumnFilter"
            // },
            {
              headerName: "Encounters",
              field: "encountersPerCPT",
              width: 40,
              cellStyle: { "text-align": "left" },
              filter: "agNumberColumnFilter",
            },
          ],
        },
      ];
    },
    createColDefs2() {
      return [
        {
          headerName: "Procedure Categories",
          children: [
            {
              headerName: "Site",
              field: "StaPa",
              width: 20,
              cellStyle: { "text-align": "left" },
              filter: "agTextColumnFilter",
            },
            {
              headerName: "Category (hover for full description)",
              field: "CPTCategory",
              width: 80,
              cellStyle: { "text-align": "left" },
              filter: "agTextColumnFilter",
              tooltip: (params) => params.value,
            },
            {
              headerName: "Total",
              field: "totalNum",
              width: 20,
              cellStyle: { "text-align": "left" },
              filter: "agNumberColumnFilter",
            },
            {
              headerName: "%",
              field: "PercentageCPT",
              width: 18,
              cellStyle: { "text-align": "left" },
              filter: "agTextColumnFilter",
            },
          ],
        },
      ];
    },
    // createColDefs3() {
    //   return [
    //     {headerName: "Provider Clinic Cancel NoShow",
    //       children: [
    //         { headerName: "Site",
    //           field: "StaPa",
    //           width: 15,
    //           cellStyle: { 'text-align': "left" } ,
    //           filter: "agTextColumnFilter"
    //         },
    //         // { headerName: "Staff",
    //         //   field: "StaffName",
    //         //   width: 30,
    //         //   cellStyle: { 'text-align': "left" } ,
    //         //   filter: "agTextColumnFilter"
    //         // },
    //         { headerName: "Clinic",
    //           field: "LocationName",
    //           width: 30,
    //           cellStyle: { 'text-align': "left" } ,
    //           filter: "agTextColumnFilter"
    //         },
    //         { headerName: "Appt Type",
    //           field: "CancelNoShow",
    //           width: 30,
    //           cellStyle: { 'text-align': "left" } ,
    //           filter: "agTextColumnFilter"
    //         },
    //         { headerName: "Cancel/NS Count",
    //           field: "CancelNoShowCount",
    //           width: 25,
    //           cellStyle: { 'text-align': "left" } ,
    //           filter: "agNumberColumnFilter"
    //         },
    //         { headerName: "Clinic Appts",
    //           field: "ClinicAppointmentTotal",
    //           width: 20,
    //           cellStyle: { 'text-align': "left" } ,
    //           filter: "agNumberColumnFilter"
    //         },
    //         { headerName: "Site Appts",
    //           field: "StaPaTotal",
    //           width: 20,
    //           cellStyle: { 'text-align': "left" } ,
    //           filter: "agNumberColumnFilter"
    //         },
    //       ]
    //     },
    //   ]
    // },
    onGridReady() {
      this.gridOptions.api.sizeColumnsToFit();
    },
    onGridReady2() {
      this.gridOptions2.api.sizeColumnsToFit();
    },
    onRowDataChanged() {
      console.log("row data changed!!");
      Vue.nextTick(() => {
        this.gridOptions.api.sizeColumnsToFit();
      });
    },
    onRowDataChanged2() {
      console.log("row data changed!!");
      Vue.nextTick(() => {
        this.gridOptions2.api.sizeColumnsToFit();
      });
    },
  },
};
</script>
<style>
table,
th,
td {
  border: 1px solid black;
}

.filtering {
  background-color: lightgrey;
}

.section-head {
  font-size: 2rem;
}

/* fade page in and out when site changes */

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
  .fade-leave-to
    /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}

/* slide and fade */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for <2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
