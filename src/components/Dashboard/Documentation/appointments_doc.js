export const appointmentNoShowCancelSummary = [
    {
      title: "No Show & Cancelled Summary Cards",
      value: "<u><b>Description</b></u>: Clinic appointments that have not been 'Completed' are tagged by the VistAsystem with a reason.  " + 
      "For the PCT, two particularly noteworthy reasons are 'No Show' and 'Canceled' appointments.  These reasons, among others, contribute to an understanding of clinic efficiency'<br/><br/>" +
      "The '<b>No Show</b>' and '<b>Cancel</b>' two cards below tally clinic appointments, showing the percentage of all appointments with these two statuses.<br/><br/>" + 
      "<b>NOTE:</b> No Show and Cancel appointments here are those identified for PCT Clinics only based on the PCT Stop Codes:<br/><br/>" +
      "<b>Stop Codes:</b><br/>" + 
      "<u>516 PTSD - Group</u>:<br/>" +
      "<u>542 Telephone PTSD</u>:<br/>"	+ 
      "<u>562 PTSD - Individual</u><br/>",
      category: "No Show and Cancel Status Stats and Statuses Defined...",
    },
    {
      title: "Cancel No Show Pie Chart",
      value: "<u><b>Description</b></u>: The Cancel No Show pie chart breaks down incomplete appointments by their statuses from the following possible statuses: <br/><br/>" +
      " <u>NO-SHOW</u>:<br/> " +
            " <u>NO-SHOW & AUTO RE-BOOK</u>:<br/> " +
      " <u>CANCELLED BY CLINIC</u>:<br/> " +
            " <u>CANCELLED BY CLINIC & AUTO RE-BOOK</u>:<br/> " + 
            " <u>CANCELLED BY PATIENT</u>:<br/> " +
            " <u>CANCELLED BY PATIENT & AUTO-REBOOK</u>:<br/> " + 
            " <u>NO ACTION TAKEN</u>:<br/> ",
      category: "No Show and Cancel Status Stats and Statuses Defined...",
    }
  ]

  export const appointmentNoShowCancelByClinicTable = [
    {
      title: "Clinic Level Cancel & No Show",
      value: "<u><b>Description</b></u>: In PCTs, Veterans are seen in a variety of provider clinics.  The table below tallies the number of No Show and Cancelled appointments " +
      "by provider clinic.  In each table row, the total number of incomplete appointments are listed by appointment status in comparison with the total number of clinic appointments." +
      "Displaying the number of incomplete appointment along with the total number of appointments allows for estimating the rate of each incomplete appointment type (no show, cancel, etc).",
      category:"Clinic Level Cancel & No Show Table Defined..."
    }
  ]