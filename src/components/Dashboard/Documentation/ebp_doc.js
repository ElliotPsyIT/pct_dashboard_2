export const ebps = [
  {
    title: "Sessions Numerator",
    value:
      "EBPs Session Counts<br/><br/>" +
      "Numerator: The EBPs Session numerator reflects a count of PCT encounters documented with an EBP template. <br/>" +
      "Only encounters of the following encounter types are used in counting EBP sessions:<br/><br/>" +
      "INDIVIDUAL SESSIONS: CPT Procedure Codes 90832 OR 90834 OR 90837<br/>" +
      "CRISIS SESSIONS: CPT Procedure Codes 90839<br/>" +
      "GROUP SESSIONS: CPT Procedure Codes 90853<br/>" +
      "FAMILY SESSIONS: CPT Procedure Codes 90847 OR 90849",
    category: "EBPs Defined ...",
  },
  {
    title: "Sessions Denominator",
    value:
      "EBPs Sessions Total Counts<br/><br/>" +
      "Numerator: The EBPs Session denominator reflects a count of total PCT encounters whether documented as EBP sessions or not. <br/>" +
      "Only encounters of the following encounter types are used in counting total denominator sessions (same CPT Codes are numerator):<br/><br/>" +
      "INDIVIDUAL SESSIONS: CPT Procedure Codes 90832 OR 90834 OR 90837<br/>" +
      "CRISIS SESSIONS: CPT Procedure Codes 90839<br/>" +
      "GROUP SESSIONS: CPT Procedure Codes 90853<br/>" +
      "FAMILY SESSIONS: CPT Procedure Codes 90847 OR 90849",
    category: "EBPs Defined ...",
  },
  {
    title: "Patients Numerator",
    value:
      "EBPs Patient Counts<br/><br/>" +
      "<u>Numerator</u>: The EBPs Patients numerator reflects a count of unique PCT patients with encounters documented with an EBP template. <br/>" +
      "Patients are counted only if their encounter was from any of the following encounter types:<br/><br/>" +
      "INDIVIDUAL SESSIONS: CPT Procedure Codes 90832 OR 90834 OR 90837<br/>" +
      "CRISIS SESSIONS: CPT Procedure Codes 90839<br/>" +
      "GROUP SESSIONS: CPT Procedure Codes 90853<br/>" +
      "FAMILY SESSIONS: CPT Procedure Codes 90847 OR 90849",
    category: "EBPs Defined ...",
  },
  {
    title: "Patients Denominator",
    value:
      "EBPs Patients Total Counts<br/><br/>" +
      "<u>Denominator</u>: The EBPs Patients denominator reflects a count of total unique PCT patients whether their sessions were documented as EBP sessions or not. <br/>" +
      "Patients are counted only if their encounter was from any the following encounter types are used in counting total denominator sessions (same CPT Codes are numerator):<br/><br/>" +
      "INDIVIDUAL SESSIONS: CPTCodes 90832 OR 90834 OR 90837<br/>" +
      "CRISIS SESSIONS: CPT Procedure Codes 90839<br/>" +
      "GROUP SESSIONS: CPT Procedure Codes 90853<br/>" +
      "FAMILY SESSIONS: CPT Procedure Codes 90847 OR 90849",
    category: "EBPs Defined ...",
  },
];

