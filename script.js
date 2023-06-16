// Store activity data
var activityData = [];

// Add event listener to the form
document.getElementById('form').addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent form submission
  
  // Validate input fields
  if (!validate()) {
    return;
  }

  // Retrieve input field values
  var activity = document.getElementById('activity').value;
  var startDate = document.getElementById('startdate').value;
  var endDate = document.getElementById('enddate').value;
  var status = document.getElementById('status').value;

  // Create an object with the activity data
  var activityObj = {
    activity: activity,
    startDate: startDate,
    endDate: endDate,
    status: status
  };

  // Add the activity data to the array
  activityData.push(activityObj);

  // Clear input fields
  document.getElementById('activity').value = '';
  document.getElementById('startdate').value = '';
  document.getElementById('enddate').value = '';
  document.getElementById('status').selectedIndex = 0;

  // Display the activity data in the table
  displayData();
});


function displayData() {
  var tbody = document.getElementById('tbody');
  tbody.innerHTML = ''; // Clear existing table rows

  // Get today's date
  var today = new Date();
  today.setHours(0, 0, 0, 0); // Set the time to 00:00:00 to compare only dates

  // Loop through the activity data array
  for (var i = 0; i < activityData.length; i++) {
    var activity = activityData[i];

    // Create a new table row
    var row = document.createElement('tr');

    // Apply strikethrough style to the row if the status is "Completed" or "Due Passed"
    if (activity.status === 'Completed' || activity.status === 'Due Passed') {
      row.style.textDecoration = 'line-through';
    }

    // Create table cells and set their values
    var activityCell = document.createElement('td');
    activityCell.textContent = activity.activity;
    row.appendChild(activityCell);

    var startDateCell = document.createElement('td');
    startDateCell.textContent = activity.startDate;
    row.appendChild(startDateCell);

    var endDateCell = document.createElement('td');
    endDateCell.textContent = activity.endDate;
    row.appendChild(endDateCell);

    var statusCell = document.createElement('td');
    statusCell.textContent = activity.status;
    row.appendChild(statusCell);

    var actionsCell = document.createElement('td');

    // Create edit button if the status is not "Due Passed" or "Completed"
    if (activity.status !== 'Due Passed' && activity.status !== 'Completed') {
      var editButton = document.createElement('button');
      editButton.textContent = 'Edit';
      editButton.setAttribute('data-index', i); // Set data-index attribute to identify the activity index
      editButton.addEventListener('click', editActivity);
      actionsCell.appendChild(editButton);
    }

    // Create delete button
    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.setAttribute('data-index', i); // Set data-index attribute to identify the activity index
    deleteButton.addEventListener('click', deleteActivity);
    actionsCell.appendChild(deleteButton);

    row.appendChild(actionsCell);

    // Add the row to the table body
    tbody.appendChild(row);
  }

  // Display the table
  document.getElementById('view').classList.remove('hidden');
}


// Edit an activity
function editActivity(event) {
  var index = event.target.getAttribute('data-index');
  var activity = activityData[index];

  // Set the input field values with the activity data
  document.getElementById('activity').value = activity.activity;
  document.getElementById('startdate').value = activity.startDate;
  document.getElementById('enddate').value = activity.endDate;
  document.getElementById('status').value = activity.status;

  // Remove the activity from the array
  activityData.splice(index, 1);

  // Update the table with the modified data
  displayData();
}

// Delete an activity
function deleteActivity(event) {
  var index = event.target.getAttribute('data-index');

  // Remove the activity from the array
  activityData.splice(index, 1);

  // Update the table
  displayData();
}


// Validate input fields
function validate() {
  var activity = document.getElementById('activity').value;
  var startDate = new Date(document.getElementById('startdate').value);
  var endDate = new Date(document.getElementById('enddate').value);
  var status = document.getElementById('status').value;

  var isValid = true;

  // Validate activity
  if (activity.trim() === '') {
    document.getElementById('activity_error').textContent = 'Activity is required';
    isValid = false;
  } else {
    document.getElementById('activity_error').textContent = '';
  }

  // Validate start date
  if (startDate === '') {
    document.getElementById('startdate_error').textContent = 'Start date is required';
    isValid = false;
  } else {
    document.getElementById('startdate_error').textContent = '';
  }

  // Validate end date
  if (endDate === '') {
    document.getElementById('enddate_error').textContent = 'End date is required';
    isValid = false;
  } else if (endDate < startDate) {
    document.getElementById('enddate_error').textContent = 'End date cannot be earlier than start date';
    isValid = false;
  } else {
    document.getElementById('enddate_error').textContent = '';
  }

  // Validate status
  if (status === '') {
    document.getElementById('status_error').textContent = 'Status is required';
    isValid = false;
  } else {
    document.getElementById('status_error').textContent = '';
  }

  return isValid;
}

// Add event listener to the search input
document.getElementById('search').addEventListener('input', searchTable);

// Search function
function searchTable() {
  var searchInput = document.getElementById('search').value.toLowerCase();
  var rows = document.getElementById('view').getElementsByTagName('tbody')[0].getElementsByTagName('tr');

  // Loop through all table rows
  for (var i = 0; i < rows.length; i++) {
    var cells = rows[i].getElementsByTagName('td');
    var rowMatch = false;

    // Loop through all cells in the row
    for (var j = 0; j < cells.length; j++) {
      var cellValue = cells[j].textContent.toLowerCase();

      if (cellValue.includes(searchInput)) {
        rowMatch = true;
        break; // Stop checking other cells in the row
      }
    }

    if (rowMatch) {
      rows[i].style.display = ''; // Show matching row
    } else {
      rows[i].style.display = 'none'; // Hide non-matching row
    }
  }
}