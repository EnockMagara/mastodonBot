const Datastore = require('@seald-io/nedb');

// Create a new persistent datastore with automatic loading
const database = new Datastore({
    filename: 'database.txt', 
    autoload: true 
});

// Handle potential errors during autoloading
database.autoloadPromise.catch(error => {
    console.error("Error loading the database:", error);
});

module.exports = database;