export const PEorCPT = [
  {
    title: "Session Counts: Numerator",
    value:
      "PE or CPT Session Counts<br/><br/>" +
      "<u>Numerator</u>: The PE or CPT Session numerator reflects a count of PCT encounters documented using Prolonged Exposure (PE) or Cognitive Processing Therapy (CPT) templates." +
      "Only encounters of the following encounter types are used in counting EBP PE/CPT sessions:<br/><br/>" +
      "INDIVIDUAL SESSIONS: CPT Procedure Codes 90832 OR 90834 OR 90837<br/>" +
      "CRISIS SESSIONS: CPT Procedure Codes 90839<br/>" +
      "GROUP SESSIONS: CPT Procedure Codes 90853<br/>" +
      "FAMILY SESSIONS: CPT Procedure Codes 90847 OR 90849",
    category: "PEorCPT",
  },
  {
    title: "Session Counts: Denominator",
    value:
      "PE or CPT Session Counts<br/><br/>" +
      "<u>Denominator</u>: The PE or CPT Session denominator reflects a count of total PCT encounters whether documented as EBP sessions or not.  " +
      "Only encounters of the following encounter types are used in counting total denominator sessions (same Procedural Codes as numerator)<br/><br/>" +
      "INDIVIDUAL SESSIONS: CPT Procedure Codes 90832 OR 90834 OR 90837<br/>" +
      "CRISIS SESSIONS: CPT Procedure Codes 90839<br/>" +
      "GROUP SESSIONS: CPT Procedure Codes 90853<br/>" +
      "FAMILY SESSIONS: CPT Procedure Codes 90847 OR 90849",
    category: "PEorCPT",
  },
  {
    title: "Patient Counts: Numerator",
    value:
      "PE or CPT Patient Counts<br/><br/>" +
      "<u>Numerator</u>: The PE or CPT Patients numerator reflects a count of unique PCT patients with encounters using Prolonged Exposure (PE) or Cognitive Processing Therapy (CPT) templates. <br/>" +
      "Only encounters of the following encounter types are used in counting EBP PE/CPT patients:<br/><br/>" +
      "INDIVIDUAL SESSIONS: CPT Procedure Codes 90832 OR 90834 OR 90837<br/>" +
      "CRISIS SESSIONS: CPT Procedure Codes 90839<br/>" +
      "GROUP SESSIONS: CPT Procedure Codes 90853<br/>" +
      "FAMILY SESSIONS: CPT Procedure Codes 90847 OR 90849",
    category: "PEorCPT",
  },
  {
    title: "Patients Denominator",
    value:
      "EBPs Patients Total Counts<br/><br/>" +
      "<u>Denominator</u>: The PE or CPT Patients denominator reflects a count of total unique PCT patients whether their sessions were documented as EBP sessions or not.  " +
      "Patients are counted only if their encounter was from any of the following encounter types used in counting the total denominator sessions (same Procedural Codes as numerator):<br/><br/>" +
      "INDIVIDUAL SESSIONS: CPT Procedure Codes 90832 OR 90834 OR 90837<br/>" +
      "CRISIS SESSIONS: CPT Procedure Codes 90839<br/>" +
      "GROUP SESSIONS: CPT Procedure Codes 90853<br/>" +
      "FAMILY SESSIONS: CPT Procedure Codes 90847 OR 90849",
    category: "PEorCPT",
  },
];

