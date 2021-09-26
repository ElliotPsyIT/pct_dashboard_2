import Vue from "vue";
import Vuex from "vuex";

import axios from "axios";

import {
  addCommas,
  totalAndPercent,
  totalAndPercent2,
  isSelectedDateRangeWhiteListed,
} from "../utils";
import siteNames from "../../static/sites_orig.json";
import dateRanges from "../../static/dateRanges.json";

Vue.use(Vuex);

// Access localStorage for previously stored site and daterange
const localStorage = window.localStorage;
let storeLocal = {};
if (localStorage.getItem("store")) {
  storeLocal = JSON.parse(localStorage.getItem("store"));
}

function dateRangeRestrict() {
  // whitelist dateRange
  let restrictedDateRange = "";
  if (!isSelectedDateRangeWhiteListed(context.state.selectedRange)) {
    restrictedDateRange = defaultDateRange; //globally set here in store
    context.state.whitelisted = true; //turn on whitelisted flag for components to see
    console.log("Needed to change dateRange to ", whitelisted);
  } else {
    restrictedDateRange = context.state.selectedRange; // okay to use selectedRange
    context.state.whitelisted = false; // turn off whitelisted flage
    console.log("No need to whitelist this dateRange");
  }
  return whitelisted;
}

function removeDuplicates(myArr, prop) {
  return myArr.filter((obj, pos, arr) => {
    return arr.map((mapObj) => mapObj[prop]).indexOf(obj[prop]) === pos;
  });
}

function usageParams(state) {
  function cleanAccountString(str) {
    // replace backslash and forwardslash with underscore
    let newStr = str.replace(/\/|\\/g, "_");
    // remove leading and trailing underscore
    if ((newStr.charAt(0) == "_") | newStr.charAt(-1)) newStr = newStr.slice(1);
    return newStr;
  }

  // let currentPage = state.currentPage || page
  let currentPage = state.route.name;

  let usageParams = "";
  usageParams =
    "format=" +
    "usage" +
    "&page=" +
    currentPage.toLowerCase() +
    "&staPa=" +
    state.selectedSite +
    "&dateRange=" +
    state.selectedRange +
    "&userFirstName=" +
    state.userFirstName +
    "&userLastName=" +
    state.userLastName +
    "&adaccount=" +
    cleanAccountString(state.adaccount);

  // console.log('usageParams is: ', usageParams)
  return usageParams;
}

// handle optional params including special cases
function setOptionalParams(state) {
  // if Consults, don't allow institutions as optional parameter
  let page = state.currentpage;
  // console.log('in setOptionalParams, state.currentpage is: ', state.currentpage)

  let institutionFilterAllowed = state.siteFilterAllowed[`${page}`];
  // console.log('in setOptionalParams, institutionFilterAllowed is: ', institutionFilterAllowed)

  // console.log('in setOptionalParams, institutions is: ', state.selectedInstitutions.length)

  // NOT YET ALLOWING ANY PROVIDER FILTERING
  // (state.selectedProvider ? `&providerSID=${state.selectedProvider}` : '') +

  // if institution filter allowed and there are institutions selected
  let institution =
    institutionFilterAllowed && state.selectedInstitutions.length > 0
      ? `&institutionSID=${state.selectedInstitutions}`
      : "";

  // console.log('in setOptionalParams, state.selectedRangePicker:', state.selectedRangePicker)

  // console.log('in setOptionalParams, state.selectedRangePicker.length:', state.selectedRangePicker.length)
  let dateRangePicker =
    state.selectedRangePicker.length == 0 ||
    state.selectedRangePicker.start == undefined ||
    state.selectedRangePicker.end == undefined
      ? ""
      : `&dtrng=${state.selectedRangePicker.start},${state.selectedRangePicker.end}`;

  // console.log('in setOptionalParams and would send this dateRangePicker: ', dateRangePicker)

  return `${institution}${dateRangePicker}`;
}

//REFACTOR: SET PARAMS FOR AXIOS REQUEST CENTRALLY
function setParams(format, state) {
  // IDENTIFY ALL RELEVANT PARAMS FOR OBTAINING DATA, AND FILTERING
  let coreParams =
    "format=" +
    format +
    "&staPa=" +
    state.selectedSite +
    "&dateRange=" +
    state.selectedRange;

  // DETERMINE OPTIONAL PARAMETERS (covers dateRangePicker)
  let optionalParams = setOptionalParams(state);

  return coreParams + optionalParams;
}

// IS VISN OR NATIONAL DATA REQUESTED?
function selectedSiteVISNorNATIONAL(state) {
  // return true is user selected a VISN or NATIONAL site
  // console.log('in selectedSiteVISNorNATIONAL and state is: ', state)
  return /VISN|NATIONAL/.test(state.selectedSite) ? true : false;
}

// set default whitelisted dateRange for limiting data request size
const defaultDateRange = "threemonths";

