<template>
  <div class="content">
    <div class="container-fluid">

      Scroll Position {{scrollPosition}}

<div class="jumbotron d-flex flex-row" style="height: 350px;">
  <div class="mr-4">
    <img src="../../../../static/img/nat-center-ptsd.jpg">
  </div>
  <div class="mb-2 ">
    <h1> <span class="category news" style="text-decoration: none;">*</span> PTSD Clinic Dashboard</h1> 

    <p class="category "><b>Select Station AND Date Range <i class="bold nc-icon nc-stre-up text-primary"></i></b> From Drop Downs Above </p>
    <p class="category "><b>View Details <i class="bold nc-icon nc-stre-left text-primary"></i></b> Use Left Sidebar</p>
    <p class="category" style="font-size: .8rem; font-style: italic; margin: 0;"><span class="font: red;">{{ disclaimer.asterisks}}</span>{{ disclaimer.mainText }}<span style="font-weight:bold; text-decoration:underline">{{ disclaimer.emphasis }}</span></p>
    <span class="category news" style="font-size: .8rem; text-decoration: none;"><b><span style="font-size: 1.2rem;">*</span> Telehealth Care: The Encounters page now contains detailed information on provision of telehealth care.</b></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <span class="category news" style="font-size: .8rem; text-decoration: none;"><b><span style="font-size: 1.2rem;">*</span> VISN and National Data: Select VISN or National on the Station drop for down for page summary data.</b></span>

  </div>
  
</div>

<hr/>

<div class="row d-flex justify-content-around">
  
  <div class="col-md-2 ">
    <card>
      <!-- <template slot="header"> -->
        <!-- <div class="category">Consults</div> -->
      <!-- </template> -->
      <router-link :to="{path:'/admin/consults'}">
        <div class="page-link" >Consults</div>
      </router-link>
      <!-- <a href="#/admin/consults">
        <div class="page-link" >Consults</div>
      </a> -->
      <h6 class="text-muted">PCT Consults, Statuses and Details </h6>
      
    </card>
  </div>

<div class="col-md-2 ">
    <card >
      <!-- <template slot="header">
        <div class="category">Encounters</div>
      </template> -->
       <!-- <a href="#/admin/appointments">
        <div class="page-link" >App'ts</div>
      </a> -->
      <router-link :to="{path:'/admin/appointments'}">
        <div class="page-link" >App'ts</div>
      </router-link>
      <h6 class="text-muted">No Shows, Cancels </h6>
        
      
    </card>
</div>

  <div class="col-md-2 ">
    <card>
      <!-- <template slot="header">
        Encounters
      </template> -->
       <!-- <a href="#/admin/encounters">
        <div class="page-link" >Encounters</div>
      </a> -->
      <router-link :to="{path:'/admin/encounters'}">
        <div class="page-link" >Encounters</div>
      </router-link>
      <h6 class="text-muted">Encounter Counts, CPT Categories</h6>
      
    </card>
  </div>

  <div class="col-md-2 ">
    <card>
      <!-- <template slot="header">
        Providers
      </template> -->
      <!-- <a href="#/admin/providers">
        <div class="page-link" >Providers</div>
      </a> -->
      <router-link :to="{path:'/admin/providers'}">
        <div class="page-link" >Providers</div>
      </router-link>

      <h6 class="text-muted">Providers, Clinics and Patient Stats</h6>

     
    </card>
  </div>


  <div class="col-md-2 ">
    <card>
      <!-- <template slot="header">
        Surveys
      </template> -->
      <!-- <a href="#/admin/surveys">
        <div class="page-link" >Surveys</div>
      </a> -->
      <router-link :to="{path:'/admin/surveys'}">
        <div class="page-link" >Surveys</div>
      </router-link>
        <h6 class="text-muted">PCT Surveys by Providers and by Patients</h6>

     
    </card>
  </div>

  <div class="col-md-2 ">
    <card>
      <!-- <template slot="header">
        EBPs
      </template> -->
      <!-- <a href="#/admin/ebps">
        <div class="page-link" >EBPs</div>
      </a> -->
      <router-link :to="{path:'/admin/ebp'}">
        <div class="page-link" >EBPs</div>
      </router-link>
      <h6 class="text-muted">EBP Session counts and Therapy Types</h6>

  
    </card>
  </div>