export const IndividualAndGroupTxEBPs = [
  {
    title: "Individual Sessions",
    value:
      "Individual Tx Session Counts<br/><br/>" +
      "<u><b>Numerator</b></u>: The Individual Tx Session numerator reflects a count of PCT encounters documented as EBP sessions. <br/>" +
      "A documented EBP session is identified if an EBP template was used in its documentation." +
      "Only encounters of the following encounter types are used in counting EBP Individual Tx sessions:<br/><br/>" +
      "INDIVIDUAL SESSIONS: CPT Procedure Codes 90832 OR 90834 OR 90837<br/>" +
      "CRISIS SESSIONS: CPT Procedure Codes 90839<br/><br/>" +
      "<u><b>Denominator</b></u>: The EBPs Session denominator reflects a count of total PCT encounters whether documented as EBP sessions or not. <br/>" +
      "Only encounters of the following encounter types are used in counting total denominator sessions (same CPT Codes are numerator):<br/><br/>" +
      "INDIVIDUAL SESSIONS: CPT Procedure Codes 90832 OR 90834 OR 90837<br/>" +
      "CRISIS SESSIONS: CPT Procedure Codes 90839<br/>",
    category: "Individual & Group Tx EBPs Defined ...",
  },
  {
    title: "Individual Patients",
    value:
      "Individual Tx EBPs Patient Counts<br/><br/>" +
      "<u><b>Numerator</b></u>: The EBPs Individual Tx Patients numerator reflects a count of unique PCT patients individual encounters documented as EBP sessions. <br/>" +
      "A documented EBP session is identified if an EBP template was used in its documentation." +
      "Patients are counted only if their encounter was from any of the following encounter types:<br/><br/>" +
      "INDIVIDUAL SESSIONS: CPT Procedure Codes 90832 OR 90834 OR 90837<br/>" +
      "CRISIS SESSIONS: CPT Procedure Codes 90839<br/><br/>" +
      "<u><b>Denominator</b></u>: The EBPs Patients denominator reflects a count of total unique PCT patients individual encounters whether their sessions were documented as EBP sessions or not. <br/>" +
      "Patients are counted only if their encounter was from any the following encounter types (same CPT Codes are numerator):<br/><br/>" +
      "INDIVIDUAL SESSIONS: CPT Procedure Codes 90832 OR 90834 OR 90837<br/>" +
      "CRISIS SESSIONS: CPT Procedure Codes 90839<br/>",
    category: "Individual & Group Tx EBPs Defined ...",
  },
  {
    title: "Group Sessions",
    value:
      "Group Tx Session Counts<br/><br/>" +
      "<u><b>Numerator</b></u>: The Group Tx Session numerator reflects a count of PCT group encounters documented as EBP sessions. <br/>" +
      "A documented EBP session is identified if an EBP template was used in its documentation." +
      "Only encounters of the following encounter types are used in counting EBP Individual Tx sessions:<br/><br/>" +
      "GROUP SESSIONS: CPT Procedure Codes 90853<br/><br/>" +
      "<u><b>Denominator</b></u>: The EBPs Session denominator reflects a count of total group PCT encounters whether documented as EBP sessions or not. <br/>" +
      "Only encounters of the following encounter types (same CPT Codes are numerator):<br/><br/>" +
      "GROUP SESSIONS: CPT Procedure Codes 90853<br/>",
    category: "Individual & Group Tx EBPs Defined ...",
  },
  {
    title: "Group Patients",
    value:
      "Group Tx EBPs Patient Counts<br/><br/>" +
      "<u><b>Numerator</b></u>: The EBPs Individual Tx Patients numerator reflects a count of unique PCT patients with encounters documented as EBP sessions. <br/>" +
      "A documented EBP session is identified if an EBP template was used in its documentation." +
      "Patients are counted only if their encounter was from any of the following encounter types are included in counting EBP patients:<br/><br/>" +
      "GROUP SESSIONS: CPT Procedure Codes 90853<br/><br/>" +
      "<u><b>Denominator</b></u>: The EBPs Patients denominator reflects a count of total unique PCT patients whether their sessions were documented as EBP sessions or not. <br/>" +
      "Patients are counted only if their encounter was from any the following encounter types are used in counting total denominator sessions (same CPT Codes are numerator):<br/><br/>" +
      "GROUP SESSIONS: CPT Procedure Codes 90853<br/>",
    category: "Individual & Group Tx EBPs Defined ...",
  },
];

export const ebpActivitySummary = [
  {
    title: "EBP Patient Counts Table (left)",
    value:
      "These are a list of the number of unique patients administered EBPs by EBP Types at each institution of a medical center site.<br/><br/>" +
      "",
    category: "EBP Activity Summary Defined ...",
  },
  {
    title: "EBP Types Pie Chart (right)",
    value:
      "The EBP Types Pie Chart displays the relative proportions, with counts, of the EBP types administerd at the selected medical center site.<br/>",
    category: "EBP Activity Summary Defined ...",
  },
];

export const ProvidersEBPsAndSurveysByClinicAndPatient = [
  {
    title: "Provider's EBPs and Surveys By Clinic and Patient Table",
    value:
      "The Provider's EBPs and Surveys By Clinic and Patient Table displays patient level EBP sessions and any administered surveys for each patient by provider at each institution of the selected medical center site. <br/><br/>" +
      "The association of EBP sesions and same day survey administration represents a Measurement Based Care proxy measure, showing the use of data in the context of EBPs. <br/><br/>" +
      "<u><b>EBP Sessions</b></u>: Each provider's EBP sessions are shown including the patient initials and last 4, EBP type, and session date<br/><br/>" +
      "<u><b>Surveys Administered</b></u>: Any surveys administered on the same day as the EBP session are listed next to the patient/session information.  Survey name, score, and date of administration are listed.",
    category: "Provider's EBPs By Clinic and Patient Defined ...",
  },
];
