// Developers: Tamir Razon 207421322, Daniel Korkus 314629692

// Define idb object
let idb = {};

// Function to open indexedDB
idb.openCostsDB = function (dbName, versionNumber) {
    return new Promise((resolve, reject) => {
        // Open indexedDB
        const request = window.indexedDB.open(dbName, versionNumber);
        
        // Handle database schema upgrades
        request.onupgradeneeded = function (event) {
            idb.db = event.target.result;
            // Create object store for costs with keyPath and index
            const objectStore = idb.db.createObjectStore("costs", { keyPath: "id", autoIncrement: true });
            objectStore.createIndex("month_and_year", ["year", "month"], { unique: false });
        };

        // On success, set idb.db to the result and resolve the promise
        request.onsuccess = function (event) {
            idb.db = request.result;
            resolve(idb);
        };

        // On error, log the error and reject the promise
        request.onerror = function (event) {
            console.log("opeCostsDB(): error: " + event);
            reject("Error occurred while trying to open the database, error: " + event.target.errorCode);
        };
    });
};

// Function to add a new cost to the database
idb.addCost = function (costItem) {
    return new Promise((resolve, reject) => {
        // Start a read-write transaction
        const tx = idb.db.transaction(["costs"], "readwrite");
        const store = tx.objectStore("costs");

        // Add current date to the costItem
        const date = new Date();
        costItem.day = date.getDate();
        costItem.month = date.getMonth() + 1;
        costItem.year = date.getFullYear();

        // Add the costItem to the object store
        store.add(costItem);

        // On transaction completion, resolve the promise
        tx.oncomplete = function (event) {
            console.log("addCost(): New item has been added.")
            resolve("Success");
        };

        // On transaction error, reject the promise
        tx.onerror = function (event) {
            reject(`Error occurred while trying to add an item, error: ${event.target.errorCode}`);
        };
    });
};

// Function to fetch costs data from the database
idb.getCosts = function (month = null, year = null) {
    return new Promise((resolve, reject) => {
        // Start a transaction
        const transaction = idb.db.transaction(["costs"]);
        const objectStore = transaction.objectStore("costs");

        let isAllDataRequested = false;
        let request;

        // Check if all data is requested
        // If month and year are null - return all data
        if (month === null && year === null) {
            request = getAllData(objectStore);
            isAllDataRequested = true;
        } else {
            // Get year and month range
            const { yearFrom, yearTo, monthFrom, monthTo } = getYearMonthRange(month, year);

            // If invalid range, reject the promise
            if (yearFrom === null || monthFrom === null || yearTo === null || monthTo === null) {
                console.log('getCosts(): The search does not match any result');
                reject('The search does not match any result');
                return;
            }
            // Define key range
            const keyRange = IDBKeyRange.bound([yearFrom, monthFrom], [yearTo, monthTo]);
            const yearToMonthIndex = objectStore.index('month_and_year');
            request = yearToMonthIndex.openCursor(keyRange);
        }
        // On error, reject the promise
        request.onerror = function (event) {
            reject(`Error occurred while trying to read an item, error: ${event.target.errorCode}`);
        };

        const result = [];
        // On success, resolve the promise with the fetched data
        request.onsuccess = function (event) {
            if (isAllDataRequested === true) {
                if (request.result) {
                    console.log("readCosts(): Success, return the result");
                    resolve(request.result);
                }
            }
            else {
                if (request.result) {
                    const cursor = event.target.result;
                    if (cursor) {
                        result.push(cursor.value);
                        cursor.continue();
                    }
                }
                else {
                    resolve(result);
                }
            }
        };
    });
};

// Function to fetch all data from object store
function getAllData(objectStore) {
    const request = objectStore.getAll();
    return request;
}

// Function to get year and month range
function getYearMonthRange(month, year) {
    let yearFrom, yearTo, monthFrom, monthTo;

    // If only year is specified, return that year data
    if (month === null && year != null) {
        yearFrom = yearTo = year;
        const currYear = new Date().getFullYear() % 100;
        monthFrom = 1;
        if (year === currYear) {
            monthTo = new Date().getMonth() + 1;
        } else {
            monthTo = 12;
        }
    } else if (month != null && year != null) { // If month and year are specified, return specified month and year data
        monthFrom = monthTo = month;
        yearFrom = yearTo = year;
    } else if (month != null && year == null) { // If month only, return latest month data
        monthFrom = monthTo = month;
        const currentMonth = new Date().getMonth() + 1;
        // Check if the month was in this year
        if (currentMonth < month) {
            // Get last year
            yearFrom = yearTo = new Date().getFullYear() % 100 - 1;
        } else {
            // Get this year
            yearFrom = yearTo = new Date().getFullYear() % 100;
        }
    }

    return { yearFrom, yearTo, monthFrom, monthTo };


};

// Function to remove a cost from the database
idb.removeCosts = function (id) {
    return new Promise((resolve, reject) => {
         // Start a read-write transaction
        const transaction = this.db.transaction(["costs"], "readwrite");
        const objectStore = transaction.objectStore("costs");

        // Delete the cost item with the given id
        const request = objectStore.delete(id);

        // On success, resolve the promise
        request.onsuccess = async function (event) {
            console.log("removeItem(): The item was removed from the database");
            resolve("Success");
        };

        // On error, reject the promise
        request.onerror = function (event) {
            console.log(`Error occurred while trying to remove an item, error: ${event.target.errorCode}`);
            reject("Fail");
        };

    });
}

export default idb;