</div>

      <!-- <div class="row justify-content-md-center">
        <div class="col-md-11 ">
          <card>
            <template slot="header">
              <h4 class="title text-center">Welcome to PCT PTSD Dashboard!</h4>
              <p class="category text-center"><b>Select Your Site <i class="bold nc-icon nc-stre-up text-primary"></i></b> From Drop Down Above </p>
              <p class="category text-center"><b>Then Use Left <i class="bold nc-icon nc-stre-left text-primary"></i> Sidebar</b> to View Details</p>

            </template>
            <div class="footer">
              <hr>
              <div class="stats">
                <i class="fa fa-history"></i> Getting Started Instructions
              </div>
            </div>
          </card>
        </div>
      </div> -->

      <!-- <div class="row justify-content-md-center">
        <div class="col-md-10 ">
          <card>
            <template slot="header">
              <h5 class="title text-center">Welcome to PCT PTSD Dashboard!</h5>
              <p class="category text-center">Getting Started</p>
            </template>
            <l-table :data="tableData.data"
                     :columns="tableData.columns">
              <template slot="columns"></template>

              <template slot-scope="{row}">
                <td>
                  <Checkbox v-model="row.checked" v-if="row.checked"></Checkbox>
                </td>
                <td>{{row.title}}</td>
                <td class="td-actions text-right" v-if="row.checked == 'null'">
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
                <i class="fa fa-history"></i> Getting Started Instructions
              </div>
            </div>
          </card>
        </div>
      </div>  -->

      <!-- <div>
        <h1>Hey, You've Been Here Before!!!</h1>
<br/>
          <h2>Look Above and See I've Preset the Site and Date Range</h2>
        <h4>Site of {{ selectedSite }}</h4>
        <h4>Date Range of {{ selectedRange }}</h4>
      </div> -->

      <!-- <div class="row justify-content-md-center">
        <div class="col-xl-3 col-md-6">
          <stats-card>
            <div slot="header" class="icon-warning">
              <i class="nc-icon nc-chart text-warning"></i>
            </div>
            <div slot="content">
              <p class="card-category">Total Consults</p>
              <h4 class="card-title">{{ nationalConsultTotal }}</h4>
            </div>
            <div slot="footer">
              <i class="fa fa-refresh"></i>Consults {{ selectedRange }}
            </div>
          </stats-card>
        </div>
      </div>

      <div class="row">
        <div class="col-xl-3 col-md-6">
          <stats-card>
            <div slot="header" class="icon-warning">
              <i class="nc-icon nc-chart text-warning"></i>
            </div>
            <div slot="content">
              <p class="card-category">Active</p>
              <h4 class="card-title">34</h4>
            </div>
            <div slot="footer">
              <i class="fa fa-refresh"></i>Consult Status {{ selectedRange }}
            </div>
          </stats-card>
        </div> -->

        <!-- <div class="col-xl-3 col-md-6">
          <stats-card>
            <div slot="header" class="icon-success">
              <i class="nc-icon nc-light-3 text-success"></i>
            </div>
            <div slot="content">
              <p class="card-category">Cancelled</p>
              <h4 class="card-title">1</h4>
            </div>
            <div slot="footer">
              <i class="fa fa-calendar-o"></i>National {{ selectedRange }}
            </div>
          </stats-card>
        </div> -->

      <!-- <div class="row">
        <div class="col-xl-3 col-md-6">
          <stats-card>
            <div slot="header" class="icon-info">
              <i class="nc-icon nc-favourite-28 text-primary"></i>
            </div>
            <div slot="content">
              <p class="card-category">Discontinued</p>
              <h4 class="card-title">+45</h4>
            </div>
            <div slot="footer">
              <i class="fa fa-refresh"></i>National {{ selectedRange }}
            </div>
          </stats-card>
        </div> -->


        <!-- <div class="col-xl-3 col-md-6">
          <stats-card>
            <div slot="header" class="icon-info">
              <i class="nc-icon nc-favourite-28 text-primary"></i>
            </div>
            <div slot="content">
              <p class="card-category">Partial Results</p>
              <h4 class="card-title">1</h4>
            </div>
            <div slot="footer">
              <i class="fa fa-refresh"></i>National {{ selectedRange }}
            </div>
          </stats-card>
        </div> -->

        <!-- <div class="col-xl-3 col-md-6">
          <stats-card>
            <div slot="header" class="icon-info">
              <i class="nc-icon nc-favourite-28 text-primary"></i>
            </div>
            <div slot="content">
              <p class="card-category">Pending</p>
              <h4 class="card-title">{{nationalConsultStatuses.PENDING}}</h4>
            </div>
            <div slot="footer">
              <i class="fa fa-refresh"></i>Consult Status {{ selectedRange }}
            </div>
          </stats-card>
        </div>

        <div class="col-xl-3 col-md-6">
          <stats-card>
            <div slot="header" class="icon-info">
              <i class="nc-icon nc-favourite-28 text-primary"></i>
            </div>
            <div slot="content">
              <p class="card-category">Scheduled</p>
              <h4 class="card-title">{{nationalConsultStatuses.SCHEDULED}}</h4>
            </div>
            <div slot="footer">
              <i class="fa fa-refresh"></i>Consult Status {{ selectedRange }}
            </div>
          </stats-card>
        </div>


        <div class="col-xl-3 col-md-6">
          <stats-card>
            <div slot="header" class="icon-danger">
              <i class="nc-icon nc-vector text-danger"></i>
            </div>
            <div slot="content">
              <p class="card-category">Complete</p>
              <h4 class="card-title">{{nationalConsultStatuses.COMPLETE}}</h4>
            </div>
            <div slot="footer">
              <i class="fa fa-clock-o"></i>Consult Status {{ selectedRange }}
            </div>
          </stats-card>
        </div>

      </div> -->

      <!-- <div class="row">
        <div class="col-md-8">
          <chart-card :chart-data="lineChart.data"
                      :chart-options="lineChart.options"
                      :responsive-options="lineChart.responsiveOptions">
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
        </div> -->

        <!-- <div class="col-md-4">
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

      <div class="row">
        <!-- <div class="col-md-6">
          <chart-card
            :chart-data="barChart.data"
            :chart-options="barChart.options"
            :chart-responsive-options="barChart.responsiveOptions"
            chart-type="Bar">
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
      </div>
    </div>
  </div>
