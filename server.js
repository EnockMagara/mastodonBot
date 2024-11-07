// Import necessary libraries
const database = require('./db'); // Import database module

// Function to fetch statuses from the database
function fetchStatuses() {
  let query = {}; // Define query to fetch all records
  let sortQuery = {
    timestamp: -1 // Sort records in reverse chronological order
  };

  // Fetch statuses from the database
  database.find(query).sort(sortQuery).exec((err, statuses) => {
    if (err) {
      console.error("Error fetching statuses:", err); // Log any errors
    } else {
      console.log("Fetched statuses:", statuses); // Log the fetched statuses

      processStatuses(statuses);
    }
  });
}

// Function to process statuses
function processStatuses(statuses) {
  statuses.forEach(status => {
    console.log("Processing status:", status.text); 

  });
}


setInterval(fetchStatuses, 300000);

// Initial fetch to start the process immediately
fetchStatuses(); 
