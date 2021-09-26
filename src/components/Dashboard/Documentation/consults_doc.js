export const consultsAll = [
    {
      title: "Total Consults",
      value: "<u><b>Description</b></u>: Total Consults is the sum of consults from the selected date range that were set-up at the medical center with one or more stop codes. We display PCT Consults that have a PCT stop code associated with them:<br/><br/>" +
      "<b>PCT Stop Codes include:</b><br/><br/>" + 
      "<u>516 PTSD - Group</u>:<br/>" +
      "&nbsp;&nbsp;&nbsp; Records consultation and/or treatment follow-up provided to more than one individual.  " + 
      "Treatment is provided to those patients with PTSD.  Includes provider and support services.  <br/><br/>" + 
      "<u>542 Telephone PTSD</u>:<br/>"	+ 
      "&nbsp;&nbsp;&nbsp;Records patient consultation or medical care management, advice, and/or referral provided by telephone contact " + 
      "between patient or patient's next-of-kin and/or the person(s) with whom the patient has a meaningful relationship, and clinical and/or professional staff assigned to the PCT.  <br/><br/>" + 
      "<u>562 PTSD - Individual</u><br/>" +
      "&nbsp;&nbsp;&nbsp;Records patient visit for consultation, evaluation, follow-up, and/or treatment provided to an individual with PTSD.  Includes provider and support services.",
      category: "Consults Defined ..."
    },
    {
      title: "Total Patients",
      value: "<u><b>Description</b></u>: These are the total number of unique patients among the total consults from the selected time period (see above for Total Consults defined).",
      category: "Consults Defined ..."
    },
    {
      title: "Pending",
      value: "<u><b>Description</b></u>: This status designates requests that have been sent, but not yet acted on by the receiving service." + 
      "(Pending, Active and others) are pulled from the Consult Box application." +
       "<br/><br/>In the Pending box, notice the ability to 'Click to Filter PENDING'. <br/><br/>Click that text and it will automatically filter " + 
      "the Consult Statuses pie chart and the Consult Details table below to show PENDING consults only",
      category: "Consults Defined ..."
    },
    {
      title: "Active",
      value: "<u><b>Description</b></u>: This status occurs when a consult is 'received' and efforts are underway to fulfill a consult. A consult may also revert to 'active' in other scenarios such as when an appointment is canceled or no-showed." + 
      "(Pending, Active and others) are pulled from the Consult Box application." +
      "<br/><br/>In the Active box, notice the ability to 'Click to Filter ACTIVE'. Click that text and it will automatically filter " + 
      "the Consult Statuses pie chart and the Consult Details table below to show ACTIVE consults only",
      category: "Consults Defined ..."
    },
  ]

  export const consultsUniquesAndStatuses = [
    {
      title : "Consults Over Time",
      value: "<u><b>Description</b></u>: Consult Over Time is a line (actually a spline) graph of monthly consults received for the period of time specified on this site's date range drop box selected at the top of this page. " +
      "<br/><br/>For date ranges greater than one month, notice the last entry in the graph.  It may show what seems to be " + 
      "an unusually small number of consults. " + 
      "<ul><li>The reason is, the last month listed reflects the current month's data.  </li>" + 
      "<li>If we are in the early part of the current month, the first or second week of the month, only the partial month up thru " + 
      "yesterday is tallied.</li>" + 
      "<li>As a result, accounting for the partially completed current month a relatively smaller number of consults is apparent.</li>" +
      "</ul>",
      category: "Consult Uniques and Statuses Defined ...",
    },
    {
      title : "Consult Status",
      value: "<u><b>Description</b></u>: The Consult Status pie chart displays the status of all consults pulled for the selected date range for this selected site. " + 
      "The chart breaks down the number of consults into their respective consult status categories." +
      "<br/><br/><b>NOTE:</b> <u>Clicking</u> on a pie slice will filter the Consult Details table below to show consults with only the selected consult status. ",
      category: "Consult Uniques and Statuses Defined ...",
    },
  ]

  export const consultDetails = [
    {
      title: "Consult Details",
      value: "<u><b>Description</b></u>: The Consult Details table displays information on each individual consult resulting from the selected date range for the selected site. " + 
      "Consults listed are all those from the VistA Consult system that are configured with any of the following PCT stop codes: <br/><br/>" +
      "<b>Stop Codes:</b><br/>" + 
      "<u>516 PTSD - Group</u>:<br/>" +
      "<u>542 Telephone PTSD</u>:<br/>"	+ 
      "<u>562 PTSD - Individual</u><br/>" +
      "<br/>Each consult shows the site, consult date, patient, service requested, and consult status for the date range selected at the top of this page." ,
      category: "Consult Details Defined...",
    }
  ]