</template>
<script>
  import ChartCard from 'src/components/UIComponents/Cards/ChartCard.vue'
  import StatsCard from 'src/components/UIComponents/Cards/StatsCard.vue'
  import Card from 'src/components/UIComponents/Cards/Card.vue'
  import LTable from 'src/components/UIComponents/Table.vue'
  import Checkbox from 'src/components/UIComponents/Inputs/Checkbox.vue'

  import { mapState, mapActions } from 'vuex'

  export default {
    components: {
      Checkbox,
      Card,
      LTable,
      ChartCard,
      StatsCard
    },
    computed: {
      ...mapState(['selectedSite', 'selectedRange','disclaimer']),
        // ...mapGetters(['nationalConsultTotal','nationalConsultStatuses'])
      scrollPosition () {
        // console.log('document.body.scrollHeight: ', document.body.scrollHeight)
        console.log('window.pageYOffset: ', window.pageYOffset)    
      },
    },
     mounted() {
        this.CURRENT_PAGE('overview')
    },
    methods: {
        ...mapActions([
        'CURRENT_PAGE'
        ])
	  }, 
    created () {
      if (this.selectedSite || this.selectedRange) {
        // console.log('overview created - yes been here before')
        this.beenHereBefore = true
      } else {
        console.log('not been here before')
      }
    },
    data () {
      return {
        beenHereBefore: false,

        editTooltip: 'Edit Task',
        deleteTooltip: 'Remove',

        tableData: {
          data: [
            {title: 'STEP 1: Identify your PCT Site using the selection drop downs above', checked: false},
            {title: 'STEP 2: Select the Date Range for viewing data (can be changed anytime)', checked: false},
            {title: 'STEP 3: Finaly, Select one of the data type in the Navigation bar on the left to start reviewing PCT data', checked: false},
            {title: ''},
            {title: 'Come Back Soon !!', checked: true}
          ]
        },
        // pieChart: {
        //   data: {
        //     labels: ['40%', '20%', '40%'],
        //     series: [40, 20, 40]
        //   }
        // },
        // lineChart: {
        //   data: {
        //     labels: ['9:00AM', '12:00AM', '3:00PM', '6:00PM', '9:00PM', '12:00PM', '3:00AM', '6:00AM'],
        //     series: [
        //       [287, 385, 490, 492, 554, 586, 698, 695],
        //       [67, 152, 143, 240, 287, 335, 435, 437],
        //       [23, 113, 67, 108, 190, 239, 307, 308]
        //     ]
        //   },
        //   options: {
        //     low: 0,
        //     high: 800,
        //     showArea: false,
        //     height: '245px',
        //     axisX: {
        //       showGrid: false
        //     },
        //     lineSmooth: true,
        //     showLine: true,
        //     showPoint: true,
        //     fullWidth: true,
        //     chartPadding: {
        //       right: 50
        //     }
        //   },
        //   responsiveOptions: [
        //     ['screen and (max-width: 640px)', {
        //       axisX: {
        //         labelInterpolationFnc (value) {
        //           return value[0]
        //         }
        //       }
        //     }]
        //   ]
        // },
        // barChart: {
        //   data: {
        //     labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        //     series: [
        //       [542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895],
        //       [412, 243, 280, 580, 453, 353, 300, 364, 368, 410, 636, 695]
        //     ]
        //   },
        //   options: {
        //     seriesBarDistance: 10,
        //     axisX: {
        //       showGrid: false
        //     },
        //     height: '245px'
        //   },
        //   responsiveOptions: [
        //     ['screen and (max-width: 640px)', {
        //       seriesBarDistance: 5,
        //       axisX: {
        //         labelInterpolationFnc (value) {
        //           return value[0]
        //         }
        //       }
        //     }]
        //   ]
        // }
      }
    }
  }
</script>
<style>
 .page-link {
   color: black; 
   text-decoration: underline; 
   margin-bottom: .5rem;
   border-color: transparent;
   padding: 3px;
 }

 .page-link:hover {
   color: darkolivegreen;
   text-decoration: underline; 
 }

 .news {
   color: red;
   text-decoration: underline;
 }
</style>

