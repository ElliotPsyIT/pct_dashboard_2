<template>
  <div>
    <div class="text-center mb-4">
      <span>Consult Details (Hover Over a Header to Filter the Column)</span>
    <div></div>
    </div>
    <div>
      <ag-grid-vue style="font-size: 12px" class="ag-theme-balham grid" 
      :gridOptions="gridOptions" 
      :rowData="rowData" 
      :rowDataChanged="onRowDataChanged">
      </ag-grid-vue>
   </div>
  </div>
</template>
<script>
import Vue from "vue";
import { AgGridVue } from "ag-grid-vue";
import dateFormat from "dateformat"

import { mapGetters } from 'vuex'

export default {
  name: 'pct-grid',
  created() {
    this.gridOptions = {};
    this.gridOptions.enableFilter = true
    this.gridOptions.columnDefs = this.createColDefs();
    this.gridOptions.rowData = this.rowData
    this.gridOptions.enableSorting = true
    this.gridOptions.enableFilter = true
    this.gridOptions.enableColResize = true
  },
  computed: {
    ...mapGetters(['siteConsultDetails']),
    rowData () {
      return this.siteConsultDetails
    }
  },
  data() {
    return {
      gridOptions: null
    }
  },
  components: {
    AgGridVue
  },
  methods: {
    loadRowData() {
      console.log('in loadRowData with siteConsultDetails: ', this.siteConsultDetails)
      // load data as getter from store
      this.rowData = this.siteConsultDetails
    },
    createColDefs() {
      return [
        {headerName: "Consults",
          children: [
            { headerName: "Site", 
              field: "StaPa", 
              width: 60, 
              cellStyle: { 'text-align': "left" } ,
              filter: "agTextColumnFilter"
            },
            // { headerName: "Site Name", 
            //   field: "InstitutionName", 
            //   width: 100, 
            //   cellStyle: { 'text-align': "left" } 
            // },
            { headerName: "Consult", 
              field: "RequestDateTime", 
              width: 110, 
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
            // { headerName: "PatientSID", 
            //   field: "PatientSID", 
            //   width: 50, 
            //   cellStyle: { 'text-align': "left" },
            //   filter: "agNumberColumnFilter" 
            // },
            { headerName: "Request", 
              field: "ToRequestServiceName",
              width: 125, 
              cellStyle: { 'text-align': "left" } 
            },
            { headerName: "Status", 
              field: "OrderStatus",
              width: 90, 
              cellStyle: { 'text-align': "left" } ,
              filter: "agTextColumnFilter"
            },
          ]
        },
         {headerName: "Appointments",
            children: [
              { headerName: "Appt", 
                field: "AppointmentDateTime", 
                width: 75, 
                cellStyle: { 'text-align': "left" },
                filter: "agDateColumnFilter",
                columnGroupShow: "open" 
              },
              // { headerName: "Wait", 
              //   field: "WaitTime", 
              //   width: 40, 
              //   cellStyle: { 'text-align': "left" } ,
              //   filter: "agNumberColumnFilter"
              // },
              { headerName: "Status", 
                field: "RowCategory",
                width: 150, 
                cellStyle: { 'text-align': "left" } ,
                filter: "agTextColumnFilter",
                columnGroupShow: "open" 
              },
              { headerName: "Patient", 
                field: "PatientName",
                width: 70, 
                cellStyle: { 'text-align': "left" } ,
                filter: "agTextColumnFilter",
                columnGroupShow: "open" 
              },
              { headerName: "Clinic", 
                field: "LocationName",
                width: 70, 
                cellStyle: { 'text-align': "left" } ,
                filter: "agTextColumnFilter",
                columnGroupShow: "open" 
              },
              { headerName: "Staff", 
                field: "StaffName",
                width: 70, 
                cellStyle: { 'text-align': "left" } ,
                filter: "agTextColumnFilter",
                columnGroupShow: "open" 
              },
            ]
         }
        // { headerName: "D/C", field: "ConsultFactorType",width: 25, cellStyle: { 'text-align': "left" }, filter: "agTextColumnFilter" },
        // { headerName: "D/C Comment", field: "ConsultFactorText",width: 70, cellStyle: { 'text-align': "left" }, tooltipField: "CONSULTFACTORTEXT" }
      ];
    },
    onRowDataChanged() {
      console.log('row data changed!!')
      Vue.nextTick(() => {
        this.gridOptions.api.sizeColumnsToFit();
      });
    }
  }
}
</script>
<style scoped>
  .grid {
    height: 500px
  }
</style>