const store = new Vuex.Store({
  state: {
    // selectedSite,
    selectedSite: storeLocal.selectedSite || "",
    selectedRange: storeLocal.selectedRange || "threemonths",
    selectedRangePicker: storeLocal.selectedRangePicker || {
      shortcut: storeLocal.selectedRange,
    },
    userFirstName: storeLocal.userFirstName || "No",
    userLastName: storeLocal.userLastName || "User Name",

    selectedProvider: null,
    whitelisted: false,

    runMode: "",
    currentpage: "",
    siteFilterAllowed: {
      overview: false,
      definitions: false,
      consults: false,
      appointments: true,
      encounters: true,
      providers: true,
      surveys: true,
      mbc: true,
      ebp: true,
    },
    appVersion: "2.6.0",
    phipii: 0,
    selectedSiteVISNorNATIONAL: false,
    allphipii: [],
    adaccount: "",
    siteNames,
    dateRanges,
    disclaimer: {
      asterisks: "** ",
      mainText:
        "Please remember that the data presented in this tool, whether it is aggregated or patient specific, is confidential, privileged and for operational purposes only and ",
      emphasis: "cannot be used for research purposes.",
    },
    dataError: false,
    institutions: [],
    selectedInstitutions: [],
    selectedInstitutionsNames: [],
    institutionSidebarShow: false,

    consultDataPie: [],
    consultDataLine: [],
    consultDataCount: [],
    consultDetails: [],

    encounterCount: [],
    encounterLineChart: [],
    encounterPatientLineChart: [],
    encounterCPTCategoriesPsychotherapy: [],
    encounterCPTCategories: [],
    encounterCPT: [],
    encounterPatientCPTCategories: [],
    encounterFaceToFace: [],
    encounterTelehealth: [],
    encounterTelehealthAll: [],
    encounterPhoneTherapy: [],

    encounterApptCancelNoShow: [],
    encounterApptCount: [],
    encounterApptClinicCancelNoShow: [],

    providerCount: [],
    providerInfo: [],
    providerDetails: [],
    providerPatientDetailsCPT: [],
    selectedProvider: "",

    surveyTotals: [],
    surveyDetails: [],
    surveyPatientDetails: [],
    surveyPCL5: [],
    surveyPCL5Providers: [],

    // ebpCount,
    // ebpInfo,
    ebpDetails: [],
    ebpPieChart: [],
    ebpSummary: [],
    // ebpPatientsCPTCategories,
    ebpDetailsTypes: [],
    ebpDetailsSessionsSurveys: [],
  },
  getters: {
    selectedSiteVISNorNATIONAL: (state) => {
      // return true is user selected a VISN or NATIONAL site
      console.log(
        "in selectedSiteVISNorNATIONAL and /VISN|NATIONAL/.test(state.selectedSite) is: ",
        /VISN|NATIONAL/.test(state.selectedSite)
      );
      return /VISN|NATIONAL/.test(state.selectedSite) ? true : false;
    },
    // user permissions to see PHIPII
    userPHI: (state) => {
      // console.log('phipii is: ', state.phipii)
      return state.phipii;
    },
    userAccount: (state) => {
      return state.adaccount;
    },
    getRunMode: (state) => {
      // development mode? - for use in tracking user action
      return process.env.NODE_ENV == "development" ? process.env.NODE_ENV : "";
    },

    siteInstitutions: (state) => {
      console.log(
        "in siteInstitutions getter, and state.institutions is: ",
        state.institutions
      );
      // for now, return the incoming array of institution objects
      return state.institutions;

      // let uniques = state.institutions.map(site => {
      //   console.log('site.InstitutionName is: ', site.InstitutionName) // [{staPa: 'ddd', institutionName: 'wwwwww'}]
      //   return site.InstitutionName
      // } )
      // console.log('after getting unique InstitutionNames, uniques are: ', uniques)
      // return uniques
    },

    //***********************************************
    // Consults
    //***********************************************
    siteConsultTotal: (state) => {
      // console.log('in store getters, state is: ', state)
      // console.log('in siteConsultTotal, state.consultDataCount is: ', state.consultDataCount)
      let filteredArray = state.consultDataCount //state.consultCount //
        .filter((site) => {
          // console.log('site.StaPa', site.StaPa)
          // console.log('state.selectedSite', state.selectedSite)
          return site.StaPa === state.selectedSite;
        })
        .filter((site) => site.dataType === "consultCount");
      //  console.log('ConsultTotal filteredArray is: ', filteredArray)
      return filteredArray.length == 0 ? 0 : filteredArray[0].countTotal;
    },
    siteConsultPatientTotal: (state) => {
      let filteredArray = state.consultDataCount //state.consultCount//
        .filter((site) => site.StaPa === state.selectedSite)
        .filter((site) => site.dataType === "patientCount");
      // console.log('PatientTotal is: ', filteredArray)
      return filteredArray.length == 0 ? 0 : filteredArray[0].countTotal;
    },
    siteConsultActiveTotal: (state) => {
      let filteredArray = state.consultDataPie //state.consultPieChart //
        .filter((site) => site.StaPa === state.selectedSite)
        .filter((site) => site.ConsultStatus === "ACTIVE");
      // console.log('ActiveTotal is: ', filteredArray)
      return filteredArray.length == 0 ? 0 : filteredArray[0].Num;
    },
    siteConsultPendingTotal: (state) => {
      // console.log('in siteConsultPendingTotal, state.selectedSite is ', state.selectedSite)
      // console.log('in siteConsultPendingTotal, state.consultPieChart is', state.consultPieChart)
      let filteredArray = state.consultDataPie //state.consultPieChart
        .filter((site) => site.StaPa === state.selectedSite)
        .filter((site) => site.ConsultStatus === "PENDING");
      // console.log('PendingTotal array is: ', filteredArray)
      return filteredArray.length == 0 ? 0 : filteredArray[0].Num;
    },
    siteConsultPieChartSeries: (state) => {
      // build series based on selected site
      console.log("state.selectedSite is: ", state.selectedSite);
      let mappedArray = state.consultDataPie //state.consultPieChart
        .filter((site) => site.StaPa === state.selectedSite)
        .map((status) => {
          return [status.ConsultStatus, +status.Num];
        });
      console.log("pie chart series is: ", mappedArray);
      return mappedArray;
    },
    siteConsultDetails: (state) => {
      // console.log('in getter siteConsultDetails')
      // console.log('selectedSite: ', selectedSite)
      // console.log('state.consultDetails is: ', state.consultDetails)
      let consultDetails = state.consultDetails.filter(
        (site) => site.StaPa === state.selectedSite
      );
      // console.log('consultDetails is: ', consultDetails)
      return consultDetails;
    },
    siteConsultLineChartSeries: (state) => {
      let consultLineChartMonths = state.consultDataLine //state.consultLineChart
        .filter((site) => site.StaPa === state.selectedSite)
        .map((month) => {
          return month.shortMonthName;
        });
      // console.log('consult line chart months: ', consultLineChartMonths)
      // return consultLineChartMonths
      let consultLineChartData = state.consultDataLine //state.consultLineChart
        .filter((site) => site.StaPa === state.selectedSite)
        .map((month) => {
          return +month.monthConsultsTotal;
        });
      // console.log('consult line chart data: ', consultLineChartData)
      return { months: consultLineChartMonths, series: consultLineChartData };
    },

    //***********************************************
    // ENCOUNTERS
    //*********************************************** //
    siteEncounterTotal: (state) => {
      let filteredArray = state.encounterCount
        .filter((site) => site.StaPa === state.selectedSite)
        .filter((site) => site.dataType === "encountersCount");
      // console.log('Encounter Total is: ', filteredArray)
      return filteredArray.length == 0 ? 0 : filteredArray[0].countTotal;
    },
    // encounters: distinct PatientSID, all MH CPTCode
    siteEncounterPatientTotal: (state) => {
      let filteredArray = state.encounterCount
        .filter((site) => site.StaPa === state.selectedSite)
        .filter((site) => site.dataType === "patientCount");
      // console.log('Encounter Patient Total is: ', filteredArray)
      return filteredArray.length == 0
        ? 0
        : addCommas(filteredArray[0].countTotal);
    },
    siteEncounterLineChartSeries: (state) => {
      let encounterLineChartMonths = state.encounterLineChart
        .filter((site) => site.StaPa === state.selectedSite)
        .map((month) => {
          return month.shortMonthName;
        });
      // console.log('encounter line chart months: ', encounterLineChartMonths)
      // return consultLineChartMonths
      let encounterLineChartData = state.encounterLineChart
        .filter((site) => site.StaPa === state.selectedSite)
        .map((month) => {
          return +month.monthEncountersTotal;
        });
      // console.log('encounter line chart data: ', encounterLineChartData)
      return {
        months: encounterLineChartMonths,
        series: encounterLineChartData,
      };
    },
    siteEncounterPatientLineChartSeries: (state) => {
      let encounterPatientLineChartMonths = state.encounterPatientLineChart
        .filter((site) => site.StaPa === state.selectedSite)
        .map((month) => {
          return month.shortMonthName;
        });
      // console.log('encounter line chart months: ', encounterPatientLineChartMonths)
      // return consultLineChartMonths
      let encounterPatientLineChartData = state.encounterPatientLineChart
        .filter((site) => site.StaPa === state.selectedSite)
        .map((month) => {
          return +month.monthPatientTotal;
        });
      // console.log('encounter patient line chart data: ', encounterPatientLineChartData)
      return {
        months: encounterPatientLineChartMonths,
        series: encounterPatientLineChartData,
      };
    },
    // total for Ind Therapy CPT Category (large set of CPTs)
    siteEncounterCPTIndividual: (state) => {
      // console.log('in siteEncounterCPTIndividual, state.encounterCPTCategoriesPsychotherapy is: ', state.encounterCPTCategoriesPsychotherapy)
      let filteredArray = state.encounterCPTCategoriesPsychotherapy
        .filter((site) => site.StaPa === state.selectedSite)
        // .filter(site => site.CPTCategory === 'Individual Psychotherapy')
        .filter((site) => {
          // console.log('siteEncounterCPTIndividual Psychotherapy is: ', site.Psychotherapy)
          return site.Psychotherapy === "Individual Therapy";
        });
      // console.log('in siteEncounterCPTIndividual, filteredArray is: ', filteredArray)
      return filteredArray.length == 0 ? 0 : filteredArray[0].NUMSESSIONS;
    },
    // total for Grp Therapy CPT Category (large set of CPTs)
    siteEncounterCPTGroup: (state) => {
      let filteredArray = state.encounterCPTCategoriesPsychotherapy
        .filter((site) => site.StaPa === state.selectedSite)
        // .filter(site => site.CPTCategory === 'Group Psychotherapy')
        .filter((site) => site.Psychotherapy === "Group Therapy");
      return filteredArray.length == 0 ? 0 : filteredArray[0].NUMSESSIONS;
    },
    // total for each CPTs no categorizing and no filtering
    siteEncounterCPTTotal: (state) => {
      let filteredArray = state.encounterCPT.filter(
        (site) => site.StaPa === state.selectedSite
      );
      filteredArray.forEach(function (rec) {
        rec.encountersPerCPT = Number(rec.encountersPerCPT);
      });
      return filteredArray;
    },
    // total for each CPTCategory (large set of CPTs) and no category filtering
    siteEncounterCPTCategories: (state) => {
      let filteredArray = state.encounterCPTCategories.filter(
        (site) => site.StaPa === state.selectedSite
      );
      // console.log('in ENCOUNTER_CPT_CATEGORIES, filteredArray is: ', filteredArray)
      return filteredArray;
    },
    // total for Tele CPT Category (large set of CPTs)
    siteEncounterCPTTelephone: (state) => {
      let filteredArray = state.encounterCPTCategories
        .filter((site) => site.StaPa === state.selectedSite)
        .filter((site) => {
          // regex matches multiple CPT types including where Group Ed is combined w/ other CPTs
          return /Telephone/.test(site.CPTCategory);
        });
      // try new totalAndPercent2(filteredArray)
      return totalAndPercent2(filteredArray);
    },

    // totals for face to face - individual and group telehealth
    siteEncounterIndividualFaceToFace: (state) => {
      let filteredArray = state.encounterFaceToFace
        .filter((site) => site.StaPa === state.selectedSite)
        .filter((site) => {
          return site.TherapyModality === "FACE_TO_FACE";
        })
        .filter((site) => site.Psychotherapy === "Individual Therapy");
      return filteredArray.length == 0 ? 0 : filteredArray[0].NUMSESSIONS;
    },
    siteEncounterIndividualFaceToFaceEM: (state) => {
      let filteredArray = state.encounterFaceToFace
        .filter((site) => site.StaPa === state.selectedSite)
        .filter((site) => {
          return site.TherapyModality === "FACE_TO_FACE";
        })
        .filter((site) => site.Psychotherapy === "Individual Therapy E&M");
      return filteredArray.length == 0 ? 0 : filteredArray[0].NUMSESSIONS;
    },

    siteEncounterGroupFaceToFace: (state) => {
      let filteredArray = state.encounterFaceToFace
        .filter((site) => site.StaPa === state.selectedSite)
        .filter((site) => site.TherapyModality === "FACE_TO_FACE")
        .filter((site) => site.Psychotherapy === "Group Therapy");
      return filteredArray.length == 0 ? 0 : filteredArray[0].NUMSESSIONS;
    },

    // totals for phone with psychotherapy
    siteEncounterIndividualPhoneTherapy: (state) => {
      let filteredArray = state.encounterPhoneTherapy
        .filter((site) => site.StaPa === state.selectedSite)
        .filter((site) => site.Psychotherapy === "Individual Therapy");
      return filteredArray.length == 0 ? 0 : filteredArray[0].NUMSESSIONS;
    },
    siteEncounterIndividualPhoneTherapyEM: (state) => {
      let filteredArray = state.encounterPhoneTherapy
        .filter((site) => site.StaPa === state.selectedSite)
        .filter((site) => site.Psychotherapy === "Individual Therapy E&M");
      return filteredArray.length == 0 ? 0 : filteredArray[0].NUMSESSIONS;
    },
    siteEncounterGroupPhoneTherapy: (state) => {
      let filteredArray = state.encounterPhoneTherapy
        .filter((site) => site.StaPa === state.selectedSite)
        .filter((site) => {
          // console.log('in siteEncounterGroupPhoneTherapy, site is: ', site)
          return site.Psychotherapy === "Group Therapy";
        });
      return filteredArray.length == 0 ? 0 : filteredArray[0].NUMSESSIONS;
    },

    // totals for telehealth and video - home
    siteEncounterTelehealthHomeInd: (state) => {
      // console.log('state.encounterTelehealth is: ', state.encounterTelehealth)
      let filteredArray = state.encounterTelehealth
        .filter((site) => {
          return site.StaPa === state.selectedSite;
        })
        .filter((site) => {
          // console.log('in siteEncounterTelehealthHomeInd, Psychotherapy is : ', site.Psychotherapy)
          return site.Psychotherapy === "Individual Therapy";
        })
        .filter((site) => {
          return /RT CLIN VID CARE HOME/.test(site.SecondaryStopCodeName);
        });
      // console.log('filteredArray in siteEncounterTelehealthHomeInd is: ', filteredArray)
      return filteredArray.length == 0 ? 0 : filteredArray[0].NUMSESSIONS;
    },
    siteEncounterTelehealthHomeIndEM: (state) => {
      // console.log('state.encounterTelehealth is: ', state.encounterTelehealth)
      let filteredArray = state.encounterTelehealth
        .filter((site) => {
          return site.StaPa === state.selectedSite;
        })
        .filter((site) => {
          // console.log('in siteEncounterTelehealthHomeInd, Psychotherapy is : ', site.Psychotherapy)
          return site.Psychotherapy === "Individual Therapy E&M";
        })
        .filter((site) => {
          return /RT CLIN VID CARE HOME/.test(site.SecondaryStopCodeName);
        });
      // console.log('filteredArray in siteEncounterTelehealthHomeInd is: ', filteredArray)
      return filteredArray.length == 0 ? 0 : filteredArray[0].NUMSESSIONS;
    },
    siteEncounterTelehealthSameStationInd: (state) => {
      let filteredArray = state.encounterTelehealth
        .filter((site) => site.StaPa === state.selectedSite)
        .filter((site) => {
          // console.log('in siteEncounterTelehealthSameStationInd, Psychotherapy is : ', site.Psychotherapy)
          return site.Psychotherapy === "Individual Therapy";
        })
        .filter((site) => {
          return /CVT PRV SITE SAME DIV\/STA/.test(site.SecondaryStopCodeName);
        });
      return filteredArray.length == 0 ? 0 : filteredArray[0].NUMSESSIONS;
    },
    siteEncounterTelehealthSameStationIndEM: (state) => {
      let filteredArray = state.encounterTelehealth
        .filter((site) => site.StaPa === state.selectedSite)
        .filter((site) => {
          // console.log('in siteEncounterTelehealthSameStationInd, Psychotherapy is : ', site.Psychotherapy)
          return site.Psychotherapy === "Individual Therapy E&M";
        })
        .filter((site) => {
          return /CVT PRV SITE SAME DIV\/STA/.test(site.SecondaryStopCodeName);
        });
      return filteredArray.length == 0 ? 0 : filteredArray[0].NUMSESSIONS;
    },
    // // totals for telehealth and video - home
    siteEncounterTelehealthDiffStationInd: (state) => {
      // console.log('state.encounterTelehealth is: ', state.encounterTelehealth)
      let filteredArray = state.encounterTelehealth
        .filter((site) => site.StaPa === state.selectedSite)
        .filter((site) => {
          // console.log('in siteEncounterTelehealthDiffStationInd, Psychotherapy is : ', site.Psychotherapy)
          return site.Psychotherapy === "Individual Therapy";
        })
        .filter((site) => {
          return /RT CLIN VD TH PRV SITE\(DIFSTA\)/.test(
            site.SecondaryStopCodeName
          );
        });
      return filteredArray.length == 0 ? 0 : filteredArray[0].NUMSESSIONS;
    },
    siteEncounterTelehealthDiffStationIndEM: (state) => {
      // console.log('state.encounterTelehealth is: ', state.encounterTelehealth)
      let filteredArray = state.encounterTelehealth
        .filter((site) => site.StaPa === state.selectedSite)
        .filter((site) => {
          // console.log('in siteEncounterTelehealthDiffStationInd, Psychotherapy is : ', site.Psychotherapy)
          return site.Psychotherapy === "Individual Therapy E&M";
        })
        .filter((site) => {
          return /RT CLIN VD TH PRV SITE\(DIFSTA\)/.test(
            site.SecondaryStopCodeName
          );
        });
      return filteredArray.length == 0 ? 0 : filteredArray[0].NUMSESSIONS;
    },

    // Group therapy telehealth
    siteEncounterTelehealthHomeGrp: (state) => {
      // console.log('state.encounterTelehealth is: ', state.encounterTelehealth)
      let filteredArray = state.encounterTelehealth
        .filter((site) => {
          return site.StaPa === state.selectedSite;
        })
        .filter((site) => {
          return site.Psychotherapy === "Group Therapy";
        })
        .filter((site) => {
          return /RT CLIN VID CARE HOME/.test(site.SecondaryStopCodeName);
        });
      // console.log('in siteEncounterTelehealthHomeGrp, filteredArray is: ', filteredArray)
      return filteredArray.length == 0 ? 0 : filteredArray[0].NUMSESSIONS;
    },
    siteEncounterTelehealthSameStationGrp: (state) => {
      let filteredArray = state.encounterTelehealth
        .filter((site) => site.StaPa === state.selectedSite)
        .filter((site) => {
          return site.Psychotherapy === "Group Therapy";
        })
        .filter((site) => {
          return /CVT PRV SITE SAME DIV\/STA/.test(site.SecondaryStopCodeName);
        });
      return filteredArray.length == 0 ? 0 : filteredArray[0].NUMSESSIONS;
    },
    // // totals for telehealth and video - home
    siteEncounterTelehealthDiffStationGrp: (state) => {
      // console.log('state.encounterTelehealth is: ', state.encounterTelehealth)
      let filteredArray = state.encounterTelehealth
        .filter((site) => site.StaPa === state.selectedSite)
        .filter((site) => {
          return site.Psychotherapy === "Group Therapy";
        })
        .filter((site) => {
          return /RT CLIN VD TH PRV SITE\(DIFSTA\)/.test(
            site.SecondaryStopCodeName
          );
        });
      return filteredArray.length == 0 ? 0 : filteredArray[0].NUMSESSIONS;
    },

    // total telehealth (not restricted to ind and grp tx as above)
    siteEncounterTelehealthHomeAll: (state) => {
      // console.log('in siteEncounterTelehealthHomeAll - state.encounterTelehealthAll is: ', state.encounterTelehealthAll)

      let filteredArray = state.encounterTelehealthAll
        .filter((site) => {
          return site.StaPa === state.selectedSite;
        })
        .filter((site) => {
          return /RT CLIN VID CARE HOME/.test(site.SecondaryStopCodeName);
        });
      // console.log('in siteEncounterTelehealthHomeGrp, filteredArray is: ', filteredArray)
      return filteredArray.length == 0 ? 0 : filteredArray[0].NUMSESSIONS;
    },
    siteEncounterTelehealthSameStationAll: (state) => {
      // console.log('in siteEncounterTelehealthSameStationAll - state.encounterTelehealthAll is: ', state.encounterTelehealthAll)
      let filteredArray = state.encounterTelehealthAll
        .filter((site) => site.StaPa === state.selectedSite)
        .filter((site) => {
          return /CVT PRV SITE SAME DIV\/STA/.test(site.SecondaryStopCodeName);
        });
      return filteredArray.length == 0 ? 0 : filteredArray[0].NUMSESSIONS;
    },
    siteEncounterTelehealthDiffStationAll: (state) => {
      // console.log('in siteEncounterTelehealthDiffStationAll - state.encounterTelehealthAll is: ', state.encounterTelehealthAll)
      let filteredArray = state.encounterTelehealthAll
        .filter((site) => site.StaPa === state.selectedSite)
        .filter((site) => {
          return /RT CLIN VD TH PRV SITE(DIFSTA)/.test(
            site.SecondaryStopCodeName
          );
        });
      return filteredArray.length == 0 ? 0 : filteredArray[0].NUMSESSIONS;
    },
    //  OTHER SERVICES SESSIONS
    // total for Prolonged Service CPT Category (large set of CPTs)
    siteEncounterCPTProlongedService: (state) => {
      let filteredArray = state.encounterCPTCategories
        .filter((site) => site.StaPa === state.selectedSite)
        // .filter(site => site.CPTCategory === 'Prolonged Service')
        .filter((site) => {
          // regex matches multiple CPT types including where this CPT is combined w/ other CPTs
          return /Prolonged Service/.test(site.CPTCategory);
        });

      return totalAndPercent2(filteredArray);
    },
    // total for Specific CPT Category (large set of CPTs)
    siteEncounterCPTAssessment: (state) => {
      let filteredArray = state.encounterCPTCategories
        .filter((site) => site.StaPa === state.selectedSite)
        .filter((site) => {
          // regex matches multiple CPT types including where this CPT is combined w/ other CPTs
          return /Assessment/.test(site.CPTCategory);
        });

      return totalAndPercent2(filteredArray);
    },
    // total for Specific CPT Category (large set of CPTs)
    siteEncounterCPTGroupEducation: (state) => {
      // matches both Group Education string exactly, and if in string with other CPTs
      let filteredArray = state.encounterCPTCategories
        .filter((site) => site.StaPa === state.selectedSite)
        .filter((site) => {
          // regex matches multiple CPT types including where this CPT is combined w/ other CPTs
          return /Health and Behavior \(Group\)/.test(site.CPTCategory);
        });

      return totalAndPercent2(filteredArray);
    },

    // like siteEncounterCPTIndividual's large CPTs - but Ind Therapy Category and no Grp Therapy
    siteEncounterCPTPatientsIndOnly: (state) => {
      //encounterPatientCPTCategories
      // console.log('state.encounterPatientCPTCategories', state.encounterPatientCPTCategories)
      let filteredArray = state.encounterPatientCPTCategories
        .filter((site) => site.StaPa === state.selectedSite)
        .filter((site) => site.TherapyType === "IndividualOnly");
      return filteredArray.length == 0
        ? 0
        : filteredArray[0].NumPsychotherapyByType;
    },
    // like siteEncounterCPTGroup's large CPTs - but Grp Therapy Category and no Ind Therapy
    siteEncounterCPTPatientsGrpOnly: (state) => {
      //encounterPatientCPTCategories
      let filteredArray = state.encounterPatientCPTCategories
        .filter((site) => site.StaPa === state.selectedSite)
        .filter((site) => site.TherapyType === "GroupOnly");
      return filteredArray.length == 0
        ? 0
        : filteredArray[0].NumPsychotherapyByType;
    },
    // like above two but w/ both Ind and Grp Therapy
    siteEncounterCPTPatientsBoth: (state) => {
      //encounterPatientCPTCategories
      let filteredArray = state.encounterPatientCPTCategories
        .filter((site) => site.StaPa === state.selectedSite)
        .filter((site) => site.TherapyType === "Both");
      return filteredArray.length == 0
        ? 0
        : filteredArray[0].NumPsychotherapyByType;
    },
    // like above two but w/ either Ind or Grp Therapy
    siteEncounterCPTPatientsEither: (state) => {
      //encounterPatientCPTCategories
      let filteredArray = state.encounterPatientCPTCategories
        .filter((site) => site.StaPa === state.selectedSite)
        .filter((site) => site.TherapyType === "Either");
      return filteredArray.length == 0
        ? 0
        : filteredArray[0].NumPsychotherapyByType;
    },

    //***********************************************
    // APPOINTMENTS
    //*********************************************** //
    siteEncounterApptCancelNoShowPieChart: (state) => {
      // build series based on selected site
      // console.log('encounterApptCancelNoShow is: ', state.encounterApptCancelNoShow)
      let filteredArray = state.encounterApptCancelNoShow
        .filter((site) => site.StaPa === state.selectedSite)
        .map((status) => {
          return [status.CancelNoShow, +status.cancelNoShowCount];
        });
      // console.log('pie chart series is: ', mappedArray)
      return filteredArray.length == 0 ? [] : filteredArray;
    },
    siteEncounterApptNoShowTotal: (state) => {
      // console.log('in siteEncounterApptNoShowTotal, data are: ', state.encounterApptCancelNoShow)
      let filteredArray = state.encounterApptCancelNoShow
        .filter((site) => site.StaPa === state.selectedSite)
        .filter((site) => site.CancelNoShow === "NO-SHOW");
      console.log("siteEncounterApptNoShowTotal is: ", filteredArray);
      return filteredArray.length == 0 ? 0 : filteredArray[0].cancelNoShowCount;
    },
    siteEncounterApptCancelTotal: (state) => {
      // console.log('HERE!!!!!')
      let filteredArray = state.encounterApptCancelNoShow
        .filter((site) => site.StaPa === state.selectedSite)
        .filter(
          (site) =>
            site.CancelNoShow === "CANCELLED BY PATIENT" ||
            site.CancelNoShow === "CANCELLED BY PATIENT & AUTO RE-BOOK" ||
            site.CancelNoShow === "CANCELLED BY CLINIC" ||
            site.CancelNoShow === "CANCELLED BY CLINIC & AUTO RE-BOOK"
        );
      // console.log('filteredArray after filtering: ', filteredArray)
      let total = 0;
      let cancelCountTotalArr = filteredArray.map((obj) => {
        total += parseInt(obj.cancelNoShowCount, 10);
      });
      return total;
    },
    siteEncounterApptTotalStr: (state) => {
      // with commas for display
      let filteredArray = state.encounterApptCount.filter(
        (site) => site.StaPa === state.selectedSite
      );
      // console.log('filteredArray in siteEncounterApptTotalStr in store is: ', filteredArray)
      return filteredArray.length == 0
        ? 0
        : addCommas(filteredArray[0].appointmentCount);
    },
    siteEncounterApptTotal: (state) => {
      // without commas for computation
      let filteredArray = state.encounterApptCount.filter(
        (site) => site.StaPa === state.selectedSite
      );
      return filteredArray.length == 0 ? 0 : filteredArray[0].appointmentCount;
    },
    siteEncounterApptClinicNoShowTotal: (state) => {
      // console.log('the clinic cancel noshow from json: ', state.encounterApptClinicCancelNoShow)
      let filteredArray = state.encounterApptClinicCancelNoShow.filter(
        (site) => {
          // console.log('in filter, site.Sta3n is: ', site.Sta3n)
          return site.StaPa == state.selectedSite;
        }
      );
      // console.log('filteredArray is: ', filteredArray)
      return filteredArray.length == 0 ? 0 : filteredArray;
    },

    //********************************************* */
    // PROVIDERS
    //********************************************* */
    siteProviderProviderCount: (state) => {
      let filteredArray = state.providerCount
        .filter((site) => site.StaPa === state.selectedSite)
        .filter((site) => site.dataType === "providerProviderCount");
      return filteredArray.length == 0 ? 0 : filteredArray[0].countTotal;
    },
    siteProviderClinicCount: (state) => {
      let filteredArray = state.providerCount
        .filter((site) => site.StaPa === state.selectedSite)
        .filter((site) => site.dataType === "providerClinicCount");
      return filteredArray.length == 0 ? 0 : filteredArray[0].countTotal;
    },
    siteProviderPatientCount: (state) => {
      let filteredArray = state.providerCount
        .filter((site) => site.StaPa === state.selectedSite)
        .filter((site) => site.dataType === "providerPatientCount");
      return filteredArray.length == 0 ? 0 : filteredArray[0].countTotal;
    },
    siteProviders: (state) => {
      let filteredArray = state.providerInfo;
      let uniques = removeDuplicates(filteredArray, "STAFFNAME");
      // console.log('uniques Providers is: ', uniques)
      return uniques;
    },
    siteProviderSelected: (state) => {
      // console.log('return the selectedProvider: ', state.selectedProvider)
      return state.selectedProvider;
    },
    // siteProviderList: (state) => {
    //   let filteredArray = state.providerInfo
    //     .filter(site => site.dataType === 'providerInfo')
    //     .filter(site => site.StaPa === state.selectedSite)
    //     .map(site => { return { STAFFNAME: site.STAFFNAME, STAFFSID: site.STAFFSID } } )
    //   //unique the provider names
    //   console.log('siteProviderList filteredArray: ', filteredArray)
    //   filteredArray = filteredArray.filter((el, i, a) => i === a.indexOf(el))
    //   return filteredArray.length == 0 ? 0 : filteredArray // array of staffname objects?
    // },
    siteProviderInfo: (state) => {
      // console.log('in the siteProviderInfo, the state.providerInfo data is: ', state.providerInfo)
      let filteredArray = state.providerInfo;
      // .filter(site => {
      //   // console.log('going through site.dataType: ', site.dataType === 'providerInfo')
      //   site.dataType === 'providerInfo'
      // })
      // .filter(site => {
      //   // console.log(' site.Sta3n is: ',  site.Sta3n)
      //   // console.log(' state.selectedSite is: ',  state.selectedSite)
      //   // console.log('in store in siteProviderInfo, state.selectedSite is', site.Sta3n === state.selectedSite)
      //   site.StaPa === state.selectedSite
      // })
      // console.log('siteProviderInfo has this filteredArray: ', filteredArray)
      return filteredArray.length == 0 ? 0 : filteredArray;
    },
    siteProviderPatientDetailsCPT: (state) => {
      // console.log('state.selectedSite: ', state.selectedSite)
      let filteredArray = state.providerPatientDetailsCPT.filter((site) => {
        // console.log('site.Sta3n: ', site.Sta3n)
        // console.log('site.StaPa: ', site.StaPa)
        return site.StaPa === state.selectedSite;
      });
      // console.log('siteProviderPatientDetailCPT filteredArray', filteredArray)
      return filteredArray.length == 0 ? 0 : filteredArray;
    },
    siteProviderDetails: (state) => {
      let filteredArray = state.providerDetails.filter((site) => {
        // ** Note: selectedSite is cast to number for comparison
        // console.log('in siteProviderDetails, StaPa: ', site.StaPa)
        // console.log('in siteProviderDetails selectedSite is: ', state.selectedSite)
        return site.StaPa === state.selectedSite;
      });
      return filteredArray.length == 0 ? 0 : filteredArray;
    },

    //********************************************* */
    // SURVEYS -- NOW MBC
    //********************************************* */
    siteSurveyTotals: (state) => {
      let sumGivenOverall = state.surveyTotals.filter(
        (site) =>
          site.StaPa === state.selectedSite &&
          site.dataType == "surveysGivenOverall"
      );
      // console.log("sumGivenOverall is: ", sumGivenOverall);
      let sumGivenTotal =
        sumGivenOverall.length == 0 ? 0 : +sumGivenOverall[0].sumTotal;

      return { surveysGivenOverall: sumGivenTotal };
    },
    siteSurveyClinicTotals: (state) => {
      let surveysGivenClinics = state.surveyTotals.filter(
        (site) =>
          site.StaPa === state.selectedSite &&
          site.dataType == "surveysGivenClinics"
      );
      let surveysGivenClinicsTot =
        surveysGivenClinics.length == 0 ? 0 : +surveysGivenClinics[0].sumTotal;

      let surveysTotalClinics = state.surveyTotals.filter(
        (site) =>
          site.StaPa === state.selectedSite &&
          site.dataType == "surveysTotalClinics"
      );
      let surveysTotalClinicsTot =
        surveysTotalClinics.length == 0 ? 0 : +surveysTotalClinics[0].sumTotal;

      return {
        surveysGivenClinics: surveysGivenClinicsTot,
        surveysTotalClinics: surveysTotalClinicsTot,
      };
    },
    siteSurveyProviderTotals: (state) => {
      let surveysGivenProviders = state.surveyTotals.filter(
        (site) =>
          site.StaPa === state.selectedSite &&
          site.dataType == "surveysGivenProviders"
      );
      let surveysGivenProvidersTot =
        surveysGivenProviders.length == 0
          ? 0
          : +surveysGivenProviders[0].sumTotal;

      let surveysTotalProviders = state.surveyTotals.filter(
        (site) =>
          site.StaPa === state.selectedSite &&
          site.dataType == "surveysTotalProviders"
      );
      let surveysTotalProvidersTot =
        surveysTotalProviders.length == 0
          ? 0
          : +surveysTotalProviders[0].sumTotal;

      return {
        surveysGivenProviders: surveysGivenProvidersTot,
        surveysTotalProviders: surveysTotalProvidersTot,
      };
    },
    siteSurveyPatientTotals: (state) => {
      let surveysGivenPatients = state.surveyTotals.filter(
        (site) =>
          site.StaPa === state.selectedSite &&
          site.dataType == "surveysGivenPatients"
      );
      let surveysGivenPatientsTot =
        surveysGivenPatients.length == 0
          ? 0
          : +surveysGivenPatients[0].sumTotal;

      let surveysTotalPatients = state.surveyTotals.filter(
        (site) =>
          site.StaPa === state.selectedSite &&
          site.dataType == "surveysTotalPatients"
      );
      let surveysTotalPatientsTot =
        surveysTotalPatients.length == 0
          ? 0
          : +surveysTotalPatients[0].sumTotal;
      return {
        surveysGivenPatients: surveysGivenPatientsTot,
        surveysTotalPatients: surveysTotalPatientsTot,
      };
    },
    siteSurveyDetails: (state) => {
      let filteredArray = state.surveyDetails.filter(
        (site) => site.StaPa === state.selectedSite
      );
      // console.log('filteredArray from siteSurveyDetails', filteredArray)
      return filteredArray.length == 0 ? 0 : filteredArray;
    },
    siteSurveyPatientDetails: (state) => {
      let filteredArray = state.surveyPatientDetails
        .filter((site) => site.StaPa === state.selectedSite)
        .filter((site) => site.StaffName != "NULL");
      // console.log('filteredArray', filteredArray)
      return filteredArray.length == 0 ? 0 : filteredArray;
    },

    // Add surveys for MBC -- PCL5
    //	ERIN 11/4/20 clarifying widgets

    //  surveyPCL5: [] --> state variable that will hold PCL5 server data

    //      surveyPCL5Total
    //      surveyProvidersTotal
    //      surveyProvidersPCL5
    //      surveyPatientsTotal
    //      surveyPatientsPCL5oneOrMore
    //      surveyPatientsPCL5moreThanOne

    siteMBCPCL5: (state) => {
      let filteredArray = state.surveyPCL5
        .filter((site) => site.StaPa === state.selectedSite)
        .filter((site) => {
          // console.log(
          //   "checking the dataType of the data coming in: ",
          //   site.dataType
          // );
          return site.dataType === "surveyPCL5Total";
        });
      // console.log("siteMBCPCL5 filteredArray is: ", filteredArray);
      return filteredArray.length == 0 ? 0 : filteredArray[0].sumTotal;
    },
    siteMBCProvidersTotal: (state) => {
      let filteredArray = state.surveyPCL5
        .filter((site) => site.StaPa === state.selectedSite)
        .filter((site) => site.dataType === "surveyProvidersTotal");
      return filteredArray.length == 0 ? 0 : filteredArray[0].sumTotal;
    },
    // Removed w revision 3.2.2021
    // siteMBCProvidersPCL5Total: (state) => {
    //   let filteredArray = state.surveyPCL5
    //     .filter((site) => site.StaPa === state.selectedSite)
    //     .filter((site) => site.dataType === "surveyProvidersPCL5");
    //   return filteredArray.length == 0 ? 0 : filteredArray[0].sumTotal;
    // },

    siteMBCProvidersPrimaryPCL5Total: (state) => {
      let filteredArray = state.surveyPCL5
        .filter((site) => site.StaPa === state.selectedSite)
        .filter((site) => site.dataType === "surveyProvidersPrimaryPCL5");
      return filteredArray.length == 0 ? 0 : filteredArray[0].sumTotal;
    },
    siteMBCPatientsTotal: (state) => {
      let filteredArray = state.surveyPCL5
        .filter((site) => site.StaPa === state.selectedSite)
        .filter((site) => site.dataType === "surveyPatientsTotal");
      return filteredArray.length == 0 ? 0 : filteredArray[0].sumTotal;
    },
    siteMBCProvidersPrimaryAndOrdererPCL5Totals: (state) => {
      let filteredArray = state.surveyPCL5Providers
        .filter((site) => site.StaPa === state.selectedSite)
        .filter((site) => {
          // console.log("checking for surveyProvidersPrimaryAndOrderer ", site);
          return site.dataType === "surveyProvidersPrimaryAndOrderer";
        });
      // console.log("filteredArray is: ", filteredArray);
      return filteredArray.length == 0 ? 0 : filteredArray;
    },

    siteMBCPatientsTotalWith2orMoreSessions: (state) => {
      let filteredArray = state.surveyPCL5
        .filter((site) => site.StaPa === state.selectedSite)
        .filter(
          (site) => site.dataType === "surveyPatientsTotal2orMoreSessions"
        );
      return filteredArray.length == 0 ? 0 : filteredArray[0].sumTotal;
    },
    siteMBCPatientsPCL5oneOrMore: (state) => {
      let filteredArray = state.surveyPCL5
        .filter((site) => site.StaPa === state.selectedSite)
        .filter((site) => site.dataType === "surveyPatientsPCL5oneOrMore");
      return filteredArray.length == 0 ? 0 : filteredArray[0].sumTotal;
    },
    siteMBCPatientsPCL5moreThanOne: (state) => {
      let filteredArray = state.surveyPCL5
        .filter((site) => site.StaPa === state.selectedSite)
        .filter((site) => site.dataType === "surveyPatientsPCL5moreThanOne");
      return filteredArray.length == 0 ? 0 : filteredArray[0].sumTotal;
    },

    //   Widget #1
    //	 Total PCL-5s Given
    //      surveyPCL5total

    //    Widget #2
    //    Proportion of Providers Giving PCL5s
    //      surveyProvidersPCL5 / surveyProvidersTotal * 100 %

    //    Widget #3
    //    Proportion of Patients Getting One or More PCL5s
    //      surveyPatientsPCL5oneOrMore / surveyPatientsTotal * 100 %

    //    Widget #4
    //    Proportion of Patients Giving Two or More PCL5s
    //      surveyPatientsPCL5moreThanOne / surveyPatientsTotal * 100 %

    //************************************************* */
    //  EBP
    //************************************************* */
    siteEBPSessionsAny: (state) => {
      // console.log('in siteEBPSessionsAny and state.ebpSummary datatype is: ', typeof state.ebpSummary)
      let filteredArray = state.ebpSummary
        .filter((site) => site.StaPa === state.selectedSite)
        .filter((site) => site.dataType === "ebp_sessions");
      return filteredArray.length == 0 ? 0 : filteredArray[0].sumTotal;
    },
    siteALLSessions: (state) => {
      let filteredArray = state.ebpSummary
        .filter((site) => site.StaPa === state.selectedSite)
        .filter((site) => site.dataType === "all_sessions");
      return filteredArray.length == 0 ? 0 : filteredArray[0].sumTotal;
    },
    //  patients totals akin to the above session totals
    siteEBPPatientsAny: (state) => {
      let filteredArray = state.ebpSummary
        .filter((site) => site.StaPa === state.selectedSite)
        .filter((site) => site.dataType === "ebp_patients");
      return filteredArray.length == 0 ? 0 : filteredArray[0].sumTotal;
    },
    siteEBPSessionsPECPT: (state) => {
      let filteredArray = state.ebpSummary
        .filter((site) => site.StaPa === state.selectedSite)
        .filter((site) => site.dataType === "ebp_sessions_pe_cpt");
      return filteredArray.length == 0 ? 0 : filteredArray[0].sumTotal;
    },
    siteEBPPatientsPECPT: (state) => {
      let filteredArray = state.ebpSummary
        .filter((site) => site.StaPa === state.selectedSite)
        .filter((site) => site.dataType === "ebp_patients_pe_cpt");
      return filteredArray.length == 0 ? 0 : filteredArray[0].sumTotal;
    },
    siteALLPatients: (state) => {
      let filteredArray = state.ebpSummary
        .filter((site) => site.StaPa === state.selectedSite)
        .filter((site) => site.dataType === "all_patients");
      // console.log('siteALLPatients filteredArray[0]: ', filteredArray[0] )
      return filteredArray.length == 0 ? 0 : filteredArray[0].sumTotal;
    },
    siteEBPSessionsInd: (state) => {
      let filteredArray = state.ebpSummary
        .filter((site) => site.StaPa === state.selectedSite)
        .filter((site) => site.dataType === "ebp_sessions_ind");
      return filteredArray.length == 0 ? 0 : filteredArray[0].sumTotal;
    },
    siteALLSessionsInd: (state) => {
      let filteredArray = state.ebpSummary
        .filter((site) => site.StaPa === state.selectedSite)
        .filter((site) => site.dataType === "all_sessions_ind");
      return filteredArray.length == 0 ? 0 : filteredArray[0].sumTotal;
    },
    siteEBPPatientsInd: (state) => {
      let filteredArray = state.ebpSummary
        .filter((site) => site.StaPa === state.selectedSite)
        .filter((site) => site.dataType === "ebp_patients_ind");
      return filteredArray.length == 0 ? 0 : filteredArray[0].sumTotal;
    },
    siteALLPatientsInd: (state) => {
      let filteredArray = state.ebpSummary
        .filter((site) => site.StaPa === state.selectedSite)
        .filter((site) => site.dataType === "all_patients_ind");
      return filteredArray.length == 0 ? 0 : filteredArray[0].sumTotal;
    },
    siteEBPSessionsGrp: (state) => {
      let filteredArray = [];
      filteredArray = state.ebpSummary
        .filter((site) => site.StaPa === state.selectedSite)
        .filter((site) => site.dataType === "ebp_sessions_grp");
      return filteredArray.length == 0
        ? 0
        : filteredArray.length == 0
        ? 0
        : filteredArray[0].sumTotal;
      // return arrayEmpty(filteredArray) ? 0 : filteredArray[0].sumTotal
    },
    siteALLSessionsGrp: (state) => {
      let filteredArray = [];
      filteredArray = state.ebpSummary
        .filter((site) => site.StaPa === state.selectedSite)
        .filter((site) => site.dataType === "all_sessions_grp");
      return filteredArray.length == 0 ? 0 : filteredArray[0].sumTotal;
      //  console.log('siteEBPSessionsGrp arrayEmpty(filteredArray) ', arrayEmpty(filteredArray))
      // return arrayEmpty(filteredArray) ? 0 : filteredArray[0].sumTotal
    },
    siteEBPPatientsGrp: (state) => {
      let filteredArray = [];
      filteredArray = state.ebpSummary
        .filter((site) => site.StaPa === state.selectedSite)
        .filter((site) => site.dataType === "ebp_patients_grp");
      return filteredArray.length == 0 ? 0 : filteredArray[0].sumTotal;
      // return filteredArray[0].sumTotal
    },
    siteALLPatientsGrp: (state) => {
      let filteredArray = state.ebpSummary
        .filter((site) => site.StaPa === state.selectedSite)
        .filter((site) => site.dataType === "all_patients_grp");
      return filteredArray.length == 0 ? 0 : filteredArray[0].sumTotal;
    },

    // siteEBPClinics: (state) => {
    //   let filteredArray = state.ebpInfo
    //     .filter(site => site.StaPa === state.selectedSite)
    //     .filter(site => site.dataType === 'ebpClinics')
    //   return filteredArray.length == 0 ? 0 : filteredArray[0].totalNum
    // },
    // siteEBPClinicsAll: (state) => {
    //   let filteredArray = state.ebpInfo
    //     .filter(site => site.StaPa === state.selectedSite)
    //     .filter(site => site.dataType === 'ebpClinicsAll')
    //   return filteredArray.length == 0 ? 0 : filteredArray[0].totalNum
    // },
    // siteEBPClinicsPEI: (state) => {
    //   let filteredArray = state.ebpInfo
    //     .filter(site => site.StaPa === state.selectedSite)
    //     .filter(site => site.dataType === 'ebpClinicsPEI')
    //   return filteredArray.length == 0 ? 0 : filteredArray[0].totalNum
    //   // return filteredArray[0].totalNum
    // },
    // siteEBPClinicsCPT: (state) => {
    //   let filteredArray = state.ebpInfo
    //     .filter(site => site.StaPa === state.selectedSite)
    //     .filter(site => site.dataType === 'ebpClinicsCPT')
    //   return filteredArray.length == 0 ? 0 : filteredArray[0].totalNum
    // },
    // siteEBPProviders: (state) => {
    //   let filteredArray = state.ebpInfo
    //     .filter(site => site.StaPa === state.selectedSite)
    //     .filter(site => site.dataType === 'ebpProviders')
    //   return filteredArray.length == 0 ? 0 : filteredArray[0].totalNum
    // },
    // siteEBPProvidersAll: (state) => {
    //   let filteredArray = state.ebpInfo
    //     .filter(site => site.StaPa === state.selectedSite)
    //     .filter(site => site.dataType === 'ebpProvidersAll')
    //   return filteredArray.length == 0 ? 0 : filteredArray[0].totalNum
    // },
    // siteEBPProvidersPEI: (state) => {
    //   let filteredArray = state.ebpInfo
    //     .filter(site => site.StaPa === state.selectedSite)
    //     .filter(site => site.dataType === 'ebpProvidersPEI')
    //   return filteredArray.length == 0 ? 0 : filteredArray.length == 0 ? 0 : filteredArray[0].totalNum
    //   // return filteredArray[0].totalNum
    // },
    // siteEBPProvidersCPT: (state) => {
    //   let filteredArray = state.ebpInfo
    //     .filter(site => site.StaPa === state.selectedSite)
    //     .filter(site => site.dataType === 'ebpProvidersCPT')
    //   return filteredArray.length == 0 ? 0 : filteredArray[0].totalNum
    // },
    // siteEBPPatients: (state) => {
    //   let filteredArray = state.ebpInfo
    //     .filter(site => site.StaPa === state.selectedSite)
    //     .filter(site => site.dataType === 'ebpPatients')
    //   return filteredArray.length == 0 ? 0 : filteredArray[0].totalNum
    // },
    // siteEBPPatientsAll: (state) => {
    //   let filteredArray = state.ebpInfo
    //     .filter(site => site.StaPa === state.selectedSite)
    //     .filter(site => site.dataType === 'ebpPatientsAll')
    //   return filteredArray.length == 0 ? 0 : filteredArray[0].totalNum
    // },
    // siteEBPPatientsPEI: (state) => {
    //   let filteredArray = state.ebpInfo
    //     .filter(site => site.StaPa === state.selectedSite)
    //     .filter(site => site.dataType === 'ebpPatientsPEI')
    //   return filteredArray.length == 0 ? 0 : filteredArray[0].totalNum
    //   // return filteredArray[0].totalNum
    // },
    // siteEBPPatientsCPT: (state) => {
    //   let filteredArray = state.ebpInfo
    //     .filter(site => site.StaPa === state.selectedSite)
    //     .filter(site => site.dataType === 'ebpPatientsCPT')
    //   return filteredArray.length == 0 ? 0 : filteredArray[0].totalNum
    // },
    siteEBPClinicSummary: (state) => {
      let filteredArray = state.ebpDetails.filter((site) => {
        // console.log('site.StaPa is: ', site.StaPa)
        // console.log('state.selectedSite is: ', state.selectedSite)
        // ** Note: selectedSite is cast to number for comparison
        return site.StaPa === state.selectedSite;
      });
      // console.log('from siteEBPClinicSummary: ', filteredArray)
      return filteredArray.length == 0 ? [] : filteredArray;
    },
    siteEBPDetailsSessionsSurveys: (state) => {
      let filteredArray = state.ebpDetailsSessionsSurveys.filter((site) => {
        // console.log('site.StaPa is: ', site.StaPa)
        // console.log('state.selectedSite is: ', state.selectedSite)
        // ** Note: selectedSite is cast to number for comparison
        return site.StaPa === state.selectedSite;
      });
      // console.log('from siteEBPDetailsSessionsSurveys: ', filteredArray)
      return filteredArray.length == 0 ? [] : filteredArray;
    },
    // ebpDetailSessionSurvey
    siteEBPPieChartSeries: (state) => {
      // build series based on selected site
      // console.log('ebpPieChart is: ', state.ebpPieChart)
      let filteredArray = state.ebpPieChart
        .filter((site) => site.StaPa === state.selectedSite)
        .map((status) => {
          return [status.HealthFactorCategoryShort, +status.Num];
        });
      // console.log('pie chart series is: ', mappedArray)
      return filteredArray.length == 0 ? [] : filteredArray;
    },
    siteEBPDetailsTypes: (state) => {
      let filteredArray = state.ebpDetailsTypes.filter(
        (site) => site.StaPa === state.selectedSite
      );
      // console.log('filteredArray', filteredArray)
      return filteredArray.length == 0 ? [] : filteredArray;
    },

    // siteEBPPatientsCPTIndividualOnly: (state) => {
    //   let filteredArray = state.ebpPatientsCPTCategories
    //     .filter(site => site.StaPa === state.selectedSite)
    //     .filter(site => site.TherapyType === 'IndividualOnly')
    //   return filteredArray[0] ? filteredArray[0].NumPsychotherapyByType : 0
    // },
    // siteEBPPatientsCPTGroupOnly: (state) => {
    //   let filteredArray = state.ebpPatientsCPTCategories
    //     .filter(site => site.StaPa === state.selectedSite)
    //     .filter(site => site.TherapyType === 'GroupOnly')
    //   return filteredArray[0] ? filteredArray[0].NumPsychotherapyByType : 0
    // },
    // siteEBPPatientsCPTBoth: (state) => {
    //   let filteredArray = state.ebpPatientsCPTCategories
    //     .filter(site => site.StaPa === state.selectedSite)
    //     .filter(site => site.TherapyType === 'Both')
    //     // console.log('for both filteredArray is: ', filteredArray)
    //   return filteredArray[0] ? filteredArray[0].NumPsychotherapyByType : 0
    // },

    //************************************************ */
    // SUPPLEMENTAL FUNCTIONS
    //************************************************ */
    canFilterBySite: (state) => {
      let path = state.route.path;
      let regx = /\/(\w+)$/; //find currentpage
      let pageObj = regx.exec(path);
      // console.log('in canFilterBySite, pageObj is: ', pageObj)
      let page = pageObj[1];
      // console.log('in canFilterBySite, page is: ', page)
      // console.log('state.siteFilterAllowed: ', state.siteFilterAllowed)
      // console.log('just trying state.siteFilterAllowed.ebp: ', state.siteFilterAllowed.ebp)
      // console.log('in getter canFilterBySite, state.siteFilterAllowed for this page is: ', state.siteFilterAllowed[page])

      if (state.siteFilterAllowed[page]) {
        // console.log('filterAllowed is: ', state.siteFilterAllowed[page])
        return state.siteFilterAllowed[page];
      } else {
        // console.log('filterAllowed is NO!!: ', state.siteFilterAllowed[page])
        return false;
      }
    },
  },

  // *****************************************
  //      ACTIONS
  // *****************************************
  actions: {
    LOG_USAGE(context, pages) {
      const params = usageParams(context.state); //, context.state.route.name)

      const path = "pct.cgi";

      axios.get(`${path}?${params}`).then((response) => {
        // console.log('returned from submitting usage, no action to take')
      });
    },
    EBP_PIE_CHART(context) {
      // console.log('in EBP_PIE_CHART Action, check context here', context)

      const path = "pct.cgi";
      // const params = 'format=ebp_pie_chart&staPa=' + context.state.selectedSite + '&dateRange=' + context.state.selectedRange
      const format = "ebp_pie_chart";
      const allparams = setParams(format, context.state);

      axios.get(`${path}?${allparams}`).then((response) => {
        // console.log('IN EBP_PIE_CHART ebp summary details from server is: ', response.data )
        // console.log('response.data is: ', response.data)
        // console.log('check context before commit: ', context)
        context.commit("SET_EBP_PIE_CHART", response.data);
      });
    },
    EBP_SUMMARY(context) {
      // console.log('in EBP_SUMMARY Action, check context here', context)

      const path = "pct.cgi";
      // const params = 'format=ebp_summary&staPa=' + context.state.selectedSite + '&dateRange=' + context.state.selectedRange
      const format = "ebp_summary";
      const allparams = setParams(format, context.state);

      axios.get(`${path}?${allparams}`).then((response) => {
        // console.log('IN EBP_SUMMARY ebp summary details from server is: ', typeof )
        // console.log('response.data is: ', response.data)
        // console.log('check context before commit: ', context)
        context.commit("SET_EBP_SUMMARY", response.data);
      });
    },
    EBP_DETAILS(context) {
      // console.log('in EBP_DETAILS Action, check context here', context)

      const path = "pct.cgi";
      // const params = 'format=ebp_details&staPa=' + context.state.selectedSite + '&dateRange=' + context.state.selectedRange
      const format = "ebp_details";
      const allparams = setParams(format, context.state);

      axios.get(`${path}?${allparams}`).then((response) => {
        // console.log('got consult details from server')
        // console.log('response.data is: ', response.data)
        // console.log('check context before commit: ', context)
        context.commit("SET_EBP_DETAILS", response.data);
      });
    },
    EBP_DETAILS_TYPES(context) {
      // console.log('in EBP_DETAILS_TYPES Action, check context here', context)

      const path = "pct.cgi";
      // const params = 'format=ebp_details_types&staPa=' + context.state.selectedSite + '&dateRange=' + context.state.selectedRange
      const format = "ebp_details_types";
      const allparams = setParams(format, context.state);

      axios.get(`${path}?${allparams}`).then((response) => {
        // console.log('response.data is: ', response.data)
        // console.log('check context before commit: ', context)
        context.commit("SET_EBP_DETAILS_TYPES", response.data);
      });
    },
    EBP_DETAILS_SESSIONS_SURVEYS(context) {
      // console.log('in EBP_DETAILS_SESSIONS_SURVEYS Action, check context here', context)

      const path = "pct.cgi";
      const format = "ebp_details_sessions_surveys";
      const allparams = setParams(format, context.state);

      axios.get(`${path}?${allparams}`).then((response) => {
        // console.log('got consult details from server')
        // console.log('EBP_DETAILS_SESSIONS_SURVEYS response.data is: ', response.data)
        // console.log('check context before commit: ', context)
        context.commit("SET_EBP_DETAILS_SESSIONS_SURVEYS", response.data);
      });
    },
    SURVEY_DETAILS(context) {
      // console.log('in SURVEY_DETAILS Action, check context here', context)

      const path = "pct.cgi";
      const format = "survey_details";
      const allparams = setParams(format, context.state);

      // const params = 'format=survey_details&staPa=' + context.state.selectedSite + '&dateRange=' + context.state.selectedRange
      // console.log('SURVEY_DETAILS action, allparams is: ', allparams)
      axios.get(`${path}?${allparams}`).then((response) => {
        // console.log('got consult details from server')
        // console.log('response.data is: ', response.data)
        // console.log('check context before commit: ', context)
        context.commit("SET_SURVEY_DETAILS", response.data);
      });
    },
    SURVEY_TOTALS(context) {
      // console.log('in SURVEY_TOTALS Action, check context here', context)

      const path = "pct.cgi";
      const format = "survey_totals";
      const allparams = setParams(format, context.state);
      // const params = 'format=survey_totals&staPa=' + context.state.selectedSite + '&dateRange=' + context.state.selectedRange

      axios.get(`${path}?${allparams}`).then((response) => {
        // console.log('got SURVEY_TOTALS  from server')
        // console.log('response.data is: ', response.data)
        // console.log('check context before commit: ', context)
        context.commit("SET_SURVEY_TOTALS", response.data);
      });
    },
    SURVEY_PCL5(context) {
      const path = "pct.cgi";
      const format = "survey_pcl5";
      const allparams = setParams(format, context.state);
      // console.log("SURVEY_PCL5 allparams is: ", allparams);
      axios.get(`${path}?${allparams}`).then((response) => {
        // console.log("got survey_pcl5 from server");
        // console.log("response.data is: ", response.data);
        // console.log('check context before commit: ', context)
        context.commit("SET_SURVEY_PCL5", response.data);
      });
    },
    SURVEY_PCL5_PROVIDERS(context) {
      const path = "pct.cgi";
      const format = "survey_pcl5_providers";
      const allparams = setParams(format, context.state);
      // console.log("SURVEY_PCL5_PROVIDERS allparams is: ", allparams);
      axios.get(`${path}?${allparams}`).then((response) => {
        // console.log("got survey_pcl5_providers from server");
        // console.log("response.data is: ", response.data);
        // console.log('check context before commit: ', context)
        context.commit("SET_SURVEY_PCL5_PROVIDERS", response.data);
      });
    },

    SURVEY_PATIENT_DETAILS(context) {
      // console.log('in survey_patient_details action, check context here', context)

      const path = "pct.cgi";
      const format = "survey_patient_details";
      const allparams = setParams(format, context.state);
      // const params = 'format=survey_patient_details&stapa=' + context.state.selectedsite + '&daterange=' + context.state.selectedrange

      axios.get(`${path}?${allparams}`).then((response) => {
        // console.log("got survey_patient_details  from server");
        // console.log("response.data is: ", response.data);
        // console.log('check context before commit: ', context)
        context.commit("SET_SURVEY_PATIENT_DETAILS", response.data);
      });
    },
    INSTITUTIONS_SELECTED(context, institutions) {
      // console.log('in INSTITUTIONS_SELECTED, institutions are: ', institutions)

      // synchonous to assure state.selectedInstitutions & state.selectedInstitutionsNames
      // are set before refreshing all data
      context.commit("SET_INSTITUTIONS_SELECTED", institutions);

      // refresh the page -> setParams should now use selectedInstitutions
      context.dispatch("REFRESH_ALL_DATA");
    },

    /* PROVIDERS */
    PROVIDER_SELECTED(context, provider) {
      // console.log('PROVIDER_SELECTED action changed selectedProvider to: ', provider)
      context.state.selectedProvider = provider; // next step is getting the encounter data filtered by providerSID
      // respond to selected provider but requesting new filtered data
    },
    PROVIDER_COUNT(context) {
      // console.log('in PROVIDER_COUNT Action, check context here', context)

      const path = "pct.cgi";
      // const params = 'format=provider_count&staPa=' + context.state.selectedSite + '&dateRange=' + context.state.selectedRange
      const format = "provider_count";
      const allparams = setParams(format, context.state);
      // console.log('PROVIDER_COUNT allparams: ', allparams)
      axios
        .get(`${path}?${allparams}`)
        // axios.get(`${path}?${params}`)
        .then((response) => {
          // console.log('got PROVIDER_COUNT from server')
          // console.log('response.data is: ', response.data)
          // console.log('check context before commit: ', context)
          context.commit("SET_PROVIDER_COUNT", response.data);
        });
    },
    PROVIDER_DETAILS(context) {
      // console.log('in PROVIDER_DETAILS Action, check context here', context)
      const path = "pct.cgi";
      // const params = 'format=provider_count&staPa=' + context.state.selectedSite + '&dateRange=' + context.state.selectedRange
      const format = "provider_details";
      const allparams = setParams(format, context.state);

      axios.get(`${path}?${allparams}`).then((response) => {
        // console.log('got consult details from server')
        // console.log('provider_details response.data is: ', response.data)
        // console.log('check context before commit: ', context)
        context.commit("SET_PROVIDER_DETAILS", response.data);
      });
    },
    PROVIDER_INFO(context) {
      // console.log('in PROVIDER_INFO Action, check context here', context)

      const path = "pct.cgi";
      const format = "provider_info";
      // const params = 'format=provider_info&staPa=' + context.state.selectedSite + '&dateRange=' + context.state.selectedRange
      const allparams = setParams(format, context.state);

      axios.get(`${path}?${allparams}`).then((response) => {
        // console.log('got PROVIDER_INFO from server')
        // console.log('PROVIDER_INFO server response.data is: ', response.data)
        // console.log('check context before commit: ', context)
        context.commit("SET_PROVIDER_INFO", response.data);
      });
    },
    PROVIDER_PATIENT_DETAILS_CPT(context) {
      // console.log('in PROVIDER_PATIENT_DETAILS_CPT Action, check context here', context)

      const path = "pct.cgi";
      const format = "provider_patient_details_cpt";
      // const params = 'format=provider_patient_details_cpt&staPa=' + context.state.selectedSite + '&dateRange=' + context.state.selectedRange
      // console.log('PROVIDER_PATIENT_DETAILS_CPT params: ', params)
      const allparams = setParams(format, context.state);

      axios.get(`${path}?${allparams}`).then((response) => {
        // console.log('got provider_patient_details_cpt from server', response.data)
        // console.log('PROVIDER_PATIENT_DETAILS_CPT server response.data is: ', response.data)
        // console.log('check context before commit: ', context)
        context.commit("SET_PROVIDER_PATIENT_DETAILS_CPT", response.data);
      });
    },

    /******************** ENCOUNTERS *************** */
    ENCOUNTER_TELEHEALTH(context) {
      // console.log('in ENCOUNTER_PATIENT_LINE_CHART Action, check context here', context)

      const path = "pct.cgi";
      const format = "encounter_telehealth";
      const allparams = setParams(format, context.state);
      // console.log('ENCOUNTER_TELEHEALTH action url: ', `${path}?${allparams}`)
      // const params = 'format=encounter_patient_line_chart&staPa=' + context.state.selectedSite + '&dateRange=' + context.state.selectedRange
      axios.get(`${path}?${allparams}`).then((response) => {
        // console.log('got ENCOUNTER_TELEHEALTH from server')
        // console.log('ENCOUNTER_TELEHEALTH response.data is: ', response.data)
        // console.log('check context before commit: ', context)
        context.commit("SET_ENCOUNTER_TELEHEALTH", response.data);
      });
    },
    ENCOUNTER_TELEHEALTH_ALL(context) {
      // console.log('in ENCOUNTER_TELEHEALTH_ALL Action, check context here', context)

      const path = "pct.cgi";
      const format = "encounter_telehealth_all";
      const allparams = setParams(format, context.state);
      // console.log('ENCOUNTER_TELEHEALTH_ALL action url: ', `${path}?${allparams}`)
      // const params = 'format=encounter_patient_line_chart&staPa=' + context.state.selectedSite + '&dateRange=' + context.state.selectedRange
      axios.get(`${path}?${allparams}`).then((response) => {
        // console.log('got ENCOUNTER_TELEHEALTH_ALL from server')
        // console.log('ENCOUNTER_TELEHEALTH_ALL response.data is: ', response.data)
        // console.log('check context before commit: ', context)
        context.commit("SET_ENCOUNTER_TELEHEALTH_ALL", response.data);
      });
    },

    ENCOUNTER_FACE_TO_FACE(context) {
      // console.log('in encounter_face_to_face Action, check context here', context)

      const path = "pct.cgi";
      const format = "encounter_face_to_face";
      const allparams = setParams(format, context.state);
      // console.log('encounter_face_to_face action url: ', `${path}?${allparams}`)
      // const params = 'format=encounter_patient_line_chart&staPa=' + context.state.selectedSite + '&dateRange=' + context.state.selectedRange
      axios.get(`${path}?${allparams}`).then((response) => {
        // console.log('got encounter_face_to_face from server')
        // console.log('encounter_face_to_face response.data is: ', response.data)
        // console.log('check context before commit: ', context)
        context.commit("SET_ENCOUNTER_FACE_TO_FACE", response.data);
      });
    },

    ENCOUNTER_PHONE_THERAPY(context) {
      // console.log('in ENCOUNTER_PHONE_THERAPY Action, check context here', context)

      const path = "pct.cgi";
      const format = "encounter_phone_therapy";
      const allparams = setParams(format, context.state);
      // console.log('encounter_phone_therapy action url: ', `${path}?${allparams}`)
      // const params = 'format=encounter_phone_therapy&staPa=' + context.state.selectedSite + '&dateRange=' + context.state.selectedRange
      axios.get(`${path}?${allparams}`).then((response) => {
        // console.log('got encounter_phone_therapy from server')
        // console.log('encounter_phone_therapy response.data is: ', response.data)
        // console.log('check context before commit: ', context)
        context.commit("SET_ENCOUNTER_PHONE_THERAPY", response.data);
      });
    },
    ENCOUNTER_PATIENT_LINE_CHART(context) {
      // console.log('in ENCOUNTER_PATIENT_LINE_CHART Action, check context here', context)

      const path = "pct.cgi";
      const format = "encounter_patient_line_chart";
      const allparams = setParams(format, context.state);

      // const params = 'format=encounter_patient_line_chart&staPa=' + context.state.selectedSite + '&dateRange=' + context.state.selectedRange
      axios.get(`${path}?${allparams}`).then((response) => {
        // console.log('got ENCOUNTER_PATIENT_LINE_CHART from server')
        // console.log('ENCOUNTER_PATIENT_LINE_CHART response.data is: ', response.data)
        // console.log('check context before commit: ', context)
        context.commit("SET_ENCOUNTER_PATIENT_LINE_CHART", response.data);
      });
    },
    ENCOUNTER_LINE_CHART(context) {
      // console.log('in ENCOUNTER_LINE_CHART Action, check context here', context)

      const path = "pct.cgi";
      const format = "encounter_line_chart";
      const allparams = setParams(format, context.state);

      // const params = 'format=encounter_line_chart&staPa=' + context.state.selectedSite + '&dateRange=' + context.state.selectedRange
      axios.get(`${path}?${allparams}`).then((response) => {
        // console.log('got ENCOUNTER_LINE_CHART from server')
        // console.log('ENCOUNTER_LINE_CHART response.data is: ', response.data)
        // console.log('check context before commit: ', context)
        context.commit("SET_ENCOUNTER_LINE_CHART", response.data);
      });
    },
    ENCOUNTER_COUNT(context) {
      // console.log('in ENCOUNTER_CPT Action, check context here', context)

      // const params = 'format='      + 'encounter_count' +
      //                '&staPa='      + context.state.selectedSite +
      //                '&dateRange='  + context.state.selectedRange

      // define 'format' for request and set all parameters
      const path = "pct.cgi";
      const format = "encounter_count";
      const allparams = setParams(format, context.state);
      // console.log('Verify ENCOUNTER_COUNT parameters to request data: ', allparams)

      axios.get(`${path}?${allparams}`).then((response) => {
        // console.log('got ENCOUNTER_COUNT from server')
        // console.log('ENCOUNTER_COUNT response.data is: ', response.data)
        // console.log('check context before commit: ', context)
        context.commit("SET_ENCOUNTER_COUNT", response.data);
      });
    },
    ENCOUNTER_CPT(context) {
      // console.log('in ENCOUNTER_CPT Action, check context here', context)

      const path = "pct.cgi";
      const format = "encounter_cpt";
      const allparams = setParams(format, context.state);

      // const params = 'format=encounter_cpt&staPa=' + context.state.selectedSite + '&dateRange=' + context.state.selectedRange
      axios.get(`${path}?${allparams}`).then((response) => {
        // console.log('got consult details from server')
        // console.log('ENCOUNTER_CPT response.data is: ', response.data)
        // console.log('check context before commit: ', context)
        context.commit("SET_ENCOUNTER_CPT", response.data);
      });
    },
    ENCOUNTER_CPT_CATEGORIES_PSYCHOTHERAPY(context) {
      // console.log('in ENCOUNTER_CPT Action, check context here', context)

      const path = "pct.cgi";
      const format = "encounter_cpt_categories_psychotherapy";
      const allparams = setParams(format, context.state);

      // const params = 'format=encounter_cpt_categories_psychotherapy&staPa=' + context.state.selectedSite + '&dateRange=' + context.state.selectedRange
      axios.get(`${path}?${allparams}`).then((response) => {
        // console.log('got ENCOUNTER_CPT_CATEGORIES_PSYCHOTHERAPY details from server')
        // console.log('ENCOUNTER_CPT_CATEGORIES_PSYCHOTHERAPY response.data is: ', response.data)
        // console.log('check context before commit: ', context)
        context.commit(
          "SET_ENCOUNTER_CPT_CATEGORIES_PSYCHOTHERAPY",
          response.data
        );
      });
    },
    ENCOUNTER_CPT_CATEGORIES(context) {
      // console.log('in ENCOUNTER_CPT_CATEGORIES Action, check context here', context)

      const path = "pct.cgi";
      const format = "encounter_cpt_categories";
      const allparams = setParams(format, context.state);

      // const params = 'format=encounter_cpt_categories&staPa=' + context.state.selectedSite + '&dateRange=' + context.state.selectedRange
      axios.get(`${path}?${allparams}`).then((response) => {
        // console.log('got ENCOUNTER_CPT_CATEGORIES details from server')
        // console.log('ENCOUNTER_CPT_CATEGORIES response.data is: ', response.data)
        // console.log('check context before commit: ', context)
        context.commit("SET_ENCOUNTER_CPT_CATEGORIES", response.data);
      });
    },
    ENCOUNTER_PATIENT_CPT_CATEGORIES(context) {
      // console.log('in ENCOUNTER_CPT Action, check context here', context)

      const path = "pct.cgi";
      const format = "encounter_patient_cpt_categories";
      const allparams = setParams(format, context.state);

      // const params = 'format=encounter_patient_cpt_categories&staPa=' + context.state.selectedSite + '&dateRange=' + context.state.selectedRange
      axios.get(`${path}?${allparams}`).then((response) => {
        // console.log('got ENCOUNTER_PATIENT_CPT_CATEGORIES details from server')
        // console.log('ENCOUNTER_PATIENT_CPT_CATEGORIES response.data is: ', response.data)
        // console.log('check context before commit: ', context)
        context.commit("SET_ENCOUNTER_PATIENT_CPT_CATEGORIES", response.data);
      });
    },

    /****************** APPOINTMENTS ******************* */
    APPOINTMENT_COUNT(context) {
      // console.log('in APP_COUNTS Action, check context here', context)

      const path = "pct.cgi";
      const format = "encounter_appt_count";
      const allparams = setParams(format, context.state);
      // const params = 'format=encounter_appt_count&staPa=' + context.state.selectedSite + '&dateRange=' + context.state.selectedRange

      axios.get(`${path}?${allparams}`).then((response) => {
        // console.log('got APP_COUNTS from server')
        // console.log('response.data is: ', response.data)
        // console.log('check context before commit: ', context)
        context.commit("SET_APPOINTMENT_COUNT", response.data);
      });
    },
    APPOINTMENT_CANCEL_NOSHOW_TOTALS(context) {
      // console.log('in APPOINTMENT_CANCEL_NOSHOW_TOTALS Action, check context here', context)

      const path = "pct.cgi";
      const format = "encounter_appt_cancel_noshow";
      const allparams = setParams(format, context.state);
      // const params = 'format=encounter_appt_cancel_noshow&staPa=' + context.state.selectedSite + '&dateRange=' + context.state.selectedRange

      axios.get(`${path}?${allparams}`).then((response) => {
        // console.log("sent these params from APPOINTMENT_CANCEL_NOSHOW_TOTALS: ", allparams)
        // console.log('got APPOINTMENT_CANCEL_NOSHOW_TOTALS from server')
        // console.log('response.data is: ', response.data)
        // console.log('check context before commit: ', context)
        context.commit("SET_APPOINTMENT_CANCEL_NOSHOW_TOTALS", response.data);
      });
    },
    APPOINTMENT_CLINIC_CANCEL_NOSHOW_TOTALS(context) {
      // console.log('in APPOINTMENT_CLINIC_CANCEL_NOSHOW_TOTALS Action, check context here', context)

      const path = "pct.cgi";
      const format = "encounter_appt_clinic_cancel_noshow";
      const allparams = setParams(format, context.state);
      // const params = 'format=encounter_appt_clinic_cancel_noshow&staPa=' + context.state.selectedSite + '&dateRange=' + context.state.selectedRange

      axios.get(`${path}?${allparams}`).then((response) => {
        // console.log('got APPOINTMENT_CLINIC_CANCEL_NOSHOW_TOTALS from server')
        // console.log('response.data is: ', response.data)
        // console.log('check context before commit: ', context)
        context.commit(
          "SET_APPOINTMENT_CLINIC_CANCEL_NOSHOW_TOTALS",
          response.data
        );
      });
    },

    /* CONSULT ACTIONS */
    CONSULT_DATA(context) {
      // console.log('in CONSULT_DATA Action, check context here', context)

      const path = "pct.cgi";
      const format = "consult_data";
      const allparams = setParams(format, context.state);
      // const params = 'format=consult_data&staPa=' + context.state.selectedSite + '&dateRange=' + context.state.selectedRange
      // console.log('path and all params: ', `${path}?${allparams}`)
      axios.get(`${path}?${allparams}`).then((response) => {
        // convert string to object
        // console.log('in action CONSULT_DATA is: ', response.data)
        // console.log('response.data.pie is: ', response.data.pie)
        // console.log('response.data.line is: ', response.data.line)

        // console.log('check context before commit: ', context)
        context.commit("SET_CONSULT_DATA", response.data);
      });
    },
    CONSULT_DETAILS(context) {
      // console.log('in CONSULT_DETAILS Action, check context here', context)

      const path = "pct.cgi";
      const format = "consult_details";
      const allparams = setParams(format, context.state);
      // const params = 'format=consult_details&staPa=' + context.state.selectedSite + '&dateRange=' + context.state.selectedRange

      axios.get(`${path}?${allparams}`).then((response) => {
        // console.log('got consult details from server')
        // console.log('CONSULT_DETAILS response.data is: ', response.data)
        // console.log('check context before commit: ', context)
        context.commit("SET_CONSULT_DETAILS", response.data);
      });
    },
    USER_PERMISSIONS(context) {
      // need to obtain sites for permissions
      // console.log('before USER_PERMISSIONS call, context.state.selectedSite is: ', context.state.selectedSite)
      const path = "pct.cgi";
      let staPa = context.state.selectedSite;
      // let sta3nRegexp = /^(\d\d\d).+$/
      // let sta3nArr = sta3nRegexp.exec(staPa)
      // let sta3n = sta3nArr[1]
      // console.log('in user_permissions action, staPa is: ', staPa)
      // console.log('in user_permissions action, sta3n is: ', sta3n[1])

      // run this w/ an ADAccount for testing in dev
      //const params = 'format=user_permissions&staPa=' + staPa + '&fakeAccount=' + 'VHA05\\VHABALRomerE'

      // run this during usual dev
      const params = "format=user_permissions&staPa=" + staPa;
      // console.log('USER_PERMISSIONS path and all params: ', `${path}?${params}`)
      axios.get(`${path}?${params}`).then((response) => {
        // console.log('in USER_PERMISSIONS, got this data back: ', response.data)
        // response.data[0] is the first row
        // instead, need the row of the current StaPa

        // context.commit('SET_USER_PERMISSIONS', response.data[0])
        context.commit("SET_USER_PERMISSIONS", response.data);

        // call LOG_USAGE
        // console.log('in USER_PERMISSION returned promise and committed permissions, here is the state: ', context.state)
        //context.dispatch('LOG_USAGE') // needed to track entry into app
        // console.log('just call LOG_USAGE, here is the state: ', context.state)
      });
    },
    REFRESH_ALL_DATA(context) {
      // prep for VISN or NATIONAL restriction of data fetch
      let VorN = selectedSiteVISNorNATIONAL(context.state);
      //  console.log("in REFRESH, VorN is: ", VorN)

      // console.log('refresh all data!')
      // be sure provider info is updated with new site or new date range
      context.dispatch("PROVIDER_INFO");

      // be sure the institution info is updated with new site or new date range
      if (!VorN) {
        context.dispatch("GET_INSTITUTIONS");
      }

      // update the user since this page could be entered anytime
      // context.state. context.dispatch('CURRENT_USER')
      // context.dispatch('USER_PERMISSIONS')

      if (context.state.route.path == "/admin/consults") {
        // console.log('calling Action CONSULT_DETAILS')
        context.dispatch("CONSULT_DATA");

        // NOT FOR VISN AND NATIONAL
        if (!VorN) {
          console.log("NO VISN or NATIONAL!");
          context.dispatch("CONSULT_DETAILS");
        }
      }
      if (context.state.route.path == "/admin/appointments") {
        // console.log('calling Action CANCEL_NO_SHOW_TOTALS')
        context.dispatch("APPOINTMENT_COUNT");
        context.dispatch("APPOINTMENT_CANCEL_NOSHOW_TOTALS");

        // NOT FOR VISN AND NATIONAL
        if (!VorN) {
          console.log("yes, VISN or NATIONAL");
          context.dispatch("APPOINTMENT_CLINIC_CANCEL_NOSHOW_TOTALS");
        }
      }
      if (context.state.route.path == "/admin/encounters") {
        // console.log('calling Actions ENCOUNTER_CPT & ENCOUNTER_CPT_CATEGORIES_PSYCHOTHERAPY')
        context.dispatch("ENCOUNTER_COUNT");
        context.dispatch("ENCOUNTER_LINE_CHART");
        context.dispatch("ENCOUNTER_PATIENT_LINE_CHART");
        context.dispatch("ENCOUNTER_CPT_CATEGORIES_PSYCHOTHERAPY");
        context.dispatch("ENCOUNTER_CPT_CATEGORIES");
        context.dispatch("ENCOUNTER_CPT");
        context.dispatch("ENCOUNTER_PATIENT_CPT_CATEGORIES");
        context.dispatch("ENCOUNTER_TELEHEALTH");
        context.dispatch("ENCOUNTER_TELEHEALTH_ALL");
        context.dispatch("ENCOUNTER_FACE_TO_FACE");
        context.dispatch("ENCOUNTER_PHONE_THERAPY");
      }
      if (context.state.route.path == "/admin/providers") {
        // console.log('calling Actions PROVIDER_DETAILS & PROVIDER_INFO & PROVIDER_PATIENT_DETAILS_CPT')
        context.dispatch("PROVIDER_COUNT");
        // NOT FOR VISN AND NATIONAL
        if (!VorN) {
          context.dispatch("PROVIDER_DETAILS");
          context.dispatch("PROVIDER_INFO");
          context.dispatch("PROVIDER_PATIENT_DETAILS_CPT");
        }
      }
      // if (context.state.route.path == "/admin/surveys") {
      //   // console.log('calling Actions PROVIDER_DETAILS & PROVIDER_INFO & PROVIDER_PATIENT_DETAILS_CPT')
      //   context.dispatch("SURVEY_TOTALS");
      //   // TABLE - DISPLAYS COUNTS AND NOT DETAILS
      //   context.dispatch("SURVEY_DETAILS");
      //   // PCL5 Data
      //   context.dispatch("SURVEY_PCL5");
      //   // PCL5 Providers and Ordered By for Table
      //   context.dispatch("SURVEY_PCL5_PROVIDERS");
      //   // NOT FOR VISN AND NATIONAL
      //   if (!VorN) {
      //     context.dispatch("SURVEY_PATIENT_DETAILS");
      //   }
      // }
      if (context.state.route.path == "/admin/mbc") {
        // console.log('calling Actions PROVIDER_DETAILS & PROVIDER_INFO & PROVIDER_PATIENT_DETAILS_CPT')
        context.dispatch("SURVEY_TOTALS");
        // TABLE - DISPLAYS COUNTS AND NOT DETAILS
        context.dispatch("SURVEY_DETAILS");
        // PCL5 Data
        context.dispatch("SURVEY_PCL5");
        // PCL5 Providers and Ordered By for Table
        context.dispatch("SURVEY_PCL5_PROVIDERS");
        // NOT FOR VISN AND NATIONAL
        if (!VorN) {
          context.dispatch("SURVEY_PATIENT_DETAILS");
        }
      }
      if (context.state.route.path == "/admin/ebp") {
        // console.log('calling Actions PROVIDER_DETAILS & PROVIDER_INFO & PROVIDER_PATIENT_DETAILS_CPT')
        context.dispatch("EBP_SUMMARY");
        context.dispatch("EBP_DETAILS");
        context.dispatch("EBP_PIE_CHART");
        context.dispatch("EBP_DETAILS_TYPES");
        // NOT FOR VISN AND NATIONAL
        if (!VorN) {
          context.dispatch("EBP_DETAILS_SESSIONS_SURVEYS");
        }
      }
    },
    INSTITUTIONS_FILTER_SHOWHIDE(context) {
      //TRIGGER FLAGE FOR SIDEBAR SHOW/HIDE TOGGLE
      context.commit("SET_INSTITUTIONS_FILTER_SHOWHIDE");
    },
    GET_INSTITUTIONS(context) {
      // console.log('GET_INSTITUTIONS action called!')

      const path = "pct.cgi";
      // need StaPa
      let staPa = context.state.selectedSite;
      // need Date Range
      let dateRange = context.state.selectedRange;
      // need Data Domain
      let route = context.state.route.path;
      let domain = route.split("/").pop();

      // SPECIAL CASE ***
      // PROVIDER PAGE GETS DATA FROM ENCOUNTERS
      // SO GET INSTITUTIONS FROM ENCOUNTERS NOT PROVIDERS
      if ((domain = "provider")) domain = "encounters";

      const allparams = setParams("get_institutions", context.state);

      // run this during usual dev
      // const params = 'format=get_institutions' +
      // '&staPa=' + staPa +
      // '&dateRange=' + dateRange +
      // '&domain=' + domain

      const params = allparams + "&domain=" + domain;

      //verify params
      // console.log('Call for institution data params: ', params)
      // console.log('path and params: ', `${path}?${params}`)
      // console.log('allparams is: ', allparams)

      axios
        .get(`${path}?${params}`)
        .then((response) => {
          // console.log('IN GET_INSTITUTIONS action, response.data is: ', response.data)

          context.commit("SET_INSTITUTIONS", response.data);
        })
        .catch(function (error) {
          // handle error
          console.log("GET_INSTITUTION action error: ", error);
        });
    },
    setSelectedSite(context, site) {
      // console.log('STATION setSelectedSite triggered')
      // SOMEHOW CALL AN ACTION TO SET A FLAG TO SIGNAL TO
      // SIDEBARSHARE THAT IT NEEDS TO RESET THE TREESELECT

      console.log("route.path is: ", context.state.route.path);
      context.commit("SET_SELECTED_SITE", site);

      context.dispatch("REFRESH_ALL_DATA");
    },
    setSelectedRange(context, range) {
      // console.log('setSelectedRange triggered')
      // console.log('route.path is: ', context.state.route.path)
      context.commit("SET_SELECTED_RANGE", range);

      context.dispatch("REFRESH_ALL_DATA");
    },
    DATEPICKER_DATES(context, dates) {
      // console.log('in DATEPICKER_DATES and got dates: ', dates)
      context.commit("SET_DATEPICKER_DATES", dates);

      context.dispatch("REFRESH_ALL_DATA");
    },
    CURRENT_PAGE(context, page) {
      // console.log('in action CURRENT_PAGE and received this page name: ', page)
      context.commit("SET_CURRENT_PAGE", page);
      // if institution filtering && page is consult
      //    reset selectedInstitutions - done locally or centrally?
      //    refresh page data without filter -- done centrally?
      //    page return to normal background -- done locally ?
    },
    CURRENT_USER(context) {
      const path = "pct.cgi";
      const params = "format=who";
      // console.log('getting user, axios get: ', `${path}?${params}`)
      // console.log(CURRENT_USER.caller.name)
      axios.get(`${path}?${params}`).then((response) => {
        // console.log('return from who: ', response)
        const remote_user = response.data[0];
        // console.log('return from who: ', remote_user)
        if (remote_user != undefined) {
          context.dispatch("setCurrentUser", {
            FirstName: remote_user.FirstName,
            LastName: remote_user.LastName,
          });
        } else {
          context.dispatch("setCurrentUser", {
            FirstName: "No",
            LastName: "User Retrieved",
          });
        }
      });
    },
    setCurrentUser(context, user) {
      // console.log('in setCurrentUser w this user: ', user)

      context.commit("SET_CURRENT_USER", user);
    },
    getSelectedConsultComments(context, ConsultSID) {
      // console.log('In this action to get current ConsultSIDs Comments for: ', ConsultSID)
      var comments = "";
      // API call to get comments for this ConsultSID -- 1400071306050
      return new Promise((resolve, reject) => {
        axios
          .get("pct.cgi?format=consult_comments&consultsid=" + ConsultSID)
          .then(
            (response) => {
              // alert('Got Data!')
              // console.log('consult_comments response is: ', response)
              // console.log('is response.data an array', Array.isArray(response.data))
              resolve(response.data);
            },
            (error) => {
              reject(error);
            }
          );
      });
    },
  },

  // mutations
  mutations: {
    SET_EBP_PIE_CHART(state, ebpPieChart) {
      // console.log('in mutate SET_EBP_SUMMARY and ebpSummary data : ', ebpSummary)
      state.ebpPieChart = ebpPieChart;
    },
    SET_EBP_SUMMARY(state, ebpSummary) {
      // console.log('in mutate SET_EBP_SUMMARY and ebpSummary data : ', ebpSummary)
      state.ebpSummary = ebpSummary;
    },
    SET_EBP_DETAILS(state, ebpDetails) {
      // console.log('in mutate SET_EBP_DETAILS and state is: ', state)
      state.ebpDetails = ebpDetails;
    },
    SET_EBP_DETAILS_TYPES(state, ebpDetailsTypes) {
      // console.log('in mutate SET_EBP_DETAILS_TYPES and state is: ', state)
      state.ebpDetailsTypes = ebpDetailsTypes;
    },
    SET_EBP_DETAILS_SESSIONS_SURVEYS(state, ebpDetailsSessionsSurveys) {
      // console.log('in mutate SET_EBP_DETAILS_SESSIONS_SURVEYS and state is: ', state)
      state.ebpDetailsSessionsSurveys = ebpDetailsSessionsSurveys;
    },
    SET_SURVEY_TOTALS(state, surveyTotals) {
      // console.log('in mutate SET_SURVEY_DETAILS and state is: ', state)
      state.surveyTotals = surveyTotals;
    },
    SET_SURVEY_PCL5(state, surveyPCL5) {
      // console.log('in mutate SET_SURVEY_PCL5 and state is: ', state)
      state.surveyPCL5 = surveyPCL5;
    },
    SET_SURVEY_PCL5_PROVIDERS(state, surveyPCL5Providers) {
      // console.log('in mutate SET_SURVEY_PCL5_PROVIDERS and state is: ', state)
      state.surveyPCL5Providers = surveyPCL5Providers;
    },
    SET_SURVEY_DETAILS(state, surveyDetails) {
      // console.log('in mutate SET_SURVEY_DETAILS and state is: ', state)
      state.surveyDetails = surveyDetails;
    },
    SET_SURVEY_PATIENT_DETAILS(state, surveyPatientDetails) {
      // console.log('in mutate SET_SURVEY_PATIENT_DETAILS and state is: ', state)
      state.surveyPatientDetails = surveyPatientDetails;
    },
    SET_PROVIDER_COUNT(state, providerCount) {
      // console.log('in mutate SET_PROVIDER_COUNT and providerCount is: ', providerCount)
      state.providerCount = providerCount;
    },
    SET_PROVIDER_DETAILS(state, providerDetails) {
      // console.log('in mutate SET_PROVIDER_DETAILS and providerDetails is: ', providerDetails)
      state.providerDetails = providerDetails;
    },
    SET_PROVIDER_INFO(state, providerInfo) {
      // console.log('in mutate SET_PROVIDER_INFO and providerInfo is: ', providerInfo)
      state.providerInfo = providerInfo;
    },
    SET_PROVIDER_PATIENT_DETAILS_CPT(state, providerPatientDetailsCPT) {
      // console.log('in mutate SET_PROVIDER_PATIENT_DETAILS_CPT and state is: ', state)
      state.providerPatientDetailsCPT = providerPatientDetailsCPT;
    },
    SET_ENCOUNTER_TELEHEALTH(state, encounterTelehealth) {
      // console.log('in mutate SET_ENCOUNTER_TELEHEALTH and state is: ', encounterTelehealth)
      state.encounterTelehealth = encounterTelehealth;
    },
    SET_ENCOUNTER_TELEHEALTH_ALL(state, encounterTelehealthAll) {
      // console.log('in mutate SET_ENCOUNTER_TELEHEALTH_ALL and state is: ', encounterTelehealthAll)
      state.encounterTelehealthAll = encounterTelehealthAll;
    },
    SET_ENCOUNTER_FACE_TO_FACE(state, encounterFaceToFace) {
      // console.log('in mutate SET_ENCOUNTER_FACE_TO_FACE and state is: ', encounterFaceToFace)
      state.encounterFaceToFace = encounterFaceToFace;
    },
    SET_ENCOUNTER_PHONE_THERAPY(state, encounterPhoneTherapy) {
      // console.log('in mutate SET_ENCOUNTER_PHONE_THERAPY and state is: ', encounterPhoneTherapy)
      state.encounterPhoneTherapy = encounterPhoneTherapy;
    },
    SET_ENCOUNTER_PATIENT_CPT_CATEGORIES(state, encounterPatientCPTCategories) {
      // console.log('in mutate SET_ENCOUNTER_PATIENT_CPT_CATEGORIES and state is: ', state)
      state.encounterPatientCPTCategories = encounterPatientCPTCategories;
    },
    SET_ENCOUNTER_PATIENT_LINE_CHART(state, encounterPatientLineChart) {
      // console.log('in mutate SET_ENCOUNTER_PATIENT_LINE_CHART and state is: ', state)
      state.encounterPatientLineChart = encounterPatientLineChart;
    },
    SET_ENCOUNTER_LINE_CHART(state, encounterLineChart) {
      // console.log('in mutate SET_ENCOUNTER_LINE_CHART and state is: ', state)
      state.encounterLineChart = encounterLineChart;
    },
    SET_ENCOUNTER_COUNT(state, encounterCount) {
      // console.log('in mutate SET_ENCOUNTER_CPT and state is: ', state)
      state.encounterCount = encounterCount;
    },
    SET_ENCOUNTER_CPT(state, encounterCPT) {
      // console.log('in mutate SET_ENCOUNTER_CPT and state is: ', state)
      state.encounterCPT = encounterCPT;
    },
    SET_ENCOUNTER_CPT_CATEGORIES_PSYCHOTHERAPY(
      state,
      encounterCPTCategoriesPsychotherapy
    ) {
      // console.log('in mutate SET_ENCOUNTER_CPT_CATEGORIES_PSYCHOTHERAPY and state is: ', state)
      state.encounterCPTCategoriesPsychotherapy = encounterCPTCategoriesPsychotherapy;
      // console.log('in mutate SET_ENCOUNTER_CPT_CATEGORIES_PSYCHOTHERAPY and state.encounterCPTCategoriesPsychotherapy is: ', state.encounterCPTCategoriesPsychotherapy)
    },
    SET_ENCOUNTER_CPT_CATEGORIES(state, encounterCPTCategories) {
      // console.log('in mutate SET_ENCOUNTER_CPT_CATEGORIES and state is: ', state)
      state.encounterCPTCategories = encounterCPTCategories;
    },
    SET_CONSULT_DETAILS(state, consultDetails) {
      // console.log('in mutate SET_CONSULT_DETAILS and state is: ', state)
      state.consultDetails = consultDetails;
    },
    SET_CONSULT_DATA(state, consultData) {
      console.log(
        "in mutate SET_CONSULT_DATA and consultData is: ",
        consultData
      );
      state.consultDataPie = consultData.pie;
      state.consultDataLine = consultData.line;
      state.consultDataCount = consultData.count;
    },
    SET_APPOINTMENT_COUNT(state, appointmentCount) {
      // console.log('in mutate SET_CANCEL_NOSHOW_TOTALS and state is: ', state)
      state.encounterApptCount = appointmentCount;
    },
    SET_APPOINTMENT_CLINIC_CANCEL_NOSHOW_TOTALS(
      state,
      appointmentClinicCancelNoShowTotals
    ) {
      // console.log('in mutate SET_CANCEL_NOSHOW_TOTALS and state is: ', state)
      state.encounterApptClinicCancelNoShow = appointmentClinicCancelNoShowTotals;
    },
    SET_APPOINTMENT_CANCEL_NOSHOW_TOTALS(state, appointmentCancelNoShowTotals) {
      // console.log('in mutate SET_CANCEL_NOSHOW_TOTALS and state is: ', state)
      state.encounterApptCancelNoShow = appointmentCancelNoShowTotals;
    },
    SET_SELECTED_SITE(state, site) {
      // console.log('in mutate SET_SELECTED_SITE TO: ', site)
      state.selectedSite = site;
      // console.log('just SET_SELECTED_SITE and state is: ', state)
    },
    SET_SELECTED_RANGE(state, range) {
      state.selectedRange = range;
    },
    SET_DATEPICKER_DATES(state, dates) {
      // console.log('in SET_DATEPICKER_DATES and got dates: ', dates)
      state.selectedRangePicker = dates; // { start, end, shortcut }
    },
    SET_CURRENT_USER(state, user) {
      // take the first record to get user
      state.userFirstName = user.FirstName;
      state.userLastName = user.LastName;
      // console.log('in SET_CURRENT_USER and state. userFirstName is: ', userFirstName)
      // console.log('in SET_CURRENT_USER and state. userLastName is: ', userLastName)

      //   if (user[0].FirstName != undefined && user[0].LastName != undefine) {
      //   state.userFirstName = user.FirstName
      //   state.userLastName = user.LastName
      //   console.log('in SET_CURRENT_USER and state. userFirstName is: ', userFirstName)
      //   console.log('in SET_CURRENT_USER and state. userLastName is: ', userLastName)
      // } else {
      //   state.userFirstName = 'No'
      //   state.userLastName = 'User Identified'
      // }
    },
    SET_CURRENT_PAGE(state, page) {
      // console.log('in mutations, set state.currentpage to: ', page)
      state.currentpage = page;
    },
    SET_USER_PERMISSIONS(state, userPermissions) {
      // userPermissions is an ARRAY with each value an object with this format
      // {Surname: "Fielstein0", GivenName: "Elliot",
      // ADAccount: "VHA09\VHATVHFIELSE0", PHIPII: "1", Sta3n: "653"}
      // set PHIPIII
      // console.log('in mutate SET_USER_PERMISSIONS with userPermissions: ', userPermissions)      // console.log('in mutate SET_USER_PERMISSIONS state.adaccount is: ', state.adaccount)

      // set the ADAccount
      let ADAccount = userPermissions[0].ADAccount;
      // hold for PHIPII access to selectedSite
      let permissionSite = {
        phipii: 0,
        adaccount: ADAccount,
      };
      // need to account for VISN 2, 15, 23 w/ multiple sites per VistA sys
      // pull out 3 digits Sta3n from selected site
      let numberPattern = /^(\d\d\d)/g;
      let selectedSta3n = state.selectedSite.match(numberPattern);
      let permissionAllSites = [];

      // iterate through returned list of permissions
      userPermissions.map(function (permissionRow) {
        // does this site match the current site
        if (permissionRow.Sta3n == selectedSta3n && permissionRow.PHIPII == 1) {
          // console.log('we have a match!')
          permissionSite.phipii = permissionRow.PHIPII;
          permissionSite.adaccount = permissionRow.ADAccount;
        }
        if (
          permissionRow.PHIPII == 1 &&
          permissionRow.Sta3n != 0 &&
          permissionRow.Sta3n != -1
        ) {
          let site = { Sta3n: permissionRow.Sta3n };
          permissionAllSites.push(site);
        }
      });
      state.phipii = permissionSite.phipii;
      state.adaccount = permissionSite.adaccount;
      // console.log('permissionAllSites: ', permissionAllSites)
      state.allphipii = permissionAllSites;
    },
    SET_INSTITUTIONS(state, institutions) {
      // console.log('in SET_INSTITUTIONS: ', institutions)

      // FIRST SORT INSTITUTIONS BY NAME FOR TREESELECT USE
      // IS AWARE OF THE FORMAT OF INSTITUTINOS COMING FROM DB SERVER
      let sortedInstitutions = institutions.sort(function (a, b) {
        if (a.label.toLowerCase() < b.label.toLowerCase()) return -1;
        if (a.label.toLowerCase() > b.label.toLowerCase()) return 1;
        return 0;
      });
      // HERE PUT THESE NAMES IN new state.institutionsNames
      // state.institutionsNames = sortedInstitutions

      // NOW PUT SIDS INTO STATE
      // state.institutionsSIDs = institutions.map(inst => {
      // return inst.id
      // })

      // WHY CAN'T THIS MUTATION SET
      //  state.selectedInstitutions
      //  state.selectedInstitutionsName
      // THEY CAN THEN BE AVAILABLE IN SIDEBARSHARE TO MANAGE
      //   -- selectedInstitutionsName USED TO DISPLAY IN DATA PAGES
      state.institutions = sortedInstitutions;
    },
    SET_INSTITUTIONS_SELECTED(state, institutions) {
      //    set the selectedInstitutions in state
      // console.log('in SET_INSTITUTIONS_SELECTED: ', institutions)
      state.selectedInstitutions = institutions["sids"]; // replace with institutions.sids
      state.selectedInstitutionsNames = institutions["names"];
    },

    SET_INSTITUTIONS_FILTER_SHOWHIDE(state) {
      // console.log('in SET_INSTITUTIONS_FILTER_SHOWHIDE where state.institutionSidebarShow is: ', state.institutionSidebarShow)
      // toggle institutionSidebarShow
      state.institutionSidebarShow = !state.institutionSidebarShow;
      // console.log('in SET_INSTITUTIONS_FILTER_SHOWHIDE and changed state.institutionSidebarShow to: ', state.institutionSidebarShow)
    },

    // SET_CURRENT_CONSULT_COMMENT (state, comments) {
    //   console.log('here I commit the current consult comment, that I will have gotten')
    //   // comments should be array
    //   const commentsType = typeof comments
    //   if (Array.isArray(comments)) { // should be an array
    //     let commentsString = ''
    //     const commentsText = comments
    //       .map((c) => {
    //         let string = c.ConsultActivityComment == null ? 'Comment Has No Text' : c.ConsultActivityComment
    //         console.log('string has a value of: ', string)
    //       })
    //     commentsString = commentsText.join('')
    //     state.currentComments = commentsString
    //   }
    // },

    // initialiseStore(state) {
    //   // Called after new Vuex.Store is instantiated

    // 	if(localStorage.getItem('store')) {
    // 		// Replace the state object with the stored item
    // 		this.replaceState(
    // 			Object.assign(state, JSON.parse(localStorage.getItem('store')))
    //     )
    //   }
    // }
  },
});

// called after mutation w/ its name, and its post mutation state
store.subscribe((mutation, state) => {
  // console.log('subscribe called')

  // prepare updated store w/ select subset of state
  let storedState = {
    selectedSite: state.selectedSite,
    selectedRange: state.selectedRange,
    selectedRangePicker: state.selectedRangePicker,
    userFirstName: state.userFirstName,
    userLastName: state.userLastName,
    phipii: state.phipii,
  };
  // store.subscribe was called
  // console.log('store.subscribe was called with selectedRangePicker set to: ', storedState.selectedRangePicker)
  // update localStorage with the mutated-changed store
  localStorage.setItem("store", JSON.stringify(storedState));
});

export default store;
